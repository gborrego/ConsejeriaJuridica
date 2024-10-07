const controlMunicipioDistro = require('../controles/controlMunicipioDistro');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');



/**
 * @abstract Servicio  que permite obtener todos los municipios
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * */
const obtenerMunicipios = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener los municipios")

    logger.info("Se llama al control de municipios, y asi el de obtener municipios")
    const result = await controlMunicipioDistro.obtenerMunicipios();

    logger.info("Se valida el resultado de la consulta de municipios")
    if (result === null || result === undefined || result.length === 0) {
        logger.info("No se encontraron municipios")
        const error = new CustomeError('No se encontraron municipios', 404);
        return next(error);
    } else {
        logger.info("Se retornan los municipios")
        res.status(200).json({
            municipios: result
        });
    }

}
);


const obtenerMunicipiosDistrito = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener los municipios por distrito")

    logger.info("Se llama al control de municipios, y asi el de obtener municipios por distrito")
    const result = await controlMunicipioDistro.obtenerMunicipiosDistrito(req.params.id);

    logger.info("Se valida el resultado de la consulta de municipios")
    if (result === null || result === undefined || result.length === 0) {

        logger.info("No se encontraron municipios")
        const error = new CustomeError('No se encontraron municipios', 404);
        return next(error);
    } else {
        logger.info("Se retornan los municipios")
        res.status(200).json({
            municipios: result
        });
    }
}
);



//Module exports
module.exports = {
    obtenerMunicipios,
    obtenerMunicipiosDistrito
}
