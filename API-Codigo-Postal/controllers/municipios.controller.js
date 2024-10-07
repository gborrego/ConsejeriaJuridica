//Constante que representa el modelo de Municipios
const modelMunicipios = require('../models/municipios.models');

/**
 * Funcion que obtiene un municipio
 * @name getMunicipio
 * @function
 * @param {number} id - Identificador del municipio
 * @returns {Object} - Objeto con el municipio
 * @throws {Error} - Error en la consulta de municipio
 */
const logger = require('../utilities/logger');

const getMunicipio = async (id) => {
    try {
        //Obtenemos un municipio
        logger.info(`Obteniendo municipio con respecto al id: ${id}`);
        const municipio = await modelMunicipios.Municipio.findOne({
            raw: true,
            where: {
                id_municipio: id
            },
            attributes:{
                exclude:['id_estado']
            },
            nest: true,
            include: [modelMunicipios.Estado]
        });
         logger.info("Municipio obtenido correctamente", municipio);
    return municipio;
    } catch (error) {
       // console.log(error);
        logger.error('Error en la consulta de municipios', error.message); 
       throw new Error('Error en la consulta de municipios');
    }
};

// Exportamos las funciones
module.exports = {
    getMunicipio,
};
