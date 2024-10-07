const modeloMunicipioDistro = require('../modelos/modeloMunicipioDistro.js');
const logger = require('../utilidades/logger');

/**
 * @abstract Función que permite obtener todos los municipios
 * @returns  municipios
 * */
const obtenerMunicipios = async () => {
    try {
        logger.info("Se obtienen los municipios")
        return await modeloMunicipioDistro.MunicipioDistro.findAll({
            raw: false,
            nest: true,
        });
    } catch (error) {
        logger.error("Error municipios distritos:", error.message);
      //  console.log("Error municipios distritos:", error.message);
        return null;
    }
};
const obtenerMunicipiosDistrito = async (id) => {
    try {
        logger.info("Se obtienen los municipios por distrito judicial", id)
        return await modeloMunicipioDistro.MunicipioDistro.findAll({
            where: {
                id_distrito_judicial: id
            },
            raw: false,
            nest: true,
        });
    } catch (error) {
        logger.error("Error municipios distritos:", error.message);
       // console.log("Error municipios distritos:", error.message);
        return null;
    }
}

/**
 * @abstract Función que permite obtener un municipio por su id
 * @param {*} id id del municipio
 * @returns municipio
 * */
const obtenerMunicipioPorId = async (id) => {
    try {
        logger.info("Se obtiene el municipio por su id", id)
        return await modeloMunicipioDistro.MunicipioDistro.findByPk(id, {
            raw: false,
            nest: true,
        });
    } catch (error) {
        //console.log("Error municipios distritos:", error.message);
        logger.error("Error municipios distritos:", error.message);
        return null;
    }
};


const obtenerMunicipioDistritoPorPorIdMiddleware = async (id) => {
    logger.info("Se obtiene el municipio por su id", id)    
    const municipio = await modeloMunicipioDistro.MunicipioDistro.findByPk(id,{
        raw: false,
        nest: true,
    });
    logger.info("Se obtiene el municipio por su id", municipio)
    return municipio;
};


// Exportar los módulos
module.exports = {
    obtenerMunicipios,
    obtenerMunicipioPorId,
    obtenerMunicipiosDistrito,
    obtenerMunicipioDistritoPorPorIdMiddleware
};