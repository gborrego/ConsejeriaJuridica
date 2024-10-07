const modeloCatalogoRequisito = require('../modelos/modeloCatalogoRequisito');
const logger = require('../utilidades/logger');

  
/**
 *  @abstract Función que permite obtener todos los catalogos de requisitos
 * @returns catalogos de requisitos
 */
const obtenerCatalogoRequisitos = async (activo) => {
  try {
     logger.info("Se obtienen los catalogos de requisitos, en caso de que se envie un parametro activo se filtra por activo")
     logger.info("Se vakiida el parametro activo", activo)
    if(activo !== undefined && activo !== null && activo !== ""){
       logger.info("Se retorna los catalogos de requisitos activos")
      return await modeloCatalogoRequisito.CatalogoRequisito.findAll({
        raw: false,
        nest: true,
        where: { estatus_general: "ACTIVO" }
      });
    }else {
      logger.info("Se retorna el total de catalogos de requisitos")
      return await modeloCatalogoRequisito.CatalogoRequisito.findAll({
        raw: false,
        nest: true
      });
    }
  } catch (error) {
    logger.error("Error de catalogo requisito:", error.message);
    //console.log("Error de catalogo requisito:", error.message);
    return null;
  }
};

/**
 * @abstract Función que permite obtener un catalogo de requisito por su id
 * @param {*} id id del catalogo de requisito
 * @returns catalogo de requisito
 *  */
const obtenerCatalogoRequisitoPorId = async (id) => {
  try {
     logger.info("Se obtiene el catalogo de requisito por su id", id)
      const result= await modeloCatalogoRequisito.CatalogoRequisito.findByPk(id,{
        raw: false,
        nest: true
      });
      logger.info("Se retorna el catalogo de requisito", result)
      return result;
  } catch (error) {
  //  console.log("Error de catalogo requisito:", error.message);
    logger.error("Error de catalogo requisito:", error.message); 
  return null;
  }
};

const obtenerDocumentoPorPorIdMiddleware = async (id) => {
  try {
    logger.info("Se obtiene el catalogo de requisito por su id", id)
    const result = await modeloCatalogoRequisito.CatalogoRequisito.findOne({
      raw: false,
      nest: true,
      where: { id_catalogo: id, estatus_general: "ACTIVO" }
    });
    logger.info("Se retorna el catalogo de requisito", result)
    return result;
  } catch (error) {
   //  console.log("Error de catalogo requisito:", error.message);
    logger.error("Error de catalogo requisito:", error.message);
    return null;
  }
}


/**
 * @abstract Función que permite agregar un catalogo de requisito
 * @param {*} catalogoRequisito catalogo de requisito a agregar
 * @returns catalogo de requisito si se agrega correctamente, false si no  agregar
 * */
const agregarCatalogoRequisito = async (catalogoRequisito) => {
  try {
    logger.info("Se agrega el catalogo de requisito", catalogoRequisito)
    return (await modeloCatalogoRequisito.CatalogoRequisito.create(catalogoRequisito, { raw: true, nest: true })).dataValues;
  } catch (error) {
   // console.log("Error de catalogo requisito:", error.message);
    logger.error("Error de catalogo requisito:", error.message); 
   return false;
  }
};



/**
 *  @abstract Función que permite actualizar un catalogo de requisito
 * @param {*} catalogoRequisito catalogo de requisito a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarCatalogoRequisito = async (catalogoRequisito) => {
  try {
    logger.info("Se actualiza el catalogo de requisito", catalogoRequisito)
   const result= await modeloCatalogoRequisito.CatalogoRequisito.update(catalogoRequisito, { where: { id_catalogo: catalogoRequisito.id_catalogo } });
     logger.info("Se retorna la validacion de actualizacion de catalogo de requisito", result[0] === 1) 
    return result[0] === 1;
  } catch (error) {
   // console.log("Error de catalogo requisito:", error.message);
    logger.error("Error de catalogo requisito:", error.message); 
   return false;
  }
};


const obtenerCatalogoRequisitosPaginacion = async (pagina) => {
  try {
    logger.info("Se obtienen los catalogos de requisitos por paginacion")
    logger.info("Se establece la pagina, offset y limit", pagina)

    pagina = parseInt(pagina, 10);
    const offset = (pagina - 1) * 10;
    logger.info("Se obtienen los catalogos de requisitos por paginacion")
    const resultados = await modeloCatalogoRequisito.CatalogoRequisito.findAll({
      raw: false,
      nest: true,
      offset: offset,
      limit: 10
    });
    logger.info("Se retorna los catalogos de requisitos por paginacion", resultados)
    return resultados;
  } catch (error) {
    logger.error("Error de catalogo requisito:", error.message);
    return null;
  }
}

const obtenerTotalCatalogoRequisitos = async () => {
  try {
    logger.info("Se obtiene el total de catalogos de requisitos")
    return await modeloCatalogoRequisito.CatalogoRequisito.count();
  } catch (error) {
    logger.error("Error de catalogo requisito:", error.message);
    //console.log("Error de catalogo requisito:", error.message);
    return null;
  }
}







  // Modulos exportados 
module.exports = {
  obtenerCatalogoRequisitos,
  obtenerCatalogoRequisitoPorId,
  agregarCatalogoRequisito,
  actualizarCatalogoRequisito,
  obtenerDocumentoPorPorIdMiddleware,
  obtenerCatalogoRequisitosPaginacion,
  obtenerTotalCatalogoRequisitos
};
