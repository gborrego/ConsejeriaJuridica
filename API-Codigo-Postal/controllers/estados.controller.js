//Esta constante representa el modelo de Estados
const modelEstados = require("../models/estados.models.js");

/**
 * Funcion que obtiene un estado
 * @name getEstado  
 * @function
 * @param {number} id - Identificador del estado
 * @returns {Object} - Objeto con el estado
 * @throws {Error} - Error en la consulta de estado
 */
const logger = require('../utilities/logger');

const getEstado = async (id) => {
  try {
    // Obtenemos un estado
    logger.info(`Obteniendo estado con respecto al id: ${id}`);
    const estado = await modelEstados.Estado.findOne({
      where: {
        id_estado: id,
      },
      raw: false,
      nest: true,
      include: [
        {
          model: modelEstados.Municipio,
          required: true,
        },
      ],
    });
    logger.info("Estado obtenido correctamente", estado);
    logger.info("Se verifica si el estado es nulo")
    if (!estado) {
      logger.error("Error en la consulta de estados");
      return null;
    }
    // Creamos un arreglo con los municipios del estado 
    logger.info("Se obtienen los municipios del estado")
    const municipios = [];
    // Iteramos sobre los municipios para obtener sus nombres y agregarlos al arreglo
    logger.info("Se itera sobre los municipios para obtener sus nombres y agregarlos al arreglo")
    for (const municipio of estado.municipios) {
      // Obtenemos el municipio
      municipios.push(municipio);
//      municipios.push(municipio.nombre_municipio);
    }
    // Creamos un objeto con el estado y sus municipios
    logger.info("Se crea un objeto con el estado y sus municipios")
    const result = {
      id_estado: estado.id_estado,
      nombre_estado: estado.nombre_estado,
      municipios: municipios,
    };
    logger.info("Se retorna el objeto", result);
    // Retornamos el objeto
    return result;
  } catch (error) {
  //   console.error(error);
     logger.error("Error en la consulta de estados", error.message);  
  return error.message;
  }
}
 // Exportamos las funciones
module.exports = {
  getEstado,
};