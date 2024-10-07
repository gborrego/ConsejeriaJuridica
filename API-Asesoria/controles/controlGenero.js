
const modeloGenero = require('../modelos/modeloGenero');
const logger = require('../utilidades/logger');


/**
 *  @abstract Función que permite obtener todos los generos
 * @returns generos
 */
const obtenerGeneros = async (activo) => {
  try {
    logger.info("Se obtienen los generos, con respecto a su estatus", activo)
    if (activo !== undefined && activo !== null && activo !== "") {
      logger.info("Se obtienen los generos activos")
      return await modeloGenero.Genero.findAll({
        raw: true,
        nest: true,
        where: { estatus_general: "ACTIVO" }
      });
    }else {
      logger.info("Se obtienen todos los generos")
    return await modeloGenero.Genero.findAll({
      raw: true,
      nest: true,
    });

    }
  } catch (error) {
   // console.log("Error generos:", error.message);
      logger.error("Error generos:", error.message);
    return null;
  }
};


/**
 *  
 * @abstract Función que permite obtener un genero por su id
 * @param {*} id id del genero
 * @returns genero
 * */
const obtenerGeneroPorId = async (id) => {
  try {
    logger.info("Se obtiene el genero por su id", id)
    return await modeloGenero.Genero.findByPk(id, {
      raw: true,
      nest: true,
    });
  } catch (error) {
  //  console.log("Error generos:", error.message);
   logger.error("Error generos:", error.message);  
  return null;
  }
};

const obtenerGeneroPorPorIdMiddleware =async (id) => {
  try {
    logger.info("Se obtiene el genero por su id y su estatus activo", id)
    return  await modeloGenero.Genero.findOne({
      raw: true,
      nest: true,
      where: { id_genero: id, estatus_general: "ACTIVO" }
    });
  } catch (error) {
    //console.log("Error generos:", error.message);
    logger.error("Error generos:", error.message);
    return null;
  }
};


/**
 *  @abstract Función que permite agregar un genero
 * @param {*} genero genero a agregar 
 * @returns genero si se agrega correctamente, false si no  agregar
 * */
const agregarGenero = async (genero) => {
  try {
    logger.info("Se agrega el genero", genero)
    return (await modeloGenero.Genero.create(genero, { raw: true, nest: true })).dataValues; 
  } catch (error) {
    //console.log("Error generos:", error.message);
    logger.error("Error generos:", error.message);
    return false;
  }
};


/**
 * @abstract Función que permite actualizar un genero
 * @param {*} genero genero a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarGenero = async (genero) => {
  try {
    logger.info("Se actualiza el genero", genero)
    const result = await modeloGenero.Genero.update(genero, { where: { id_genero: genero.id_genero } });
   logger.info("Se retorna el resultado de actualizar el genero", result[0] === 1)
    return result[0] === 1;
  } catch (error) {
   // console.log("Error generos:", error.message);
    logger.error("Error generos:", error.message);
    return false;
  }
};


const obtenerGenerosPaginacion = async (pagina) => { 
  try {
    logger.info("Se obtienen los generos por paginación", pagina)

    logger.info("Se establece el offset y el limite, y parseo de la pagina", pagina)
    pagina = parseInt(pagina, 10);
    const offset = (pagina - 1) * 10;

    logger.info("Se obtienen los generos por paginación")
    const resultados = await modeloGenero.Genero.findAll({
      raw: false,
      nest: true,
      offset: offset,
      limit: 10
    });

    logger.info("Se retorna los generos por paginación", resultados)
    return resultados;
  } catch (error) {
    //console.log("Error generos:", error.message);
    return null;
  }
}


const obtenerTotalGeneros = async () => {
  try {
    logger.info("Se obtiene el total de generos")
    return await modeloGenero.Genero.count();
  } catch (error) {
    logger.error("Error generos:", error.message);
   // console.log("Error generos:", error.message);
    return null;
  }
}

 
module.exports = {
  obtenerGeneros,
  obtenerGeneroPorId,
  agregarGenero,
  actualizarGenero,
  obtenerGeneroPorPorIdMiddleware
  , obtenerGenerosPaginacion,
  obtenerTotalGeneros
};