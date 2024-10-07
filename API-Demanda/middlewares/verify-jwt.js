const grpc = require('@grpc/grpc-js')
const { packageDefinition } = require('../clienteUsuarios/cliente')
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');

/**
 * @abstract Middleware que verifica y valida el token JWT en el encabezado "Authorization" de la solicitud
 * @param {object} req - Objeto de la solicitud
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función que pasa al siguiente middleware
 * @returns {object} Retorna un mensaje de error si el token no es válido o no se proporcionó, de lo contrario pasa al siguiente middleware
 */
const jwtMiddleware = async (req, res, next) => {

  logger.info('Verificando token de autenticación');
  const tokenHeader = req.headers.authorization; // Obtener el valor del encabezado "Authorization"

  logger.info('Token de autenticación', tokenHeader);
  // Verificar si el token existe en el encabezado
  if (!tokenHeader) {
    logger.error('No se proporcionó un token de autenticación.');
    res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
  } else {
    logger.info('Extrayendo token de autenticación');

    // Extraer el token del encabezado "Authorization"
    const token = tokenHeader.replace('Bearer ', ''); // Quita "Bearer " del encabezado
    const serviciosProto = grpc.loadPackageDefinition(packageDefinition).servicios;

    logger.info('Creando cliente gRPC para validar el token de autenticación');
    const tokenClient = new serviciosProto.TokenService(process.env.HOSTTOKENUSUARIOS, grpc.credentials.createInsecure());

    logger.info('Validando token de autenticación');
    tokenClient.validarToken({ token: token }, (err, response) => {
      if (err) {
        logger.error('Error al validar el token', err);
        res.status(500).json({ message: 'Error al validar el token.' });
      }

       //se supone response.permisos es un array, no hay metodo que lo trate como arreglo
       const permisos =  response.permisos;
       const id_distrito_judicial = response.id_distrito_judicial;
       const id_usuario = response.id_usuario;
       const id_tipouser = response.id_tipouser; 
       const id_empleado = response.id_empleado;
       logger.info('Permisos', permisos);
      if ( permisos=== 0) {
        logger.error('Token inválido, no ha iniciado sesión o no cuenta con permisos.');
        const customeError = new CustomeError('Token inválido, no ha iniciado sesión o no cuenta con permisos.', 401);
        next(customeError);
      } else{
        req.id_tipouser = id_tipouser;
        req.id_empleado = id_empleado;
        req.id_usuario = id_usuario;
        req.id_distrito_judicial = id_distrito_judicial;
        req.permisos = response.permisos;
        logger.info('Token válido');
        next();
      }
    });
  }


};

module.exports = jwtMiddleware
