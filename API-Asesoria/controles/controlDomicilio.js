const modeloDomicilio = require('../modelos/modeloDomicilio'); // Asegúrate de tener el modelo de domicilios importado.
const logger = require('../utilidades/logger');

/**
 * @abstract Función que permite obtener todos los domicilios
 * @returns domicilios
 */
const obtenerDomicilios = async () => {
  try {
    logger.info("Se obtienen los domicilios")
    return await modeloDomicilio.Domicilio.findAll({
      raw: true,
      nest: true
    });
  } catch (error) {
 //   console.log("Error domicilios :", error.message);
    logger.error("Error domicilios :", error.message); 
 return null;
  }
};

/**
 * @abstract Función que permite obtener un domicilio por su id
 * @param {*} id id del domicilio
 * @returns domicilio
 *  */
const obtenerDomicilioPorId = async (id) => {
  try {
    logger.info("Se obtiene el domicilio por su id", id)
    return await modeloDomicilio.Domicilio.findByPk(id, {
      raw: true,
      nest: true
    });
  } catch (error) {
    //console.log("Error domicilios :", error.message);
    logger.error("Error domicilios :", error.message);
    return null;
  }
};

/**
 * @abstract Función que permite agregar un domicilio
 *  @param {*} domicilio domicilio a agregar
 * @returns domicilio si se agrega correctamente, false si no  agregar
 * */
const agregarDomicilio = async (domicilio) => {
  try {
    logger.info("Se agrega el domicilio", domicilio)
    return (await modeloDomicilio.Domicilio.create(domicilio, { raw: true, nest: true })).dataValues;
  } catch (error) {
   // console.log("Error domicilios :", error.message);
    logger.error("Error domicilios :", error.message); 
   return false;
  }
};



/**
 * @abstract Función que permite actualizar un domicilio
 * @param {*} domicilio domicilio a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarDomicilio = async (domicilio) => {
  try {
    logger.info("Se actualiza el domicilio", domicilio)
   const result= await modeloDomicilio.Domicilio.update(domicilio, { where: { id_domicilio: domicilio.id_domicilio } });
    logger.info("Se retorna el domicilio actualizado", result[0] === 1)	
   return result[0] === 1; 
  } catch (error) {
    //console.log("Error domicilios :", error.message);
    logger.error("Error domicilios :", error.message);
    return false;
  }
};

const obtenerDomicilioPorIdMiddleware = async (id) => {
  try {
    logger.info("Se obtiene el domicilio por su id", id)
    return await modeloDomicilio.Domicilio.findByPk(id);
  } catch (error) {
    logger.error("Error domicilios :", error.message);
  //  console.log("Error domicilios :", error.message);
    return null;
  }
}

/**
 *  @module controlDomicilio
 */
module.exports = {
  obtenerDomicilios,
  obtenerDomicilioPorId,
  agregarDomicilio,
  actualizarDomicilio,
  obtenerDomicilioPorIdMiddleware
};
