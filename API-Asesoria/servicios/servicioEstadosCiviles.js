const controlEstados = require('../controles/controlEstadoCivil');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");
const logger = require('../utilidades/logger');

/**
 * @abstract Servicio  que permite agregar un estado civil
 * @param {Object} req Request  
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} estado civil agregado a la base de datos
 * */
const agregarEstadoCivil = asyncError(async (req, res, next) => {
   logger.info("Petición para agregar un estado civil", req.body)


   logger.info("Se llama al control de estados civiles, y asi el de agregar estado civil")

  const result = await controlEstados.agregarEstadoCivil(req.body);
   
  logger.info("Se valida el resultado de la consulta de estados civiles")
  if (result === false) {
    logger.error("Error al agregar un estado civil")
    const error = new CustomeError('Error al agregar un estado civil', 400);
    return next(error);
  } else {
    logger.info("Estado civil agregado correctamente")  
    res.status(201).json({
        estadoCivil:result
    });
  }
});


/**
 * @abstract Servicio  que permite obtener todos los estados civiles
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} estados civiles de la base de datos
 */

const obtenerEstadosCiviles = asyncError(async (req, res, next) => {

  logger.info("Petición para obtener los estados civiles, en base a si estan activos o no")
   
  const activo = req.query.activo;
  logger.info("Se valida si se envió el parámetro activo en la petición, esto con el fin de obtener los estados civiles activos o inactivos")
  if (activo !== undefined && activo !== null && activo !== "") {
    logger.info("Se llama al control de estados civiles, y asi el de obtener estados civiles, en base a si estan activos")
    const result = await controlEstados.obtenerEstadosCiviles(activo);
    logger.info("Se valida el resultado de la consulta de estados civiles")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron estados civiles")
      const error = new CustomeError('No se encontraron estados civiles', 404);
      return next(error);
    } else {
      logger.info("Se retornan los estados civiles")
      res.status(200).json({
          estadosCiviles: result
      });
    }

  }else {
    logger.info("Se llama al control de estados civiles, y asi el de obtener estados civiles")
    const result = await controlEstados.obtenerEstadosCiviles();
    logger.info("Se valida el resultado de la consulta de estados civiles")
    if (result === null || result === undefined   || result.length === 0) {
      logger.info("No se encontraron estados civiles")
      const error = new CustomeError('No se encontraron estados civiles', 404);
      return next(error);
    } else {
      logger.info("Se retornan los estados civiles")
      res.status(200).json({
          estadosCiviles: result
      });
    }
    
  }



});


/**
 * @abstract Servicio  que permite actualizar un estado civil
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} estado civil actualizado en la base de datos
 */

const actualizarEstadoCivil = asyncError(async (req, res, next) => {
  logger.info("Petición para actualizar un estado civil", req.body)


  logger.info("Se llama al control de estados civiles, y asi el de actualizar estado civil")
  
  const result = await controlEstados.actualizarEstadoCivil(req.body);
  logger.info("Se valida el resultado de la consulta de estados civiles")
  if ( result === false) {
    logger.error("Error al actualizar el estado civil")
    const error = new CustomeError('Error al actualizar el estado civil', 400);
    return next(error);
  } else {
    logger.info("Estado civil actualizado correctamente")
    res.status(200).json({
        estadoCivil: req.body
    });
  }
});

/**
 * @abstract Servicio  que permite obtener un estado civil por id
 * @param {Object} req Request
 * @param {Object} res Response
 *  @param {Object} next Next
 * @returns {Object} estado civil de la base de datos
 */

const obtenerEstadoCivilPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener el estado civil por id", req.params.id)

  logger.info("Se llama al control de estados civiles, y asi el de obtener estado civil por id")
  const result = await controlEstados.obtenerEstadoCivilPorId(req.params.id);

  logger.info("Se valida el resultado de la consulta de estados civiles")
  if (result === null || result === undefined) {

    logger.error("Error al obtener un estado civil")
    const error = new CustomeError('Error al obtener el estado civil', 404);
    return next(error);
  } else {
    logger.info("Se retorna el estado civil")
    res.status(200).json({
        estadoCivil: result
    });
  }
});


 
const obtenerEstadosCivilesPaginacion = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los estados civiles, en base a la paginación")

  logger.info("Se obtiene el número de página y si se quiere obtener el total de estados civiles")
  const pagina = req.query.pagina;
  const total = req.query.total;

  logger.info("Se valida si se quiere obtener el total de estados civiles o los estados civiles paginados")
  if (total === "true") {  
    logger.info("Se llama al control de estados civiles, y asi el de obtener total de estados civiles")
      const result = await controlEstados.obtenerTotalEstadosCiviles();
    logger.info("Se valida el resultado de la consulta de estados civiles")
    if (result === null || result === undefined) {
      logger.error("Error al obtener el total de estados civiles")
      const error = new CustomeError('Error al obtener el total de estados civiles', 404);
      return next(error);
    } else {
      logger.info("Se retornan el total de estados civiles")
      res.status(200).json({
        totalEstadosCiviles: result
      });
    }

  } else {
    logger.info("Se llama al control de estados civiles, y asi el de obtener estados civiles paginados")
    const result = await controlEstados.obtenerEstadosCivilesPaginacion(pagina);
    logger.info("Se valida el resultado de la consulta de estados civiles")
    if (result === null || result === undefined || result.length === 0) {
      logger.error("Error al obtener los estados civiles")
      const error = new CustomeError('Error al obtener los estados civiles', 404);
      return next(error);
    } else {
      logger.info("Se retornan los estados civiles")
      res.status(200).json({
        estadosCiviles: result
      });
    }
  }
} 
);

//Module exports
module.exports = {
  agregarEstadoCivil,
  obtenerEstadosCiviles,
  actualizarEstadoCivil,
  obtenerEstadoCivilPorId,
  obtenerEstadosCivilesPaginacion
};