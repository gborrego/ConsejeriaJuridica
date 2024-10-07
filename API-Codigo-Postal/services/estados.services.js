// Constante que almacena el controlador de estados
const controlEstados = require('../controllers/estados.controller.js'); 
// Constante que almacena el manejador de errores asincronos
const asyncError = require('../utilities/asyncError.js');
// Constante que almacena el manejador de errores personalizados
const CustomeError = require('../utilities/customeError.js');
const logger = require('../utilities/logger');
// Funcion para obtener un estado por su id y enviarlo como respuesta en formato JSON o enviar un error si no se encuentra
exports.getEstado = asyncError(async (req, res, next) => {
    logger.info("Petición para obtener un estado por su id", req.params.id);
    logger.info("Se mandará llamar al controlador de estados");
    const estado = await controlEstados.getEstado(req.params.id);
    logger.info("Se verifica si el estado es nulo");
    if (!estado) {
        logger.error("No se encontró el estado");
        return next(new CustomeError('No se encontró el estado', 404)); 
    }
    logger.info("Se envía el estado como respuesta en formato JSON");
    res.status(200).json({ 
        estado: estado
    });
    });
    

