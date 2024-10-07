const controlDistritoJudicial = require('../controles/controlDistritosJudiciales');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");

const logger = require('../utilidades/logger');


/**
 * @abstract Servicio que permite obtener todos los distritos judiciales
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 *  
 * */
const obtenerDistritosJudiciales = asyncError(async (req, res, next) => {

    logger.info("Petición para obtener los distritos judiciales")


    logger.info("Se llama al control de distritos judiciales, y asi el de obtener distritos judiciales")
    const result = await controlDistritoJudicial.obtenerDistritosJudiciales();

    logger.info("Se valida el resultado de la consulta de distritos judiciales")
    if (result === null || result === undefined || result.length === 0) {

        logger.info("No se encontraron distritos judiciales")
        const error = new CustomeError('No se encontraron distritos judiciales', 404);
        return next(error);
    } else {
        logger.info("Se retornan los distritos judiciales")
        res.status(200).json({
            distritosJudiciales: result
        });
    }

}
);






//Module exports
module.exports = {

    obtenerDistritosJudiciales
};
