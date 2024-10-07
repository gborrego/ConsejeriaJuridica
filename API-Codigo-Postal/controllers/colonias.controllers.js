// Constante que representa el modelo de Colonias
const modelColonias = require("../models/colonias.models");

// Constante que representa el modelo de Municipios
const getMunicipio = require("../controllers/municipios.controller");
//const { get } = require("../routes/colonias.routes");

const logger = require('../utilities/logger');

/**
 * Funcion que obtiene una colonia
 * @name getColonia
 * @function
 * @param {number} id - Identificador de la colonia
 * @returns {Object} - Objeto con la colonia
 * @throws {Error} - Error en la consulta de colonia
 */
const getColonia = async (id) => {
  try {
    // Obtenemos una colonia
    logger.info(`Obteniendo colonia con respecto al id: ${id}`);
    const colonia_pre = await modelColonias.Colonia.findOne({
      raw: true,
      where: {
        id_colonia: id,
      },
      attributes: {
        exclude: ["id_ciudad", "id_codigo_postal"],
      },
      nest: true,
      include: [modelColonias.Ciudad, modelColonias.CodigoPostal],
    });
    logger.info("Colonia obtenida correctamente", colonia_pre); 

    logger.info("Se verifica si la colonia es nula")
   if (!colonia_pre) {
      logger.error("Error en la consulta de colonias");
      return null;
    }
      
    //console.log(colonia_pre);
    // Obtenemos el id del municipio
    logger.info("Se obtiene el id del municipio")
    const id_municipio=colonia_pre.codigo_postal.id_municipio;
    //console.log(id_municipio);
    // Obtenemos el municipio
    logger.info("Se obtiene el municipio")
    const municipio=await getMunicipio.getMunicipio(id_municipio); 
    //delete colonia_pre.codigo_postal.id_municipio;  
    // Agregamos el municipio a la colonia
    logger.info("Se agrega el municipio a la colonia")
    colonia_pre.municipio=municipio;
    //Agregamos el estado al municipio
    logger.info("Se agrega el estado al municipio")
    colonia_pre.estado=municipio.estado;


    // Convertimos el objeto a string
    logger.info("Se convierte el objeto a string")
    const colonia_str = JSON.stringify(colonia_pre);
    // Convertimos el string a objeto
    logger.info("Se convierte el string a objeto")
    const result = JSON.parse(colonia_str);

    logger.info("Se eliminan los campos que no se necesitan")
    // Eliminamos los campos que no necesitamos
    delete result.municipio.estado;
    delete result.codigo_postal.id_municipio;
    delete result.id_colonia;
    delete result.nombre_colonia;

    logger.info("Se obtiene la colonia")
    // Obtenemos la colonia
    const colonia ={id_colonia: colonia_pre.id_colonia, nombre_colonia: colonia_pre.nombre_colonia};
    // Agregamos la colonia al objeto
    logger.info("Se agrega la colonia al objeto")
    result.colonia=colonia;
    //Retornamos el objeto
    logger.info("Se retorna el objeto", result);
    return result;
  } catch (error) {
 //   console.log(error);
  logger.error('Error en la consulta de colonias', error.message);  
 throw new Error("Error en la consulta de colonias");
  }
};


const getColoniaByIDService = async (id) => {
  try {
    // Obtenemos una colonia
    logger.info(`Obteniendo colonia con respecto al id: ${id}`);
    const colonia_pre = await modelColonias.Colonia.findOne({
      raw: true,
      where: {
        id_colonia: id,
      },
      attributes: {
        exclude: ["id_ciudad", "id_codigo_postal"],
      },
      nest: true,
    });
    logger.info("Colonia obtenida correctamente", colonia_pre);
   if (!colonia_pre) {
      logger.error("Error en la consulta de colonias");
      return null;
    }
 
    logger.info("Se obtiene retorna la colonia", colonia_pre);
    return colonia_pre;
  } catch (error) {
//    console.log(error);
    logger.error('Error en la consulta de colonias', error.message);  
throw new Error("Error en la consulta de colonias");
  }
}

// Exportamos las funciones
module.exports = {
  getColonia,
  getColoniaByIDService
};

