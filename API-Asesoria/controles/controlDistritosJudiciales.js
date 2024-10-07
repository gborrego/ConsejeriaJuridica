const modeloDistritoJudicial = require('../modelos/modeloDistritoJudicial.js');
const logger = require('../utilidades/logger');


/**
 * @abstract Controlador que permite obtener todos los distritos judiciales
 * @returns {Object} Distritos judiciales
 */
const obtenerDistritosJudiciales = async () => {
    logger.info("Se obtienen los distritos judiciales")
    const distritosJudiciales = await modeloDistritoJudicial.DistritoJudicial.findAll({
        
        raw: false,
        nest: true,
        attributes: {
            exclude: ['id_municipio_distrito','id_zona']
        },
        include: [
            modeloDistritoJudicial.MunicipioDistro
            ,
            modeloDistritoJudicial.Zona
        ]
    });
    logger.info("Se retornan los distritos judiciales")
    return distritosJudiciales;
};


/**
 * @abstract Controlador que permite obtener un distrito judicial
 * @param {Number} id Id del distrito judicial
 * @returns {Object} Distrito judicial
 */

const obtenerDistritoJudicial = async (id) => {

    try {
        logger.info("Se obtiene el distrito judicial por su id", id)
        const distritoJudicial = await modeloDistritoJudicial.DistritoJudicial.findByPk(id,{
         
            raw: false,
            nest: true,
            attributes: {
                exclude: ['id_municipio_distrito','id_zona']
            },
            include: [
                modeloDistritoJudicial.MunicipioDistro
                ,
                modeloDistritoJudicial.Zona
            ]
        });
        logger.info("Se retorna el distrito judicial", distritoJudicial)
        return distritoJudicial;
    } catch (error) {
        //console.log(error);
        logger.error("Error distrito judicial:", error.message);
    }




};

const obtenerDistritoPorPorIdMiddleware = async (id) => {
    logger.info("Se obtiene el distrito judicial por su id", id)
    const distritoJudicial = await modeloDistritoJudicial.DistritoJudicial.findByPk(id,{
        raw: false,
        nest: true,
    });
    logger.info("Se retorna el distrito judicial", distritoJudicial)
    return distritoJudicial;
}

//Module exports
module.exports = {
    obtenerDistritosJudiciales,
    obtenerDistritoJudicial,
    obtenerDistritoPorPorIdMiddleware
};