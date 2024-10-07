
const controlTipoJuicio = require('../controles/controlTipoJuicio')
const logger = require('../utilidades/logger');

async function existeTipoJuicio(req, res, next) {
 logger.info("Middleware para validar la existencia de un tipo de juicio")
    const { id } = req.params
    const tipoJuicio = await controlTipoJuicio.obtenerTipoDeJuicioPorId(id)
    if (!tipoJuicio) {
        return res.status(404).json({
            message: 'No existe un tipo de juicio con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }

    logger.info("Fin del middleware para validar la existencia de un tipo de juicio")
    next()
}


async function validarJSONTipoJuicioPOST(req, res, next) {

    logger.info("Middleware para validar el JSON del tipo de juicio en el POST")
    const { tipo_juicio, estatus_general, ...extraData } = req.body;

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    // Verifica si faltan datos requeridos en el cuerpo de la petición
    if (!tipo_juicio || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el estatus general o el tipo de juicio esta vacio.'
        });
    }


    if (tipo_juicio.length > 100) {
        return res.status(400).json({
            message: 'El campo "tipo_juicio" excede el tamaño permitido.'
        });
    }


    if (estatus_general !== 'ACTIVO' ) {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO".'
        });
    }
 
    logger.info("Fin del middleware para validar el JSON del tipo de juicio en el POST")
    next();
}




async function validarJSONTipoJuicioPUT(req, res, next) {

    logger.info("Middleware para validar el JSON del tipo de juicio en el PUT")
    const { id_tipo_juicio, tipo_juicio, estatus_general, ...extraData } = req.body;
    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    // Verifica si faltan datos requeridos en el cuerpo de la petición
    if (!id_tipo_juicio || !tipo_juicio || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el estatus general,  el tipo de juicio  o el id de tipo de juicio esta vacio.'
        });
    }
 
    if (isNaN(id_tipo_juicio)) {
        return res.status(400).json({
            message: 'El campo "id_tipo_juicio" no acepta valores numericos.'
        });
    }

    if (tipo_juicio.length > 100) {
        return res.status(400).json({
            message: 'El campo "tipo_juicio" excede el tamaño permitido.'
        });
    }


    if (estatus_general !== 'ACTIVO' && estatus_general !== 'INACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO" o "INACTIVO".'
        });
    }

    if (id_tipo_juicio !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id del tipo de juicio proporcionado no coincide con el id del tipo de juicio que se quiere modificar.'
        });
    }
    logger.info("Fin del middleware para validar el JSON del tipo de juicio en el PUT")

    next();
}

module.exports = {
    existeTipoJuicio,
    validarJSONTipoJuicioPOST,
    validarJSONTipoJuicioPUT
}