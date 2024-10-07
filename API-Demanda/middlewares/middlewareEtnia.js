

const controlEtnia = require('../data-access/etniaDAO')

const logger = require('../utilidades/logger');

async function existeEtnia(req, res, next) {

    logger.info("Middleware para validar la existencia de una etnia")
    try{    
    const { id } = req.params
    const etnia = await controlEtnia.obtenerEtnia(Number(id))
    if (!etnia) {
        return res.status(404).json({
            message: 'No existe una etnia con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
} catch (error) {
    logger.error("Error en el middleware para validar la existencia de una etnia", { error: error.message })
    return res.status(500).json({
        message: 'No existe una etnia con el id proporcionado, asi que no se puede continuar con la petición.'
    })
}
    logger.info("Fin del middleware para validar la existencia de una etnia")
    next()
}



async function validarJSONEtniaPOST(req, res, next) {
    logger.info("Middleware para validar el JSON de la etnia en el POST")
    const { nombre, estatus_general, ...extraData} = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!nombre || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición , o el nombre de la etnia o el estatus general esta vacio.'
        })
    }
    //Limite 50

    if (nombre.length > 50) {
        return res.status(400).json({
            message: 'El campo "nombre" excede el tamaño permitido.'
        });
    }

    if (estatus_general !== 'ACTIVO' ) {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO".'
        });
    }

      logger.info("Fin del middleware para validar el JSON de la etnia en el POST")
    next()
}




async function validarJSONEtniaPUT(req, res, next) {
    logger.info("Middleware para validar el JSON de la etnia en el PUT")
    const { id_etnia, nombre, estatus_general, ...extraData } = req.body
  
    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }


    if (!id_etnia || !nombre || !estatus_general) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición , o el nombre de la etnia o el estatus general esta vacio.'
        })
    } 

    if (isNaN(id_etnia)) {
        return res.status(400).json({
            message: 'El campo "id_etnia" no acepta valores numericos.'
        });
    }

    if (nombre.length > 50) {
        return res.status(400).json({
            message: 'El campo "nombre" excede el tamaño permitido.'
        });

    }

    if (estatus_general !== 'ACTIVO' && estatus_general !== 'INACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO" o "INACTIVO".'
        });
    }


    if (id_etnia !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id de la etnia proporcionado no coincide con el id de la etnia que se quiere modificar.'
        })
    }
    logger.info("Fin del middleware para validar el JSON de la etnia en el PUT")
    next()
}




module.exports = {
    existeEtnia,
    validarJSONEtniaPOST,
    validarJSONEtniaPUT
}