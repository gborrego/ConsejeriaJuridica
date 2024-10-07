
const modeloMotivo = require('../modelos/modeloMotivo');
const logger = require('../utilidades/logger');

/**
 * @abstract Funcion que permite obtener todos los motivos
 * @returns motivos
 */
const obtenerMotivos = async (activo) => {
  try {
    logger.info("Se obtienen los motivos, con respecto a su estatus", activo)
    if (activo !== undefined && activo !== null && activo !== "") {
      logger.info("Se valida si el motivo es activo", activo)
      return await modeloMotivo.Motivo.findAll({
        raw: true,
        nest: true,
        where: { estatus_general: "ACTIVO" }
      });

    } else {
      logger.info("Se obtienen todos los motivos")
      return await modeloMotivo.Motivo.findAll({
        raw: true,
        nest: true,
      });
    }
  } catch (error) {
    //console.log("Error motivos:", error.message);
    logger.error("Error motivos:", error.message);
    return null;
  }
};


/**
 * @abstract Funcion que permite obtener un motivo por su id
 * @param {*} id id del motivo
 * @returns motivo
 */
const obtenerMotivoPorId = async (id) => {
  try {
    logger.info("Se obtiene el motivo por su id", id)
    return await modeloMotivo.Motivo.findByPk(id, {
      raw: false,
      nest: true,
    });
  } catch (error) {
    logger.error("Error motivos:", error.message);
  //  console.log("Error motivos:", error.message);
    return null;
  }
};

const obtenerMotivoPorPorIdMiddleware = async (id) => {
  try {
    logger.info("Se obtiene el motivo por su id y su estatus activo", id)
    return  await modeloMotivo.Motivo.findOne({
      raw: true,
      nest: true,
      where: { id_motivo: id, estatus_general: "ACTIVO" }
    });
    
  } catch (error) {
   // console.log("Error motivos:", error.message);
    logger.error("Error motivos:", error.message); 
   return null;
  }
}

/**
 * @abstract Funcion que permite agregar un motivo
 * @param {*} motivo motivo a agregar
 * @returns motivo si se agrega correctamente, false si no  agregar
 */
const agregarMotivo = async (motivo) => {
  try {
    logger.info("Se agrega el motivo", motivo)
    return (await modeloMotivo.Motivo.create(motivo, { raw: true, nest: true })).dataValues;
  } catch (error) {
 //   console.log("Error motivos:", error.message);
  logger.error("Error motivos:", error.message); 
  return false;
  }
};



/**
 * @abstract Funcion que permite actualizar un motivo
 *  @param {*} motivo motivo a actualizar
 *  @returns true si se actualiza correctamente, false si no se actualiza
 */

const actualizarMotivo = async (motivo) => {
  try {
    logger.info("Se actualiza el motivo", motivo)
    const result = await modeloMotivo.Motivo.update(motivo, { where: { id_motivo: motivo.id_motivo } });
    logger.info("Se retorna el motivo actualizado", result[0] === 1)
    return result[0] === 1;
  } catch (error) {
   // console.log("Error motivos:", error.message);
    logger.error("Error motivos:", error.message); 
   return false;
  }
};
 


const obtenerMotivosPaginacion = async (pagina) => {
  try {
    logger.info("Se obtienen los motivos por paginacion", pagina)
    logger.info("Se establece el offset y el limite", pagina)
    pagina = parseInt(pagina, 10);
    const offset = (pagina - 1) * 10;
    logger.info("Se obtienen los motivos por paginacion")
    const resultados = await modeloMotivo.Motivo.findAll({
      raw: false,
      nest: true,
      offset: offset,
      limit: 10
    });
    logger.info("Se retornan los motivos por paginacion", resultados)
    return resultados;
  } catch (error) {
    logger.error("Error motivos:", error.message);
    return null;
  }
}


const obtenerTotalMotivos = async () => {
  try {
    logger.info("Se obtiene el total de motivos")
    return await modeloMotivo.Motivo.count();
  } catch (error) {
    logger.error("Error motivos:", error.message);
    //console.log("Error motivos:", error.message);
    return null;
  }
}



//Module exports:
module.exports = {
  obtenerMotivos,
  obtenerMotivoPorId,
  agregarMotivo,
  actualizarMotivo,
  obtenerMotivoPorPorIdMiddleware ,
  obtenerMotivosPaginacion,
  obtenerTotalMotivos
};