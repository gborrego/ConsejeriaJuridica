//Esta modelo representa el Codigo  Postal 
const modelCodigosPostales = require("../models/codigosPostales.models");
// Constante encargada de obtener las colonias o denominado controlador
const getColonias = require("../controllers/colonias.controllers");

const logger = require('../utilities/logger');
const { log } = require("winston");


/**
 *  Funcion que obtiene las colonias por codigo postal
 * @param {*} cp  Codigo Postal
 * @returns  {Object} - Objeto con el codigo postal y sus colonias
 */
const getColoniasByCodigoPostal = async (cp) => {
  try {
     // Obtenemos el codigo postal y sus colonias
    logger.info(`Obteniendo colonias con respecto al codigo postal: ${cp}`);
    const codigoPostal_pre = await modelCodigosPostales.CodigoPostal.findOne({
      where: {
        codigo_postal: cp,
      },
      raw: false,
      nest: true,
      include: [
        {
          model: modelCodigosPostales.Colonia,
          attributes: {
            exclude: ["id_ciudad", "id_codigo_postal"],
            },
          required: true,
        },
      ],
    });
    logger.info("Codigo Postal obtenido correctamente", codigoPostal_pre);

    if (!codigoPostal_pre) {
      logger.error("Error en la consulta de codigos postales");
      return null;
     }
    // Creamos un arreglo con las colonias del codigo postal
    logger.info("Se crea un arreglo con las colonias del codigo postal")
    const colonias = [];
    // Recorremos las colonias
    logger.info("Se recorren las colonias")
    for (const colonia of codigoPostal_pre.colonias) {
      // Obtenemos la colonia y la agregamos al arreglo
      colonias.push(colonia);
    }
    
    // Obtenemos la colonia
    logger.info("Se obtiene la colonia")
    const id_colonia = colonias[0].id_colonia;
    // Obtenemos la colonia por id
    logger.info("Se obtiene la colonia por id")
    const colonia = await getColonias.getColonia(id_colonia);
    
    // Eliminamos los campos id_ciudad e id_codigo_postal
    logger.info("Se eliminan los campos id_ciudad e id_codigo_postal")
    colonias.forEach((colonia) => {
        delete colonia.id_ciudad;
        delete colonia.id_codigo_postal;

    });
   logger.info("Se parsean los objetos, se eliminan los campos id_municipio y colonias")
    // Realizamos el parseo de los objetos
    const codigoPstal_str = JSON.stringify(codigoPostal_pre);
    const codigoPostal = JSON.parse(codigoPstal_str);

    // Eliminamos los campos id_municipio y colonias
    delete codigoPostal.colonias;
    delete codigoPostal.id_municipio;

    // Realizamos el parseo de los objetos municipio y eliminamos el campo estado
    const municipio_str = JSON.stringify(colonia.municipio);
    const municipio = JSON.parse(municipio_str);
    delete municipio.estado;

     logger.info("Se crea un objeto con el codigo postal y sus colonias")
    // Creamos un objeto con el codigo postal y sus colonias
    const result = {
      //id_codigo_postal: codigoPostal_pre.id_codigo_postal,
      codigo_postal: codigoPostal,//.codigo_postal,
      colonias:  colonias,
      ciudad: colonia.ciudad,
      municipio: municipio,
      estado: colonia.estado,
    };
    logger.info("Se retorna el objeto", result);
    return result;
  } catch (error) {
    //console.error(error);
     logger.error("Error en la consulta de codigos postales", error.message);
    return error.message;
  }
};

// Exportamos las funciones
module.exports = {
  getColoniasByCodigoPostal,
};
