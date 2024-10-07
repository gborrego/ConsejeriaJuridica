const modeloEstadoCivil = require('../modelos/modeloEstadoCivil');
const logger = require('../utilidades/logger');

/**
 * @abstract Función que permite obtener todos los estados civiles
 * @returns estados civiles
 */
const obtenerEstadosCiviles = async (activo) => {
  try {
    logger.info("Se obtienen los estados civiles, con respecto a su estatus", activo)

    logger.info("Se valida si el estado civil es activo", activo)
    if (activo !== undefined && activo !== null && activo !== "") {
      logger.info("Se obtienen los estados civiles activos")
      return await modeloEstadoCivil.EstadoCivil.findAll({
        raw: true,
        nest: true,
        where: { estatus_general: "ACTIVO" }
      });
    }else{
      logger.info("Se obtienen todos los estados civiles")
    return await modeloEstadoCivil.EstadoCivil.findAll({
      raw: true,
      nest: true,
    });
  }
  } catch (error) {
  //    console.log("Error estados civiles:", error.message);
    logger.error("Error estados civiles:", error.message); 
   return null;
  }
};


/**
 * @abstract Función que permite obtener un estado civil por su id
 * @param {*} id id del estado civil
 * @returns estado civil
 * */
const obtenerEstadoCivilPorId = async (id) => {
  try {
    logger.info("Se obtiene el estado civil por su id", id)
    return await modeloEstadoCivil.EstadoCivil.findByPk(id, {
      raw: false,
      nest: true,
    });
  } catch (error) {
    logger.error("Error estados civiles:", error.message);
    //console.log("Error estados civiles:", error.message);
    return null;
  }
};

const obtenerEstadoCivilPorPorIdMiddleware = async (id) => {
  try {
    logger.info("Se obtiene el estado civil por su id y su estatus activo", id)
    return  await modeloEstadoCivil.EstadoCivil.findOne({
      raw: true,
      nest: true,
      where: { id_estado_civil: id, estatus_general: "ACTIVO" }
    });
    
  } catch (error) {
    //  console.log("Error estados civiles:", error.message);
    logger.error("Error estados civiles:", error.message);
    return null;
  }
};

/**
 *    @abstract Función que permite agregar un estado civil
 * @param {*} estadoCivil estado civil a agregar
 * @returns estado civil si se agrega correctamente, false si no  agregar
 * */
const agregarEstadoCivil = async (estadoCivil) => {
  try {
    logger.info("Se agrega el estado civil", estadoCivil)
    return ( await modeloEstadoCivil.EstadoCivil.create(estadoCivil, { raw: true, nest: true })).dataValues;
  } catch (error) {
   // console.log("Error estados civiles:", error.message);
    logger.error("Error estados civiles:", error.message); 
   return false;
  }
};



/**
 * @abstract Función que permite actualizar un estado civil
 * @param {*} estadoCivil estado civil a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarEstadoCivil = async (estadoCivil) => {
  try {
    logger.info("Se actualiza el estado civil", estadoCivil)
    const result = await modeloEstadoCivil.EstadoCivil.update(estadoCivil, { where: { id_estado_civil: estadoCivil.id_estado_civil } });
    logger.info("Se retorna el estado civil actualizado", result[0] === 1)
     return result[0] === 1; 
  } catch (error) {
  //  console.log("Error estados civiles:", error.message);
   logger.error("Error estados civiles:", error.message); 
  return false;
  }
};



const obtenerEstadosCivilesPaginacion = async (pagina) => {
  try {
    logger.info("Se obtienen los estados civiles por paginación", pagina)

    logger.info("Se establece el offset para la paginación", pagina)
    pagina = parseInt(pagina, 10);
    const offset = (pagina - 1) * 10;

    logger.info("Se obtienen los estados civiles por paginación")
    const resultados = await modeloEstadoCivil.EstadoCivil.findAll({
      raw: false,
      nest: true,
      offset: offset,
      limit: 10
    });
    logger.info("Se retornan los estados civiles por paginación", resultados)
    return resultados;
  } catch (error) {
    logger.error("Error estados civiles:", error.message);
    return null;
  }

}

const obtenerTotalEstadosCiviles = async () => {
  try {
    logger.info("Se obtiene el total de estados civiles")
    return await modeloEstadoCivil.EstadoCivil.count();
  } catch (error) {
    logger.error("Error estados civiles:", error.message);
   // console.log("Error estados civiles:", error.message);
    return null;
  }

}


  // Module exports:
module.exports = {
  obtenerEstadosCiviles,
  obtenerEstadoCivilPorId,
  agregarEstadoCivil,
  actualizarEstadoCivil, 
  obtenerEstadoCivilPorPorIdMiddleware, 
  obtenerEstadosCivilesPaginacion,
  obtenerTotalEstadosCiviles


};