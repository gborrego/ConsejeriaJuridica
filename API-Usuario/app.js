//Variables requeridas https

const https = require('https');
const fs = require('fs');
const path = require('path');


// Importamos los módulos necesarios
const express = require('express');
const { PORT, GRPCPORTUSUARIOS, DEPLOY, IPS } = require("./configuracion/default.js");

const usuariosRutas = require("./rutas/usuarioRutas");


const CustomeError = require("./utilidades/customeError");
const errorController = require("./utilidades/errrorController")


const jwtController = require("./utilidades/jwtController");

const logger = require('./utilidades/logger');

// Importamos el módulo cors para permitir solicitudes de origen cruzado
const cors = require('cors');


const app = express();

app.use(express.json());

if (process.env.DEPLOYCORS === 'YES') { 

let allowedIPs;

try {
  allowedIPs = process.env.IPS.split(',').map(ip => ip.trim());
  console.log(allowedIPs);
} catch (error) {
  console.error('Error parsing IPS environment variable:', error.message);
  allowedIPs = []; // Maneja el error de la forma que consideres adecuada
}


const corsOptions = (req, callback) => {
  console.log(allowedIPs);

  let requestIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

  // Si requestIP es una dirección IPv6-mapeada-a-IPv4, la limpiamos
  if (requestIP && requestIP.includes('::ffff:')) {
    requestIP = requestIP.replace('::ffff:', '');
  }

  console.log('Request IP:', requestIP);

  if (allowedIPs.includes(requestIP)) {
    console.log('Permitido');
    // Si la IP está permitida, permite la solicitud CORS
    callback(null, {
      origin: true, // Permite todas las solicitudes CORS
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
    });
  } else {
    console.log('No Permitido');
    // Si la IP no está permitida, rechaza la solicitud CORS
    callback(new Error('No autorizado por CORS'));
  }
};

 
// Aplica el middleware de CORS/IP Whitelisting
app.use(cors(corsOptions));
}
else {
  app.use(cors());
}

// Middleware para loguear cada petición con URL completa, headers, y cuerpo
app.use((req, res, next) => {
  const { method, url, body, query, headers } = req;

  // Filtrar solo los encabezados relevantes
  const relevantHeaders = {
    authorization: headers.authorization,
    'user-agent': headers['user-agent'],
    referer: headers.referer,
    origin: headers.origin
  };
  logger.info(`Request: ${method} ${url} - Headers: ${JSON.stringify(relevantHeaders)} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(body)}`);
  next();
});

const jwtMiddleware = async (req, res, next) => {
  // Obtenemos el token del encabezado de la solicitud de ahora en adelante con logger realizar un log de cada cuerpo del copdigo
  logger.info('Verificando token');
  logger.info(req.path);
  logger.info("Se evalua la ruta de usuario o recuperacion, esto es para el caso de que no se tenga token, osea inicio de sesion o recuperacion de contraseña");
  if (req.path === "/usuario" || req.path === "/recuperacion") {
     logger.info("Se permite el acceso a la ruta de usuario o recuperacion")
     logger.info("Se continua con el siguiente middleware")
     next();
  } else {
    
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      // Si no hay token, creamos un error personalizado y lo pasamos al siguiente middleware
      const customeError = new CustomeError('Token no proporcionado.', 401);
      logger.warn('Token no proporcionado, no ha iniciado sesión o cuenta con permisos');
      next(customeError);
      return;
    }
    // Eliminamos el prefijo 'Bearer ' del token
    logger.info('Token proporcionado, verificando...');
    const token = tokenHeader.replace('Bearer ', '');
    try {
      logger.info('Token verificando...');
      const data = await jwtController.verifyToken(token);
      logger.info('Token verificado.');
      req.id_usuario = data.id_usuario;
      req.id_tipouser = data.id_tipouser;
      req.id_empleado = data.id_empleado;
      req.id_distrito_judicial = data.id_distrito_judicial;
      req.permisos = data.permisos;
      logger.info('Se continua con el siguiente middleware, se ha verificado el token', data);
      next();
    } catch (error) {
      const customeError = new CustomeError('Token inválido, no ha iniciado sesión o cuenta con permisos', 401);
      logger.warn('Token inválido.');
      next(customeError);
    }
  }

};

