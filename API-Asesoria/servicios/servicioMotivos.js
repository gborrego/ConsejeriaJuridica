const controlMotivos = require('../controles/controlMotivo');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");
const logger = require('../utilidades/logger');


/**
 * @abstract Servicio  que permite agregar un motivo
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} motivo agregado a la base de datos
 * */
const agregarMotivo = asyncError(async (req, res, next) => {
  logger.info("Petición para agregar un motivo", req.body)
 
  logger.info("Se llama al control de motivos, y asi el de agregar motivo")
  const result = await controlMotivos.agregarMotivo(req.body);

  logger.info("Se valida el resultado de la consulta de motivos")
  if (result === false) {
    logger.error("Error al agregar un motivo")
    const error = new CustomeError('Error al agregar un motivo', 400);
    return next(error);
  } else {
    logger.info("Motivo agregado correctamente")
    res.status(201).json({
        motivo: result
    });
  }
});


/**
 *  
 *  @abstract Servicio  que permite obtener todos los motivos
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} motivos de la base de datos
 */

const obtenerMotivos = asyncError(async (req, res, next) => {
  
  logger.info("Petición para obtener los motivos, en base a si estan activos o no")

  logger.info("Se valida si se envió el parámetro activo en la petición, esto con el fin de obtener los motivos activos o inactivos")
  const activo = req.query.activo;
  if (activo !== undefined && activo !== null && activo !== "") {

    logger.info("Se llama al control de motivos, y asi el de obtener motivos, en base a si estan activos")
    const result = await controlMotivos.obtenerMotivos(activo);
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron motivos")
      const error = new CustomeError('No se encontraron motivos', 404);
      return next(error);
    } else {
       logger.info("Se retornan los motivos") 
      res.status(200).json({
          motivos: result
      });
    }

  }else { 
    logger.info("Se llama al control de motivos, y asi el de obtener motivos")
    const result = await controlMotivos.obtenerMotivos();

    logger.info("Se valida el resultado de la consulta de motivos")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron motivos")
      const error = new CustomeError('No se encontraron motivos', 404);
      return next(error);
    } else { 
      logger.info("Se retornan los motivos")    
      res.status(200).json({
          motivos: result
      });
    }
  }



});


/**
 * @abstract Servicio  que permite actualizar un motivo
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} motivo actualizado en la base de datos
 */
const actualizarMotivo = asyncError(async (req, res, next) => {
  logger.info("Petición para actualizar un motivo", req.body)

  logger.info("Se llama al control de motivos, y asi el de actualizar motivo")
  const result = await controlMotivos.actualizarMotivo(req.body);

  logger.info("Se valida el resultado de actualizar al motivo")
  if (result === false) {
    logger.error("Error al actualizar un motivo")
    const error = new CustomeError('Error al actualizar el motivo', 400);
    return next(error);
  } else {
    logger.info("Motivo actualizado correctamente")
    res.status(200).json({
        motivo: req.body
    });
  }
});

/**
 *  @abstract Servicio  que permite obtener un motivo por id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} motivo de la base de datos
 */
const obtenerMotivoPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener un motivo por id", req.params.id)

  logger.info("Se llama al control de motivos, y asi el de obtener motivo por id")
  const result = await controlMotivos.obtenerMotivoPorId(req.params.id);
 
  logger.info("Se valida el resultado de la consulta de motivos")
  if (result === null || result === undefined) {
    logger.info("No se encontraron motivos")
    const error = new CustomeError('Error al obtener el motivo', 404);
    return next(error);

  } else {
    logger.info("Se retornan los motivos")
    res.status(200).json({
        motivo: result
    });
  }
});



const obtenerMotivosPaginacion = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los motivos, en base a la paginación")

  logger.info("Se obtiene la página y el total de motivos")
  const pagina = req.query.pagina;
  const total = req.query.total;

  logger.info("Se valida si se quiere obtener el total de motivos o los motivos paginados")
  if (total === "true") {
    logger.info("Se llama al control de motivos, y asi el de obtener el total de motivos")
    const result = await controlMotivos.obtenerTotalMotivos();

    logger.info("Se valida el resultado de la consulta de motivos")
    if (result === null || result === undefined) {
      logger.error("Error al obtener el total de motivos")
      const error = new CustomeError('Error al obtener el total de motivos', 404);
      return next(error);
    } else {
      logger.info("Se retornan los motivos")
      res.status(200).json({
        totalMotivos: result
      });
    }

  } else {
    logger.info("Se llama al control de motivos, y asi el de obtener motivos paginados")
    const result = await controlMotivos.obtenerMotivosPaginacion(pagina);

    logger.info("Se valida el resultado de la consulta de motivos")
    if (result === null || result === undefined || result.length === 0) {
      logger.error("Error al obtener los motivos")
      const error = new CustomeError('Error al obtener los motivos', 404);
      return next(error);

    } else {
      logger.info("Se retornan los motivos")
      res.status(200).json({
        motivos: result
      });
    }
  }
} );


//Module exports
module.exports = {
  agregarMotivo,
  obtenerMotivos,
  actualizarMotivo,
  obtenerMotivoPorId,
  obtenerMotivosPaginacion
};