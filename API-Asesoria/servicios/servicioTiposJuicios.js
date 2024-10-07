
const controlTiposDeJuicio = require('../controles/controlTipoJuicio');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');


/**
 * @abstract Servicio  que permite agregar un tipo de juicio
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} tipo de juicio agregado a la base de datos
 * */

const agregarTipoDeJuicio = asyncError(async (req, res, next) => {
  
  logger.info("Petición para agregar un tipo de juicio", req.body)
   
  logger.info("Se llama al control de tipos de juicio, y asi el de agregar tipo de juicio")
  const result = await controlTiposDeJuicio.agregarTipoDeJuicio(req.body);
 
  logger.info("Se valida el resultado de la consulta de tipos de juicio")
  if (result === false) {
    logger.error("Error al agregar un tipo de juicio")
    const error = new CustomeError('Error al agregar un tipo de juicio', 400);
    return next(error);
  } else {
    logger.info("Se retorna el tipo de juicio agregado", result)
    res.status(201).json({
      tipoDeJuicio: result
    });
  }
});


/**
 *  
 * @abstract Servicio  que permite obtener todos los tipos de juicio
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} tipos de juicio de la base de datos
 */

const obtenerTiposDeJuicio = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los tipos de juicio, en base a si estan activos o no")
  const activo = req.query.activo;

   logger.info("Se valida si se envio el parametro activo")
  if (activo !== undefined && activo !== null && activo !== "") {

    logger.info("Se llama al control de tipos de juicio, y asi el de obtener tipos de juicio, en base a si estan activos")
    const result = await controlTiposDeJuicio.obtenerTiposDeJuicio(activo);
    logger.info("Se valida el resultado de la consulta de tipos de juicio")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron tipos de juicio")
      const error = new CustomeError('No se encontraron tipos de juicio', 404);
      return next(error);
    } else {
      logger.info("Se retornan los tipos de juicio")
      res.status(200).json({
        tiposDeJuicio: result
      });
    }
  } else {
    logger.info("Se llama al control de tipos de juicio, y asi el de obtener tipos de juicio, donde activo es nulo")
    const result = await controlTiposDeJuicio.obtenerTiposDeJuicio(null);
    logger.info("Se valida el resultado de la consulta de tipos de juicio")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron tipos de juicio")
      const error = new CustomeError('No se encontraron tipos de juicio', 404);
      return next(error);
    } else {
      logger.info("Se retornan los tipos de juicio")
      res.status(200).json({
        tiposDeJuicio: result
      });
    }
  }
});


/**
 * @abstract Servicio  que permite actualizar un tipo de juicio
 * @param {Object} req Request
 * @param {Object} res Response
 * 
 *  @param {Object} next Next
 * @returns {Object} tipo de juicio actualizado
 */

const actualizarTipoDeJuicio = asyncError(async (req, res, next) => {
  logger.info("Petición para actualizar un tipo de juicio", req.body)

  logger.info("Se llama al control de tipos de juicio, y asi el de actualizar tipo de juicio")
  const result = await controlTiposDeJuicio.actualizarTipoDeJuicio(req.body);
  logger.info("Se valida el resultado de la consulta de tipos de juicio")
  if (result === false) {
    logger.error("Error al actualizar un tipo de juicio")
    const error = new CustomeError('Error al actualizar el tipo de juicio', 400);
    return next(error);
  } else {
    logger.info("Se retorna el tipo de juicio actualizado", result)
    res.status(200).json({
      tipoDeJuicio: req.body
    });
  }
});

/**
 *  
 * @abstract Servicio  que permite obtener un tipo de juicio por id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} tipo de juicio de la base de datos
 */

const obtenerTipoDeJuicioPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener el tipo de juicio por id", req.params.id)

  logger.info("Se llama al control de tipos de juicio, y asi el de obtener tipo de juicio por id")
  const result = await controlTiposDeJuicio.obtenerTipoDeJuicioPorId(req.params.id);

  logger.info("Se valida el resultado de la consulta de tipos de juicio")
  if (result === null || result === undefined) {
    logger.error("Error al obtener un tipo de juicio")
    const error = new CustomeError('Error al obtener el tipo de juicio', 404);
    return next(error);
  } else {
    logger.info("Se retorna el tipo de juicio")
    res.status(200).json({
      tipoDeJuicio: result
    });
  }
});


const obtenerTiposDeJuicioPaginacion = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los tipos de juicio, en base a la paginación") 

  logger.info("Se obtiene la pagina y el total de tipos de juicio")
  const pagina = req.query.pagina;
  const total = req.query.total;

  logger.info("Se valida si se envio el parametro total, para obtener el total de tipos de juicio o los tipos de juicio paginados")
   if (total === "true") { 
    logger.info("Se llama al control de tipos de juicio, y asi el de obtener el total de tipos de juicio")
       const result = await controlTiposDeJuicio.obtenerTotalTiposDeJuicio();
    if (result === null || result === undefined) {
      logger.error("Error al obtener el total de tipos de juicio")
      const error = new CustomeError('Error al obtener el total de tipos de juicio', 404);
      return next(error);
    } else {
      logger.info("Se retorna el total de tipos de juicio")
      res.status(200).json({
        totalTiposDeJuicio: result
      });
    }

  } else {
    logger.info("Se llama al control de tipos de juicio, y asi el de obtener tipos de juicio paginados")
    const result = await controlTiposDeJuicio.obtenerTiposDeJuicioPaginacion(pagina);
    logger.info("Se valida el resultado de la consulta de tipos de juicio")
    if (result === null || result === undefined || result.length === 0) {
      logger.error("Error al obtener los tipos de juicio")
      const error = new CustomeError('Error al obtener los tipos de juicio', 404);
      return next(error);
    } else {
      logger.info("Se retornan los tipos de juicio")
      res.status(200).json({
        tiposDeJuicio: result
      });
    }
  }
}
);

//Module exports
module.exports = {
  agregarTipoDeJuicio,
  obtenerTiposDeJuicio,
  actualizarTipoDeJuicio,
  obtenerTipoDeJuicioPorId,
  obtenerTiposDeJuicioPaginacion
};