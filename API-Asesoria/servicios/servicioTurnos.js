const controlTurnos = require('../controles/controlTurno');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");



const logger = require('../utilidades/logger');

/**
 *   
 * @abstract Servicio  que permite obtener todos los turnos
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} turnos de la base de datos
 */

const obtenerTurnos = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener los turnos")

  logger.info("Se obtienen los parametros de la petición", req.query)
   
  let { id_defensor, id_distrito_judicial, total, pagina } = req.query;
  const totalBool = total === 'true';


  try {
    logger.info("Se preparan los parametros para obtener los turnos, parseando los valores")
    id_defensor = parseInt(id_defensor, 10) || null;
    id_distrito_judicial = parseInt(id_distrito_judicial, 10) || null;
   logger.info("Se llama al control de turnos, y asi el de obtener turnos con respecto a los parametros")
    const result = await controlTurnos.obtenerTurnos(id_defensor || null, id_distrito_judicial || null, totalBool, pagina);
 

    logger.info("Se valida el resultado de la consulta de turnos")
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return next(new CustomeError('No se encontraron turnos', 404));
    }

     logger.info("Se responde con los turnos obtenidos o el total de turnos")
    const responseKey = totalBool ? 'totalTurnos' : 'turnos';
    res.status(200).json({ [responseKey]: result });
  } catch (error) {
    logger.error("Error al obtener los turnos", error)
    return next(error);
  }
});


/**
 * @abstract Servicio  que permite actualizar un turno
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 *  
 * @returns {Object} turno actualizado en la base de datos
 */
const actualizarTurno = asyncError(async (req, res, next) => {
  logger.info("Petición para actualizar un turno")

  logger.info("Se obtienen los parametros de la petición", req.body)

  logger.info("Se llama al control de turnos, y asi el de actualizar turno con respecto a los parametros")
  const result = await controlTurnos.actualizarTurno(req.body);

  logger.info("Se valida el resultado de la actualización del turno")
  if (result === false) {

    logger.error("Error al actualizar el turno")
    const error = new CustomeError('Error al actualizar el turno', 400);
    return next(error);
  } else {
    logger.info("Se responde con el turno actualizado", result)
    res.status(200).json({
      turno: req.body
    });
  }
});

/**
 * @abstract Servicio  que permite obtener un turno por id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} turno de la base de datos
 */

const obtenerTurnoPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener un turno por id")

  logger.info("Se obtienen los parametros de la petición", req.params.id)

  logger.info("Se llama al control de turnos, y asi el de obtener turno por id con respecto a los parametros")
  const result = await controlTurnos.obtenerTurnoPorId(req.params.id);

  logger.info("Se valida el resultado de la consulta del turno")
  if (result === null || result === undefined) {
    logger.error("Error al obtener el turno") 
    const error = new CustomeError('Error al obtener el turno', 404);
    return next(error);
  } else {
    logger.info("Se responde con el turno obtenido", result)
    res.status(200).json({
      turno: result
    });
  }
});

const obtenerTurnoPorDefensorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener un turno por id de defensor")

  logger.info("Se obtienen los parametros de la petición", req.params.id)

  logger.info("Se llama al control de turnos, y asi el de obtener turno por id de defensor con respecto a los parametros")
  
  const result = await controlTurnos.obtenerTurnoPorDefensorId(req.params.id);
   
  logger.info("Se valida el resultado de la consulta del turno")
  if (result === null || result === undefined) {

    logger.error("Error al obtener el turno")
    const error = new CustomeError('Error al obtener el turno', 404);
    return next(error);
  } else {
    logger.info("Se responde con el turno obtenido", result)
    res.status(200).json({
      turnos: result
    });
  }
});

//Module exports
module.exports = {
  obtenerTurnos,
  actualizarTurno,
  obtenerTurnoPorId,
  obtenerTurnoPorDefensorId
};
