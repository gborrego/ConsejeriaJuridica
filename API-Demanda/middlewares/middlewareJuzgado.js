
const controlJuzgado = require('../data-access/juzgadoDAO')

const logger = require('../utilidades/logger');

async function existeJuzgado(req, res, next) {
    logger.info("Middleware para validar la existencia de un juzgado")
    try {
    const { id } = req.params
    const juzgado = await controlJuzgado.obtenerJuzgado(Number(id))
    if (!juzgado) {
        return res.status(404).json({
            message: 'No existe un juzgado con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
} catch (error) {
    logger.error("Error en el middleware para validar la existencia de un juzgado", { error: error.message })
    return res.status(500).json({
        message: 'No existe un juzgado con el id proporcionado, asi que no se puede continuar con la petición.'
    })
}
    logger.info("Fin del middleware para validar la existencia de un juzgado")
    next()
}



async function validarJSONJuzgadoPOST(req, res, next) {

    logger.info("Middleware para validar el JSON del juzgado en el POST")
    const { nombre_juzgado, estatus_general, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }


    if (!nombre_juzgado || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el nombre del juzgado o el estatus general esta vacio.'
        })
    }


    if (nombre_juzgado.length > 50) {
        return res.status(400).json({
            message: 'El campo "nombre_juzgado" excede el tamaño permitido.'
        });
    }


    if (estatus_general !== 'ACTIVO' ) {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO".'
        });
    }

    logger.info("Fin del middleware para validar el JSON del juzgado en el POST")
    next()
}




async function validarJSONJuzgadoPUT(req, res, next) {
    logger.info("Middleware para validar el JSON del juzgado en el PUT")
    const { id_juzgado, nombre_juzgado, estatus_general, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!id_juzgado || !nombre_juzgado || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el id del juzgado, el nombre del juzgado o el estatus general esta vacio.'
        })
    }
    
    if (isNaN(id_juzgado)) {
        return res.status(400).json({
            message: 'El campo "id_juzgado" no acepta valores numericos.'
        });
    }

    if (nombre_juzgado.length > 50) {
        return res.status(400).json({
            message: 'El campo "nombre_juzgado" excede el tamaño permitido.'
        });
    }

    if (estatus_general !== 'ACTIVO' && estatus_general !== 'INACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO" o "INACTIVO".'
        });
    }


    if (id_juzgado !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id del juzgado proporcionado no coincide con el id del juzgado que se quiere modificar.'
        })
    }
    logger.info("Fin del middleware para validar el JSON del juzgado en el PUT")
    next()
}




module.exports = {
    existeJuzgado,
    validarJSONJuzgadoPOST,
    validarJSONJuzgadoPUT
}