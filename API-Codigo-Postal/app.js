//Variables requeridas https¨

const https = require('https');
const fs = require('fs');
const path = require('path');


const express = require("express");
const { PORT, HOSTTOKENUSUARIOS, GRPCPORTCODIGOSPOSTALES, DEPLOY, IPS } = require("./config/default.js");
const estadosRoutes = require('./routes/estados.routes.js');
const codigosPostalesRoutes = require('./routes/codigosPostales.routes.js');
const coloniasRoutes = require('./routes/colonias.routes.js');
const CustomeError = require("./utilities/customeError.js");
const grpc = require('@grpc/grpc-js');
const { packageDefinition } = require("./clienteUsuarios/cliente.js");
const errorController = require("./utilities/errrorController.js");
const cors = require('cors');
const logger = require('./utilities/logger.js'); // Importa el logger


const app = express();

app.use(express.json());

let allowedIPs;

if (process.env.DEPLOYCORS === 'YES') {

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


/*

const app = express();

// Usamos el middleware express.json() para analizar las solicitudes con cuerpos JSON
app.use(express.json());

// Usamos el middleware cors para permitir solicitudes de origen cruzado
app.use(cors());
*/


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
  const tokenHeader = req.headers.authorization; // Obtener el valor del encabezado "Authorization"
  // Verificar si el token existe en el encabezado
  if (!tokenHeader) {
    const customeError = new CustomeError('Token no proporcionado.', 401);
    logger.warn('Token no proporcionado.');
    next(customeError);
    return;
  }

  // Extraer el token del encabezado "Authorization"
  const token = tokenHeader.replace('Bearer ', ''); // Quita "Bearer " del encabezado
  const serviciosProto = grpc.loadPackageDefinition(packageDefinition).servicios;

  const tokenClient = new serviciosProto.TokenService(HOSTTOKENUSUARIOS, grpc.credentials.createInsecure());

  tokenClient.validarToken({ token: token }, (err, response) => {
    if (err) {
      logger.error(`Error al validar el token: ${err.message}`);
      const customeError = new CustomeError('Error en la validación del token.', 500);
      next(customeError);
      return;
    }
    //se supone response.permisos es un array, no hay metodo que lo trate como arreglo
    const permisos = response.permisos;
    const id_distrito_judicial = response.id_distrito_judicial;
    const id_usuario = response.id_usuario;
    const id_tipouser = response.id_tipouser;
    const id_empleado = response.id_empleado;
    if (permisos === 0) {
      const customeError = new CustomeError('Token inválido, no ha iniciado sesión o no cuenta con permisos.', 401);
      logger.warn('Token inválido.');
      next(customeError);
    } else {
      req.id_tipouser = id_tipouser;
      req.id_usuario = id_usuario;
      req.id_empleado = id_empleado;
      req.id_distrito_judicial = id_distrito_judicial;
      req.permisos = response.permisos;
      next();
    }

  });
};

app.use('/colonias', jwtMiddleware, coloniasRoutes);
app.use('/codigospostales', jwtMiddleware, codigosPostalesRoutes);
app.use('/estados', jwtMiddleware, estadosRoutes);

app.all("*", (req, res, next) => {
  const err = new CustomeError("Cannot find " + req.originalUrl + " on the server", 404);
  logger.warn(`Cannot find ${req.originalUrl} on the server`);
  next(err);
});

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  errorController(err, req, res, next);
});



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



const { packageDefinition2 } = require("./grpc/route.server");
const grpc2 = require('@grpc/grpc-js');
const routeguide = grpc2.loadPackageDefinition(packageDefinition2).codigoService;
const responseValido = { message: 'Codigo válido' };
const responseInvalido = { message: 'Codigo inválido' };
const controlColonias = require("./controllers/colonias.controllers.js");

function getServer() {
  var server = new grpc2.Server();
  server.addService(routeguide.CodigoService.service, {
    validarCodigo: (call, callback) => {
      controlColonias.getColoniaByIDService(call.request.id_colonia).then((response) => {
        if (response !== null) {
          callback(null, responseValido);
        } else {
          callback(null, responseInvalido);
        }
      }).catch((err) => {
        logger.error(`gRPC Error: ${err.message}`);
        callback(null, responseInvalido);
      });
    }
  });
  return server;
}



//if (DEPLOY === 'DEPLOYA') {
const server = getServer();
server.bindAsync(GRPCPORTCODIGOSPOSTALES, grpc2.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(`Error binding gRPC server: ${error.message}`);
    return;
  }
  console.log(`gRPC listening on ${GRPCPORTCODIGOSPOSTALES}`);
});
/*
}
else if (DEPLOY === 'DEPLOYB') {
const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'server.cer'), 'utf8');
const credentials = grpc2.ServerCredentials.createSsl(null, [{
  cert_chain: Buffer.from(certificate),
  private_key: Buffer.from(privateKey)
}], true);

const server = getServer();
server.bindAsync(`localhost:${GRPCPORTCODIGOSPOSTALES}`, credentials, (error, port) => {
  if (error) {
    console.error(`Error binding gRPC server with SSL: ${error.message}`);
    return;
  }
  console.log(`gRPC listening on https://${GRPCPORTCODIGOSPOSTALES}`);
});
}
*/
