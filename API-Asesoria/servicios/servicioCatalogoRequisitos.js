const controlCatalogoRequisitos = require('../controles/controlCatalogoRequisito');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");
const logger = require('../utilidades/logger');

/**
 * @abstract Servicio  que permite agregar un requisito del catálogo
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} requisito del catálogo agregado a la base de datos
 * */
const agregarCatalogoRequisito = asyncError(async (req, res, next) => {
  logger.info("Petición para agregar un requisito del catálogo", req.body)
   
  logger.info("Se llama al control de requisitos del catálogo, y asi el de agregar requisito del catálogo")
  const result = await controlCatalogoRequisitos.agregarCatalogoRequisito(req.body);
 logger.info("Se valida el resultado de agregar un requisito del catálogo")
  if ( result === false) {
    logger.error("Error al agregar un requisito del catálogo")
    const error = new CustomeError('Error al agregar un requisito del catálogo', 400);
    return next(error);
  } else {
    logger.info("Requisito del catálogo agregado correctamente")
    res.status(201).json({
        requisitoCatalogo:result
    });
  }
});

/**
 * @abstract Servicio  que permite obtener todos los requisitos del catálogo
 *  @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} requisitos del catálogo de la base de datos
 */

const obtenerCatalogoRequisitos = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los requisitos del catálogo")
  const activo = req.query.activo;
  logger.info("Se valida si se envió el parámetro activo en la petición, esto con el fin de obtener los requisitos del catálogo activos o inactivos")
  if (activo !== undefined && activo !== null && activo !== "") { 
    logger.info("Se llama al control de requisitos del catálogo, y asi el de obtener requisitos del catálogo, en base a si estan activos")
    const result = await controlCatalogoRequisitos.obtenerCatalogoRequisitos(activo);
    logger.info("Se valida el resultado de la consulta de requisitos del catálogo")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron requisitos del catálogo")
      const error = new CustomeError('No se encontraron requisitos del catálogo', 404);
      return next(error);
    } else {
      logger.info("Se retornan los requisitos del catálogo")
      res.status(200).json({
        requisitosCatalogo: result
      });
    }
  }else {
    logger.info("Se llama al control de requisitos del catálogo, y asi el de obtener requisitos del catálogo")
    const result = await controlCatalogoRequisitos.obtenerCatalogoRequisitos(null);
    logger.info("Se valida el resultado de la consulta de requisitos del catálogo")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron requisitos del catálogo")
      const error = new CustomeError('No se encontraron requisitos del catálogo', 404);
      return next(error);
    } else {
      logger.info("Se retornan los requisitos del catálogo")  
      res.status(200).json({
        requisitosCatalogo: result
      });
    }
  }


});


/**
 *  @abstract Servicio  que permite actualizar un requisito del catálogo
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} requisito del catálogo actualizado en la base de datos
 */

const actualizarCatalogoRequisito = asyncError(async (req, res, next) => {
  logger.info("Petición para actualizar un requisito del catálogo", req.body)
    
  logger.info("Se llama al control de requisitos del catálogo, y asi el de actualizar requisito del catálogo")

  const result = await controlCatalogoRequisitos.actualizarCatalogoRequisito(req.body);
  logger.info("Se valida el resultado de actualizar un requisito del catálogo")
  if ( result === false) {
    logger.error("Error al actualizar un requisito del catálogo")
    const error = new CustomeError('Error al actualizar el requisito del catálogo', 400);
    return next(error);
  } else {
    logger.info("Requisito del catálogo actualizado correctamente") 
    res.status(200).json({
        requisitoCatalogo: req.body
    });
  }
});

/**
 *  @abstract Servicio  que permite obtener un requisito del catálogo por id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} requisito del catálogo de la base de datos
 */

const obtenerCatalogoRequisitoPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener un requisito del catálogo por id")

  logger.info("Se llama al control de requisitos del catálogo, y asi el de obtener requisito del catálogo por id")
  const result = await controlCatalogoRequisitos.obtenerCatalogoRequisitoPorId(req.params.id);

  logger.info("Se valida el resultado de la consulta de requisitos del catálogo")
  if (result === null || result === undefined) {
    logger.info("No se encontraron requisitos del catálogo")
    const error = new CustomeError('Error al obtener el requisito del catálogo', 404);
    return next(error);
  } else {
    logger.info("Se retornan los requisitos del catálogo")
    res.status(200).json({
        requisitoCatalogo: result
    });
  }
});


const obtenerCatalogoRequisitosPaginacion = asyncError(async (req, res, next) => {

  logger.info("Petición para obtener los requisitos del catálogo por paginación")


  logger.info("Se obtienen los parametros de la petición", req.query.pagina, req.query.total)
  const pagina = req.query.pagina;
  const total = req.query.total;

  logger.info("Se llama al control de requisitos del catálogo, y asi el de obtener requisitos del catálogo por paginación")
  if (total === "true") {
        logger.info("Se llama al control de requisitos del catálogo, y asi el de obtener el total de requisitos del catálogo")
        const result = await controlCatalogoRequisitos.obtenerTotalCatalogoRequisitos();
    logger.info("Se valida el resultado de la consulta de requisitos del catálogo")
    if (result === null || result === undefined) {
      logger.info("No se encontraron requisitos del catálogo")
      const error = new CustomeError('Error al obtener el total de requisitos del catálogo', 404);
      return next(error);
    } else {
      logger.info("Se retornan los requisitos del catálogo")
      res.status(200).json({
        totalCatalogoRequisitos: result
      });
    }

  } else {
    logger.info("Se llama al control de requisitos del catálogo, y asi el de obtener requisitos del catálogo por paginación")
    const result = await controlCatalogoRequisitos.obtenerCatalogoRequisitosPaginacion(pagina);
    logger.info("Se valida el resultado de la consulta de requisitos del catálogo")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron requisitos del catálogo")
      const error = new CustomeError('Error al obtener los requisitos del catálogo', 404);
      return next(error);
    } else {
      logger.info("Se retornan los requisitos del catálogo")
      res.status(200).json({
        requisitosCatalogo: result
      });
    }
  }
}
);

  //Module exports   
module.exports = {
  agregarCatalogoRequisito,
  obtenerCatalogoRequisitos,
  actualizarCatalogoRequisito,
  obtenerCatalogoRequisitoPorId,
  obtenerCatalogoRequisitosPaginacion
};