// Usamos el middleware de rutas de usuarios
app.use('/usuarios',
  jwtMiddleware,
  usuariosRutas);


// Si ninguna ruta coincide, creamos un error personalizado y lo pasamos al siguiente middleware
app.all("*", (req, res, next) => {
  const err = new CustomeError("No se puede encontrar " + req.originalUrl + " en el servidor", 404);
  logger.warn("No se puede encontrar " + req.originalUrl + " en el servidor");
  next(err);
});

// Usamos el controlador de errores como último middleware
app.use(errorController);


if (DEPLOY === 'DEPLOYA') {
  app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`);
  });
} else if (DEPLOY === 'DEPLOYB') {
  const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, 'server.cer'), 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT, () => {
    logger.info(`Aplicación HTTPS corriendo en el puerto ${PORT}`);
  });
}




const { packageDefinition } = require("./grpc/route.server");
const grpc = require('@grpc/grpc-js');

const serviciosProto = grpc.loadPackageDefinition(packageDefinition).servicios;

const responseValido = { message: 'Token válido' };
const responseInvalido = { message: 'Token inválido' };

/**
 * Función que permite crear el servidor GRPC el cual valida el token y el usuario.
 */
function getServer() {
  const server = new grpc.Server();

  server.addService(serviciosProto.TokenService.service, {
    validarToken: (call, callback) => {
      jwtController.verifyToken(call.request.token)
        .then((data) => {
          logger.info('Token válido, se procede a retornar los permisos, id_distrito_judicial, id_usuario, id_tipouser e id_empleado');
          callback(null, {
            permisos: data.permisos, id_distrito_judicial: data.id_distrito_judicial,
            id_usuario: data.id_usuario, id_tipouser: data.id_tipouser , id_empleado: data.id_empleado
          });
        })
        .catch((error) => {
          logger.error('Error en la validación del token: ', error.message);
          callback(null, { permisos: [] });
        });
    }
  });

  server.addService(serviciosProto.UsuarioService.service, {
    validarUsuario: (call, callback) => {
      // Aquí puedes agregar la lógica para validar el usuario
      const { id_usuario, usuario } = call.request;
      controlUsuarios.obtenerUsuarioByIDAndNameGrpc(id_usuario, usuario)
        .then((usuario) => {
          logger.info('Usuario: ', usuario);
          if (usuario) {
            logger.info('Usuario válido, a traves del id y nombre');
            callback(null, { message: 'Usuario válido' });
          } else {
            logger.warn('Usuario inválido');
            callback(null, { message: 'Usuario inválido' });
          }
        })
        .catch(() => {
          logger.error('Error en la validación del usuario: ', error.message);
          callback(null, { message: 'Usuario inválido' });
        });
    }
  });

  return server;
}

const controlUsuarios = require("./controles/controlUsuario");
const { log } = require('winston');



//if (DEPLOY === 'DEPLOYA') {
  const server = getServer();
  server.bindAsync(GRPCPORTUSUARIOS, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error(`Error binding gRPC server: ${error.message}`);
      return;
    }
    console.log(`gRPC listening on ${GRPCPORTUSUARIOS}`);
  });
/*

}

else if (DEPLOY === 'DEPLOYB') {
  const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, 'server.cer'), 'utf8');
  const credentials = grpc.ServerCredentials.createSsl(null, [{
    cert_chain: Buffer.from(certificate),
    private_key: Buffer.from(privateKey)
  }], true);

  const server = getServer();
  server.bindAsync(`localhost:${GRPCPORTUSUARIOS}`, credentials, (error, port) => {
    if (error) {
      console.error(`Error binding gRPC server with SSL: ${error.message}`);
      return;
    }
    console.log(`gRPC listening on https://${GRPCPORTUSUARIOS}`);
  });
}
*/