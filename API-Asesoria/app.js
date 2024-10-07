//Variables requeridas https

const https = require('https');
const fs = require('fs');
const path = require('path');

// Variable para cargar el módulo de express 
const express = require('express');
// Puerto en el que se ejecutará el servidor
const {PORT,HOSTTOKENUSUARIOS,GRPCPORTASESORIAS,
   DEPLOY
   , IPS, DEPLOYCORS

} = require("./configuracion/default.js");
// Rutas de la aplicación
const zonasRutas = require("./rutas/zonaRutas");
const tipoDeJuiciosRutas = require("./rutas/tipoJuicioRutas");
const generosRutas = require("./rutas/generoRutas");
const estadosCivilesRutas = require("./rutas/estadoCivilRutas");
const motivosRutas = require("./rutas/motivoRutas");
const asesoriasRutas = require("./rutas/asesoriaRutas");
const asesoresRutas = require("./rutas/asesorRutas");
const turnoRutas = require("./rutas/turnoRutas");
const catalogoRequisitosRutas = require("./rutas/catalogoRequisitoRuta");
const asesoradoRutas = require("./rutas/asesorRutas");


const defensorRuta = require("./rutas/defensorRuta.js");
const distritoJudicialRuta = require("./rutas/distritoJudicialRuta.js");
const empleadoRuta = require("./rutas/empleadoRuta.js");
const municipioDistro = require("./rutas/municipioDistroRuta.js");

// Variable para cargar el módulo de gRPC
const grpc = require('@grpc/grpc-js');
// Variable para cargar el módulo de proto-loader
const { packageDefinition3 } = require("./clienteUsuarios/cliente.js")
// Variable para cargar el módulo de errores personalizados
const CustomeError = require("./utilidades/customeError");
// Variable para cargar el módulo de control de errores
const errorController = require("./utilidades/errrorController")

const logger = require('./utilidades/logger');
// Variable para cargar el módulo de cors
const cors = require('cors');
// Variable para cargar el módulo de express

const app = express();

app.use(express.json());


