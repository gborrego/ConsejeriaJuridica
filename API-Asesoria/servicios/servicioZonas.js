const controlZonas = require('../controles/controlZona');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');


/**
 * @abstract Servicio  que permite obtener todas las zonas
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} zonas  de la base de datos
 */

const obtenerZonas = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener las zonas")
  logger.info("Se llama al control de zonas, y asi el de obtener zonas")
  const result = await controlZonas.obtenerZonas();
  logger.info("Se valida el resultado de la consulta de zonas")
  if (result === null || result === undefined || result.length === 0) {
    logger.info("No se encontraron zonas")
    const error = new CustomeError('No se encontraron zonas', 404);
    return next(error);
  } else {
    logger.info("Se retornan las zonas")
    res.status(200).json({
        zonas: result
    });
  }
});


//Module exports
module.exports = {
  obtenerZonas
};