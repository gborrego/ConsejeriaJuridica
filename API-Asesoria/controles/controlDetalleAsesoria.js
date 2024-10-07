const modeloDetalleAsesoriaCatalogo = require('../modelos/modeloDetalleAsesoria');
const logger = require('../utilidades/logger');


/**
 * @abstract Función que permite obtener un detalle de asesoria por su id
 * @param {*} id id del detalle de asesoria
 * @returns detalle de asesoria
 * */
const obtenerDetalleAsesoriaCatalogoPorId = async (id) => {
  try {
    logger.info("Se obtiene el detalle de asesoria por su id", id)
    return await modeloDetalleAsesoriaCatalogo.DetalleAsesoriaCatalogo.findByPk(id, {
      raw: true,
      nest: true
    });
  } catch (error) {
   // console.log("Error detalle asesoria:", error.message);
    logger.error("Error detalle asesoria:", error.message); 
   return null;
  }
};

/**
 * @abstract Función que permite agregar un detalle de asesoria
 * @param {*} detalle detalle de asesoria a agregar
 * @returns detalle de asesoria si se agrega correctamente, false si no  agregar
 *  */
const agregarDetalleAsesoriaCatalogo = async (detalle) => {
  try {
    logger.info("Se agrega el detalle de asesoria", detalle)
    return (await modeloDetalleAsesoriaCatalogo.DetalleAsesoriaCatalogo.create(detalle, { raw: true, nest: true })).dataValues;
  } catch (error) {
   // console.log("Error detalle asesoria:", error.message);
    logger.error("Error detalle asesoria:", error.message); 
   return false;
  }
};


// Module exports:
module.exports = {
  obtenerDetalleAsesoriaCatalogoPorId,
  agregarDetalleAsesoriaCatalogo,
};
