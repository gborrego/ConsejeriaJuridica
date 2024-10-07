const controlDefensores = require('../controles/controlDefensor');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');

/**
 * @abstract Servicio  que permite obtener todos los defensores
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * */
const obtenerDefensores = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener los defensores")

    logger.info("Se obtienen los parametros de la petición", req.query)
    const id_distrito_judicial = req.query.id_distrito_judicial;
    const pagina = req.query.pagina;

    logger.info("Se llama al control de defensores, y asi el de obtener defensores por pagina y distrito judicial")
    const result = await controlDefensores.obtenerDefensores(id_distrito_judicial, pagina);

    logger.info("Se valida el resultado de la consulta de defensores")
    if (result === null || result === undefined || result.length === 0) {
        logger.info("No se encontraron defensores")
        const error = new CustomeError('No se encontraron defensores', 404);
        return next(error);
    } else {
        logger.info("Se retornan los defensores")
        res.status(200).json({
            defensores: result
        });
    }
});




const obtenerDefensoresByDistrito = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener los defensores por distrito judicial")

    logger.info("Se obtienen los parametros de la petición", req.query)
    const {id_distrito_judicial,activo }= req.query

    logger.info("Se llama al control de defensores, y asi el de obtener defensores por distrito judicial")
    const result = await controlDefensores.obtenerDefensoresByDistrito(id_distrito_judicial, activo);

    logger.info("Se valida el resultado de la consulta de defensores")
    if (result === null || result === undefined || result.length === 0) {
        logger.info("No se encontraron defensores")
        const error = new CustomeError('No se encontraron defensores', 404);
        return next(error);
    } else {
        logger.info("Se retornan los defensores")
        res.status(200).json({
            defensores: result
        });
    }

});
/**
 * @abstract Servicio  que permite obtener un defensor por su id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * */
const obtenerDefensorPorId = asyncError(async (req, res, next) => {

    logger.info("Petición para obtener un defensor por id", req.params.id)


    logger.info("Se llama al control de defensores, y asi el de obtener defensor por id")
    const result = await controlDefensores.obtenerDefensorPorId(req.params.id);

    logger.info("Se valida el resultado de la consulta de defensores")
    if (result === null || result === undefined) {

        logger.info("No se encontró el defensor")
        const error = new CustomeError('No se encontró el defensor', 404);
        return next(error);
    } else {

        logger.info("Se retorna el defensor")
        res.status(200).json({
            defensor: result
        });
    }
}
);


const obtenerDefensoresZona = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener los defensores por zona")

    logger.info("Se obtienen los parametros de la petición", req.params.id)
    const result = await controlDefensores.obtenerDefensoresZona(req.params.id);
    
    logger.info("Se valida el resultado de la consulta de defensores")
    if (result === null || result === undefined || result.length === 0) {
        logger.info("No se encontraron defensores")
        const error = new CustomeError('Error al obtener el defensor', 404);
        return next(error);
    } else {
        logger.info("Se retornan los defensores")
        res.status(200).json({
            defensor: result
        });
    }
}
);


//Module exports
module.exports = {
    obtenerDefensores,
    obtenerDefensorPorId,
    obtenerDefensoresZona,
    obtenerDefensoresByDistrito
};
