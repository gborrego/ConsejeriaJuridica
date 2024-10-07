
const controlEstadoCivil = require('../controles/controlEstadoCivil')

const logger = require('../utilidades/logger');

async function existeEstadoCivil(req, res, next) {
    logger.info("Middleware para validar la existencia de un estado civil")
    const { id } = req.params
    const estadoCivil = await controlEstadoCivil.obtenerEstadoCivilPorId(id)
    if (!estadoCivil) {
        return res.status(404).json({
            message: 'No existe un estado civil con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    logger.info("Fin del middleware para validar la existencia de un estado civil")
    next()
}

async function validarJSONEstadoCivilPOST(req, res, next) {
    logger.info("Middleware para validar el JSON del estado civil en el POST")
    const { estado_civil, estatus_general, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }


    if (!estado_civil || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición , o el estatus general o el estado civil esta vacio.'
        })
    }
    //Limite 50

    if (estado_civil.length > 50) {
        return res.status(400).json({
            message: 'El campo "estado_civil" excede el tamaño permitido.'
        });
    }

    if (estatus_general !== 'ACTIVO' ) {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO".'
        });
    }

    logger.info("Fin del middleware para validar el JSON del estado civil en el POST")

    next()
}



async function validarJSONEstadoCivilPUT(req, res, next) {
    logger.info("Middleware para validar el JSON del estado civil en el PUT")
    const { id_estado_civil, estado_civil, estatus_general, ...extraData } = req.body
    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!id_estado_civil || !estado_civil || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el estatus general o el estado civil esta vacio.'
        })
    }
    
    if (isNaN(id_estado_civil)) {
        return res.status(400).json({
            message: 'El campo "id_estado_civil" no acepta valores numericos.'
        });
    }


    //Limite 50
    if (estado_civil.length > 50) {
        return res.status(400).json({
            message: 'El campo "estado_civil" excede el tamaño permitido.'
        });

    }

    if (estatus_general !== 'ACTIVO' && estatus_general !== 'INACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO" o "INACTIVO".'
        });
    }


    if (id_estado_civil !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id del estado civil proporcionado no coincide con el id del estado civil que se quiere modificar.'
        })
    }
    logger.info("Fin del middleware para validar el JSON del estado civil en el PUT")
    next()
}


module.exports = {
    existeEstadoCivil,
    validarJSONEstadoCivilPOST,
    validarJSONEstadoCivilPUT
}