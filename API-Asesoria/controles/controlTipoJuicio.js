
const modeloTipoJuicio = require('../modelos/modeloTipoJuicio');
const logger = require('../utilidades/logger');




/**
 * 
 * @abstract Función que permite obtener todos los tipos de juicio
 * @returns tipos de juicio
 */
const obtenerTiposDeJuicio = async (activo,pagina) => {
  try {
    logger.info("Se obtienen los tipos de juicio, con respecto a su estatus", activo)
    if(activo !== undefined && activo !== null && activo !== ""){
      logger.info("Se valida si el tipo de juicio es activo", activo)
      return await modeloTipoJuicio.TipoJuicio.findAll({
        raw: false,
        nest: true,
        where: { estatus_general: "ACTIVO" }
      });
    }else {
      logger.info("Se obtienen todos los tipos de juicio")
       return await modeloTipoJuicio.TipoJuicio.findAll({
        raw: false,
        nest: true
      });
    }
   
  } catch (error) {
    logger.error("Error tipo juicios:", error.message);
    //console.log("Error tipo juicios:", error.message);
    return null;
  }
};

  
/**
 * @abstract Función que permite obtener un tipo de juicio por su id
 * @param {*} id id del tipo de juicio
 * @returns tipo de juicio  
 *  */  
const obtenerTipoDeJuicioPorId = async (id) => {
  try {
    logger.info("Se obtiene el tipo de juicio por su id", id)
    return await modeloTipoJuicio.TipoJuicio.findByPk(id, {
      raw: true,
      nest: true,
    });
  } catch (error) {
  //  console.log("Error tipo juicios:", error.message);
     logger.error("Error tipo juicios:", error.message);  
  return null;
  }
};

const obtenerTipoJuicioPorPorIdMiddleware = async (id) => {
  try {
    logger.info("Se obtiene el tipo de juicio por su id y su estatus activo", id)
    return await modeloTipoJuicio.TipoJuicio.findOne({
      raw: true,
      nest: true,
      where: { id_tipo_juicio: id, estatus_general: "ACTIVO" }
    });
  } catch (error) {
  //  console.log("Error tipo juicios:", error.message);
    logger.error("Error tipo juicios:", error.message);
   return null;
  }
}


/**
 * @abstract Función que permite agregar un tipo de juicio
 * @param {*} tipoDeJuicio tipo de juicio a agregar
 * @returns tipo de juicio si se agrega correctamente, false si no  agregar
 * */
const agregarTipoDeJuicio = async (tipoDeJuicio) => {
  try {
    logger.info("Se agrega el tipo de juicio", tipoDeJuicio)
    return (await modeloTipoJuicio.TipoJuicio.create(tipoDeJuicio, { raw: true, nest: true })).dataValues;
  } catch (error) {
   // console.log("Error tipo juicios:", error.message);
    logger.error("Error tipo juicios:", error.message); 
   return false;
  }
};



/**
 *  @abstract Función que permite actualizar un tipo de juicio
 * @param {*} tipoDeJuicio tipo de juicio a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarTipoDeJuicio = async (tipoDeJuicio) => {
  try {
    logger.info("Se actualiza el tipo de juicio", tipoDeJuicio)
    const result = await modeloTipoJuicio.TipoJuicio.update(tipoDeJuicio, { where: { id_tipo_juicio: tipoDeJuicio.id_tipo_juicio } });
    logger.info("Se retorna el tipo de juicio actualizado", result[0] === 1)
    return result[0] === 1;
  } catch (error) {
   // console.log("Error tipo juicios:", error.message);
    logger.error("Error tipo juicios:", error.message);
    return false;
  }
};
const obtenerTiposDeJuicioPaginacion = async (pagina) => {
  try {
    logger.info("Se obtienen los tipos de juicio por paginación", pagina)
    logger.info("SE establece el offset y el limite", pagina)
    pagina = parseInt(pagina, 10);
    const offset = (pagina - 1) * 10;

    logger.info("Se obtienen los tipos de juicio por paginación") 
    const resultados = await modeloTipoJuicio.TipoJuicio.findAll({
      raw: false,
      nest: true,
      offset: offset,
      limit: 10
    });

    logger.info("Se retorna los tipos de juicio por paginación", resultados)
    return resultados;
  } catch (error) {
    return null;
  }
};


const obtenerTotalTiposDeJuicio = async () => {
  try {
    logger.info("Se obtiene el total de tipos de juicio")
    return await modeloTipoJuicio.TipoJuicio.count();
  } catch (error) {
    logger.error("Error tipo juicios:", error.message);
   // console.log("Error tipo juicios:", error.message);
    return null;
  }
}
// Module exports
module.exports = {
  obtenerTiposDeJuicio,
  obtenerTipoDeJuicioPorId,
  agregarTipoDeJuicio,
  actualizarTipoDeJuicio,
  obtenerTipoJuicioPorPorIdMiddleware,
  obtenerTotalTiposDeJuicio,obtenerTiposDeJuicioPaginacion

};