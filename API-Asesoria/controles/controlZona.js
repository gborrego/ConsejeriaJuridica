const modeloZona = require('../modelos/modeloZona');
const logger = require('../utilidades/logger');


/**
 *  @abstract Función que permite obtener todas las zonas
 * @returns zonas
 */
const obtenerZonas = async () => {
  try {
    logger.info("Se obtienen las zonas")  
    return await modeloZona.Zona.findAll({
      raw: true,
      nest: true
    });
  } catch (error) {
    logger.error("Error zona:", error.message);
   // console.log("Error zona:", error.message);
    return null;
  }
};

/** 
 * @abstract Función que permite obtener una zona por su id
 * @param {*} id id de la zona
 * @returns zona
 * */
const obtenerZonaPorId = async (id) => {
  try {
    logger.info("Se obtiene la zona por su id", id)
    return await modeloZona.Zona.findByPk(id, {
      raw: true,
      nest: true
    });
  } catch (error) {
   // console.log("Error zona:", error.message);
    logger.error("Error zona:", error.message); 
   return null;
  }
};


//Module exports:
module.exports = {
  obtenerZonas,
  obtenerZonaPorId,
};