if(DEPLOYCORS === 'YES'){

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
else{
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
  const serviciosProto = grpc.loadPackageDefinition(packageDefinition3).servicios;

  const tokenClient = new serviciosProto.TokenService(HOSTTOKENUSUARIOS, grpc.credentials.createInsecure());

  tokenClient.validarToken({ token: token }, (err, response) => {
    if (err) {
      const customeError = new CustomeError('Error en la validación del token.', 500);
      next(customeError);
      return;
    }
    //se supone response.permisos es un array, no hay metodo que lo trate como arreglo
     const permisos =  response.permisos;
     const id_distrito_judicial = response.id_distrito_judicial;
     const id_usuario = response.id_usuario;
     const id_tipouser = response.id_tipouser;
     const id_empleado = response.id_empleado;
    if ( permisos=== 0) {
      const customeError = new CustomeError('Token inválido, no ha iniciado sesión o no cuenta con permisos.', 401);
       logger.warn('Token inválido.');
      next(customeError);
    } else{
      req.id_tipouser = id_tipouser;
      req.id_usuario = id_usuario;
      req.id_empleado = id_empleado;
      req.id_distrito_judicial = id_distrito_judicial;
      req.permisos = response.permisos;
      next();
    }

  });
};


app.use('/tipos-de-juicio', 
jwtMiddleware, 
tipoDeJuiciosRutas);
// Usamos el middleware de validación de tokens en nuestras rutas
app.use('/asesorias', 
jwtMiddleware, 
asesoriasRutas);

app.use('/asesores',
 jwtMiddleware,
  asesoresRutas);
app.use('/generos', 
jwtMiddleware,
 generosRutas);
app.use('/estados-civiles',
 jwtMiddleware, 
 estadosCivilesRutas);
app.use('/motivos',
jwtMiddleware, 
 motivosRutas);
app.use('/zonas',
 jwtMiddleware, 
 zonasRutas);
app.use('/turnos', 
jwtMiddleware, 
turnoRutas);
app.use('/catalogo-requisitos', 
jwtMiddleware, 
catalogoRequisitosRutas);
app.use('/defensores',
 jwtMiddleware,
  defensorRuta);
app.use('/distritos-judiciales', 
jwtMiddleware,
 distritoJudicialRuta);
app.use('/empleados',
 jwtMiddleware,
  empleadoRuta);
app.use('/municipios-distritos', 
jwtMiddleware,
 municipioDistro);


// Middleware para manejar las rutas no encontradas
app.all("*", (req, res, next) => {
  const err = new CustomeError("Cannot find " + req.originalUrl + " on the server", 404);
  logger.warn(`Cannot find ${req.originalUrl} on the server`);
  next(err);
});
// Middleware para manejar los errores
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





const { packageDefinition2 } = require("./grpc/route.server")
const grpc2 = require('@grpc/grpc-js');

/**
* Importamos el controlador de jwt,roteguide y constantes de respuesta
*/
//const jwtController = require("./utilidades/jwtController");
const routeguide = grpc2.loadPackageDefinition(packageDefinition2).servicios;
const responseValidoEmpleado = { message: 'Empleado válido' };
const responseInvalidoEmpleado = { message: 'Empleado inválido' };
const responseValidoDistrito = { message: 'Distrito válido' };
const responseInvalidoDistrito = { message: 'Distrito inválido' };

 const responseValidoTurno = { message: 'Turno válido' };
const responseInvalidoTurno = { message: 'Turno inválido' };

 const responseValidoTipoJuicio = { message: 'Tipo Juicio válido' };
const responseInvalidoTipoJuicio = { message: 'Tipo Juicio inválido' };


const responseValidoMunicipio = { message: 'Municipio válido' };
const responseInvalidoMunicipio = { message: 'Municipio inválido' };

  const responseValidoDefensor = { message: 'Defensor válido' };
const responseInvalidoDefensor = { message: 'Defensor inválido' };

const responseValidoGenero = { message: 'Genero válido' };
const responseInvalidoGenero = { message: 'Genero inválido' };


const controlGeneros = require("./controles/controlGenero.js");
const controlEmpleados = require("./controles/controlEmpleados.js");
const controlDistritos = require("./controles/controlDistritosJudiciales.js");
const controlMunicipios = require("./controles/controlMunicipioDistro.js");
const controlTurnos = require("./controles/controlTurno.js");
const controlTipoJuicio = require("./controles/controlTipoJuicio.js");
const controlDefensores = require("./controles/controlDefensor.js");
const { log } = require('winston');
/**
* Función que permite crear el servidor GRPC el cual valida el token
*  */
function getServer() {
 var server = new grpc2.Server();
 server.addService(routeguide.EmpleadoService.service, {
   validarEmpleado: (call, callback) => {
    controlEmpleados.obtenerEmpleadoIDAndDistrito(call.request).then((response) => {
       if (response !== null) {
         callback(null, responseValidoEmpleado);
       } else {
         callback(null, responseInvalidoEmpleado);
       }

     }).catch((err) => {
       logger.error(`gRPC Error: ${err.message}`);
       callback(null, responseInvalidoEmpleado);
     });
   }
 });

 server.addService(routeguide.DistritoService.service, {
  validarDistrito: (call, callback) => {
   controlDistritos.obtenerDistritoJudicial(call.request.id_distrito_judicial).then((response) => {
      if (response !== null) {
        callback(null, responseValidoDistrito);
      } else {
        callback(null, responseInvalidoDistrito);
      }

    }).catch((err) => {
       logger.error(`gRPC Error: ${err.message}`);
      callback(null, responseInvalidoDistrito);
    });
  }
});
 /*
service GeneroService {
  rpc validarGenero(ValidacionGeneroRequest) returns (ValidacionResponse) {}
}

message ValidacionGeneroRequest {
  string id_genero = 1;
}
 */
server.addService(routeguide.GeneroService.service, {
  validarGenero: (call, callback) => {  
    controlGeneros.obtenerGeneroPorId(call.request.id_genero).then((response) => {
      if (response !== null) {
        callback(null, responseValidoGenero);
      } else {
        callback(null, responseInvalidoGenero);
      }

    }
    ).catch((err) => {
      logger.error(`gRPC Error: ${err.message}`);
      callback(null, responseInvalidoGenero);
    }
    );
  }
});

server.addService(routeguide.MunicipioDistritoService.service, {
  validarMunicipio: (call, callback) => {
    controlMunicipios.obtenerMunicipioPorId(call.request.id_municipio_distrito).then((response) => {
      if (response !== null) {
        callback(null, responseValidoMunicipio);
      } else {
        callback(null, responseInvalidoMunicipio);
      }

    }).catch((err) => {
       logger.error(`gRPC Error: ${err.message}`);
      callback(null, responseInvalidoMunicipio);
    });
  }

});

 
server.addService(routeguide.TurnoService.service, {
  validarTurno: (call, callback) => {
   controlTurnos.onbtenerTurnoIDSimple(call.request.id_turno).then((response) => {
      if (response !== null) {
        callback(null,  responseValidoTurno);
      } else {
        callback(null, responseInvalidoTurno);
      }

    }).catch((err) => {
       logger.error(`gRPC Error: ${err.message}`);
      callback(null,  responseInvalidoTurno);
    });
  }

});


server.addService(routeguide.TipoJuicioService.service, {
  validarTipoJuicio: (call, callback) => {
   controlTipoJuicio.obtenerTipoDeJuicioPorId(call.request.id_tipo_juicio).then((response) => {
      if (response !== null) {
        callback(null,  responseValidoTipoJuicio);
      } else {
        callback(null,  responseInvalidoTipoJuicio);
      }

    }).catch((err) => {
       logger.error(`gRPC Error: ${err.message}`);
      callback(null,  responseInvalidoTipoJuicio);
    });
  }

});


server.addService(routeguide.DefensorService.service, {
  validarDefensor: (call, callback) => {
   controlDefensores.obtenerDefensorPorId(call.request.id_defensor).then((response) => {
      if (response !== null) {
        callback(null, responseValidoDefensor);
      } else {
        callback(null,  responseInvalidoDefensor);
      }

    }).catch((err) => {
      callback(null, responseInvalidoDefensor);
    });
  }

});

 return server;
}

//if (DEPLOY === 'DEPLOYA') {
  const server = getServer();
  server.bindAsync(GRPCPORTASESORIAS, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error(`Error binding gRPC server: ${error.message}`);
      return;
    }
    console.log(`gRPC listening on ${GRPCPORTASESORIAS}`);
  });

  /*
} else if (DEPLOY === 'DEPLOYB') {
  const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, 'server.cer'), 'utf8');
  const credentials = grpc.ServerCredentials.createSsl(null, [{
    cert_chain: Buffer.from(certificate),
    private_key: Buffer.from(privateKey)
  }], true);

  const server = getServer();
  server.bindAsync(`localhost:${GRPCPORTASESORIAS}`, credentials, (error, port) => {
    if (error) {
      console.error(`Error binding gRPC server with SSL: ${error.message}`);
      return;
    }
    console.log(`gRPC listening on https://${GRPCPORTASESORIAS}`);
  });
}
  */