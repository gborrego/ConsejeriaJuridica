

const { log } = require('@grpc/grpc-js/build/src/logging');
const controlOcupacion = require('../data-access/ocupacionDAO')

const logger = require('../utilidades/logger');

async function existeOcupacion(req, res, next) {
 try {
    logger.info("Middleware para validar la existencia de una ocupación")
    const { id } = req.params
    const ocupacion = await controlOcupacion.obtenerOcupacion(Number(id))
    if (!ocupacion) {
        return res.status(404).json({
            message: 'No existe una ocupación con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
} catch (error) {
    logger.error("Error en el middleware para validar la existencia de una ocupación", { error: error.message })
    return res.status(500).json({
        message: 'No existe una ocupación con el id proporcionado, asi que no se puede continuar con la petición.'
    })
}

    logger.info("Fin del middleware para validar la existencia de una ocupación")
    next()
}



async function validarJSONOcupacionPOST(req, res, next) {
   logger.info("Middleware para validar el JSON de la ocupación en el POST")

    const { descripcion_ocupacion, estatus_general, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!descripcion_ocupacion || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición , o la descripción de la ocupación o el estatus general esta vacio.'
        })
    }


    if (descripcion_ocupacion.length > 50) {
        return res.status(400).json({
            message: 'El campo "descripcion_ocupacion" excede el tamaño permitido.'
        });
    }


    if (estatus_general !== 'ACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO".'
        });
    }

   
    logger.info("Fin del middleware para validar el JSON de la ocupación en el POST")

    next()
}




async function validarJSONOcupacionPUT(req, res, next) {
    logger.info("Middleware para validar el JSON de la ocupación en el PUT")
    const { id_ocupacion, descripcion_ocupacion, estatus_general, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!id_ocupacion || !descripcion_ocupacion || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición.'
        })
    }
     
    if (isNaN(id_ocupacion)) {
        return res.status(400).json({
            message: 'El id de la ocupación no es un número.'
        });
    }
    
      
    if (descripcion_ocupacion.length > 50) {
        return res.status(400).json({
            message: 'El campo "descripcion_ocupacion" excede el tamaño permitido.'
        });
    }


    if (estatus_general !== 'ACTIVO' && estatus_general !== 'INACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO" o "INACTIVO".'
        });
    }


    if (id_ocupacion !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id de la ocupación proporcionado no coincide con el id de la ocupación que se quiere modificar.'
        })
    }

    logger.info("Fin del middleware para validar el JSON de la ocupación en el PUT")
    next()
}




module.exports = {
    existeOcupacion,
    validarJSONOcupacionPOST,
    validarJSONOcupacionPUT
}