const controlGeneros = require('../controles/controlGenero');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');

/**
 * @abstract Servicio  que permite agregar un género
 * @param {Object} req Request
 * @param {Object} res Response
 *  @param {Object} next Next
 * @returns {Object} género agregado a la base de datos
 * */
const agregarGenero = asyncError(async (req, res, next) => {

  logger.info("Petición para agregar un género", req.body)

  logger.info("Se llama al control de géneros, y asi el de agregar género")
  const result = await controlGeneros.agregarGenero(req.body);

  logger.info("Se valida el resultado de agregar al género")
  if (result === false) {
    logger.error("Error al agregar un género")
    const error = new CustomeError('Error al agregar un género', 400);
    return next(error);
  } else {
    logger.info("Género agregado correctamente")
    res.status(201).json({
      genero: result
  });
  }
});

/**
 * @abstract Servicio  que permite obtener todos los géneros
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} géneros de la base de datos
 */
const obtenerGeneros = asyncError(async (req, res, next) => {

  logger.info("Petición para obtener los géneros")


  logger.info("Se valida si se envió el parámetro activo en la petición")
  const activo = req.query.activo;

  logger.info("Se valida si se envio el parametro activo, esto con elfin de obtener los géneros activos o inactivos")
  if (activo !== undefined && activo !== null && activo !== "") {
     
    logger.info("Se llama al control de géneros, y asi el de obtener géneros, en base a si estan activos")
    const result = await controlGeneros.obtenerGeneros(activo); 

    logger.info("Se valida el resultado de la consulta de géneros")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron géneros")
      const error = new CustomeError('No se encontraron géneros', 404);
      return next(error);
    } else {
      logger.info("Se retornan los géneros")
      res.status(200).json({
          generos: result
      });
    }
  }else {
    logger.info("Se llama al control de géneros, y asi el de obtener géneros")
    const result = await controlGeneros.obtenerGeneros();

    logger.info("Se valida el resultado de la consulta de géneros")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron géneros")
      const error = new CustomeError('No se encontraron géneros', 404);
      return next(error);
    } else {
      logger.info("Se retornan los géneros")  
      res.status(200).json({
          generos: result
      });
    }

    
  }



});


/**
 * @abstract Servicio  que permite actualizar un género
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} género actualizado en la base de datos
 */
const actualizarGenero = asyncError(async (req, res, next) => {
  logger.info("Petición para actualizar un género", req.body)

  logger.info("Se llama al control de géneros, y asi el de actualizar género")
  const result = await controlGeneros.actualizarGenero(req.body);

  logger.info("Se valida el resultado de actualizar al género")
  if (result === false) {
    logger.error("Error al actualizar un género")
    const error = new CustomeError('Error al actualizar el género', 400);
    return next(error);

  } else {
    logger.info("Género actualizado correctamente")
    res.status(200).json({
        genero: req.body
    });
  }
});

/**
 * @abstract Servicio  que permite obtener un género por id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} género de la base de datos
 */

const obtenerGeneroPorId = asyncError(async (req, res, next) => {

  logger.info("Petición para obtener el género por id", req.params.id)

 
  logger.info("Se llama al control de géneros, y asi el de obtener género por id")
  const result = await controlGeneros.obtenerGeneroPorId(req.params.id);

  logger.info("Se valida el resultado de la consulta del género")
  if (result === null || result === undefined) {

    logger.error("Error al obtener un género")
    const error = new CustomeError('Error al obtener el género', 404);
    return next(error);
  } else {
    logger.info("Se retornan los géneros")

    res.status(200).json({
        genero: result
    });
  }
});
  

  
const obtenerGenerosPaginacion = asyncError(async (req, res, next) => {

  logger.info("Petición para obtener los géneros paginados")  

  logger.info("Se obtiene el número de página y si se quiere obtener el total de géneros")

  const pagina = req.query.pagina;
  const total = req.query.total;


  logger.info("Se valida si se envio el parametro total, para obtener el total de géneros o los géneros paginados")

  if (total === "true") {
    logger.info("Se llama al control de géneros, y asi el de obtener el total de géneros")
    const result = await controlGeneros.obtenerTotalGeneros();
    logger.info("Se valida el resultado de la consulta de géneros")
    if (result === null || result === undefined) {
      logger.error("Error al obtener el total de géneros ")
      const error = new CustomeError('Error al obtener el total de géneros', 404);
      return next(error);
    } else {
      logger.info("Se retorna el total de géneros")
      res.status(200).json({
        totalGeneros: result
      });
    }

  } else {
    logger.info("Se llama al control de géneros, y asi el de obtener géneros paginados")
    const result = await controlGeneros.obtenerGenerosPaginacion(pagina);
    logger.info("Se valida el resultado de la consulta de géneros")
    if (result === null || result === undefined || result.length === 0) {
      logger.error("Error al obtener los géneros")
      const error = new CustomeError('Error al obtener los géneros', 404);
      return next(error);
    } else {
      logger.info("Se retornan los géneros")
      res.status(200).json({
        generos: result
      });
    }
  }
}
);

 

//Module exports 
module.exports = {
  agregarGenero,
  obtenerGeneros,
  actualizarGenero,
  obtenerGeneroPorId,
  obtenerGenerosPaginacion
};