
const controlMotivo = require('../controles/controlMotivo')
const logger = require('../utilidades/logger');


async function existeMotivo(req, res, next) {
    logger.info("Middleware para validar la existencia de un motivo")
    const { id } = req.params
    const motivo = await controlMotivo.obtenerMotivoPorId(id)
    if (!motivo) {
        return res.status(404).json({
            message: 'No existe un motivo con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    logger.info("Fin del middleware para validar la existencia de un motivo")
    next()
}



async function validarJSONMotivoPOST(req, res, next) {
     logger.info("Middleware para validar el JSON del motivo en el POST")
    const { descripcion_motivo, estatus_general, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }


    if (!descripcion_motivo || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el estatus general o la descripción del motivo esta vacio.'
        })
    }

 
    if (descripcion_motivo.length > 75) {
        return res.status(400).json({
            message: 'El campo "descripcion_motivo" excede el tamaño permitido.'
        });
    }

    if (estatus_general !== 'ACTIVO' ) {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO".'
        });
    }

   logger.info("Fin del middleware para validar el JSON del motivo en el POST")

    next()
}


async function validarJSONMotivoPUT(req, res, next) {
     logger.info("Middleware para validar el JSON del motivo en el PUT")
    const { id_motivo, descripcion_motivo, estatus_general, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!id_motivo || !descripcion_motivo || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el estatus general, la descripción del motivo o el id del motivo esta vacio.'
        })
    }
     
    if (isNaN(id_motivo)) {
        return res.status(400).json({
            message: 'El campo "id_motivo" debe ser un número.'
        });
    }
   
    if (descripcion_motivo.length > 75) {
        return res.status(400).json({
            message: 'El campo "descripcion_motivo" excede el tamaño permitido.'
        });
    }

    if (estatus_general !== 'ACTIVO' && estatus_general !== 'INACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO" o "INACTIVO".'
        });
    }

    if (id_motivo !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id del motivo proporcionado no coincide con el id del motivo que se quiere modificar.'
        })
    }
    logger.info("Fin del middleware para validar el JSON del motivo en el PUT")
    next()
}


module.exports = {
    existeMotivo,
    validarJSONMotivoPOST,
    validarJSONMotivoPUT
}