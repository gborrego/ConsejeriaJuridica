//Constante que almacena el controlador de colonias
const controlColonias = require('../controllers/colonias.controllers');
//Constante que almacena el manejador de errores asincronos
const asyncError = require('../utilities/asyncError.js');
// Constante que almacena el manejador de errores personalizados
const CustomeError = require('../utilities/customeError.js');
const logger = require('../utilities/logger');

//Funcion para obtener una colonia por su id y enviarla como respuesta en formato JSON o enviar un error si no se encuentra
exports.getColonia = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener una colonia por su id", req.params.id);
    logger.info("Se mandará llamar al controlador de colonias");
    const colonia = await controlColonias.getColonia(req.params.id);
    logger.info("Se verifica si la colonia es nula");
    if (!colonia) {
        logger.error("No se encontró la colonia");
        return next(new CustomeError(`No se encontró una colonia con el id ${req.params.id}`, 404));
    }
    logger.info("Se envía la colonia como respuesta en formato JSON");
    res.status(200).json({
        colonia: colonia
    });
});





