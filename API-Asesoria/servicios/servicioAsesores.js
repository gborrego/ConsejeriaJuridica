const controlAsesores = require('../controles/controlAsesor');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');


/**
 * @abstract Servicio  que permite obtener todos los asesores
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesores   de la base de datos
 */
const obtenerAsesores = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los asesores")
   logger.info("Se obtienen los parametros de la petición, id_distrito_judicial y pagina")
  const id_distrito_judicial = req.query.id_distrito_judicial;
    const pagina = req.query.pagina;
    logger.info("Se llama al control de asesores, y asi el de obtener asesores")
    const result = await controlAsesores.obtenerAsesores(id_distrito_judicial,pagina);
    logger.info("Se valida el resultado de la consulta de asesores")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron asesores")
      const error = new CustomeError('No se encontraron asesores', 404);
      return next(error);
    } else {
      logger.info("Se retornan los asesores")
      res.status(200).json({

        asesores: result
      });
    }


});
const obtenerAsesoresByDistrito = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los asesores por distrito")
  logger.info("Se obtienen los parametros de la petición, id_distrito_judicial")
  const id_distrito_judicial = req.params.id 

  logger.info("Se llama al control de asesores, y asi el de obtener asesores")
  const result = await controlAsesores.obtenerAsesoresByDistrito(id_distrito_judicial);
  logger.info("Se valida el resultado de la consulta de asesores")
  if (result === null || result === undefined || result.length === 0) {
    logger.info("No se encontraron asesores")
    const error = new CustomeError('No se encontraron asesores', 404);
    return next(error);
  } else {
    logger.info("Se retornan los asesores")
    res.status(200).json({

      asesores: result
    });
  }


});




/**
 *  @abstract Servicio  que permite obtener un asesor por id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesor  de la base de datos
 */
const obtenerAsesorPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener el asesor por id", req.params.id)
  const result = await controlAsesores.obtenerAsesorPorId(req.params.id);
  logger.info("Se valida el resultado de la consulta del asesor")
  if (result === null || result === undefined) {
    logger.info("No se encontraron asesores")
    const error = new CustomeError('Error al obtener el asesor', 404);
    return next(error);
  } else {
    logger.info("Se retornan los asesores")
    res.status(200).json({
      asesor: result
    });
  }
});

const obtenerAsesoresZona = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los asesores por zona", req.params.id)
  const result = await controlAsesores.obtenerAsesoresZona(req.params.id);
  logger.info("Se valida el resultado de la consulta de asesores")
  if (result === null || result === undefined || result.length === 0) 
    { 
    logger.info("No se encontraron asesores")
    const error = new CustomeError('Error al obtener el asesor', 404);
    return next(error);
  } else {
    logger.info("Se retornan los asesores")
    res.status(200).json({
      asesores: result
    });
  }
}
);
//Module exports  
module.exports = {
  obtenerAsesores,
  obtenerAsesorPorId,
  obtenerAsesoresZona,
  obtenerAsesoresByDistrito
};
