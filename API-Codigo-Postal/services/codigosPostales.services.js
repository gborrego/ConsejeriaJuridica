// Constantes que almacenan el modulo de control para codigos postales
const   controlCodigosPostales = require('../controllers/codigosPostales.controllers.js');
//Constante que almacena el modulo de errores asincronos
const asyncError = require('../utilities/asyncError.js');
//Constante que almacena el modulo de errores personalizados
const CustomeError = require('../utilities/customeError.js');
const logger = require('../utilities/logger');


//Funcion para obtener las colonias por codigo postal y enviarlas como respuesta en formato JSON o enviar un error si no se encuentran
exports.getColoniasByCodigoPostal = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener colonias por codigo postal", req.params.cp);
    logger.info("Se mandará llamar al controlador de codigos postales");
    const colonias = await controlCodigosPostales.getColoniasByCodigoPostal(req.params.cp);
    logger.info("Se verifica si las colonias son nulas");
    if (!colonias) {
        logger.error("No se encontraron colonias");
        return next(new CustomeError('No se encontraron colonias', 404));
    }
    logger.info("Se envían las colonias como respuesta en formato JSON");
    res.status(200).json({
        colonias: colonias
    });
});

