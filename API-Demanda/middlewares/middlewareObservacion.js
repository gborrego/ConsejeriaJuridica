

const controlObservacion = require('../data-access/observacionDAO')
const procesoJudicialDAO = require('../data-access/proceso_judicialDAO')
const logger = require('../utilidades/logger');


async function existeProcesoJudicial(req, res, next) {
    logger.info("Middleware para validar la existencia de un proceso judicial")
    try {
        const { id_proceso_judicial } = req.query
        const procesoJudicial = await procesoJudicialDAO.obtenerProcesoJudicialMiddleware(id_proceso_judicial)
        if (!procesoJudicial) {
            return res.status(404).json({
                message: 'No existe un proceso judicial con ese id'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de un proceso judicial: " + error)
        return res.status(500).json({
            message: 'No existe un proceso judicial con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }


    logger.info("Fin del middleware para validar la existencia de un proceso judicial")

    next()
}


async function existeObservacion(req, res, next) {
    logger.info("Middleware para validar la existencia de una observacion")
    try {
        const { id } = req.params
        const observacion = await controlObservacion.obtenerObservacion(Number(id))
        if (!observacion) {
            return res.status(404).json({
                message: 'No existe una observacion con el id proporcionado, asi que no se puede continuar con la petición.'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de una observacion: " + error)
        return res.status(500).json({
            message: 'No existe una observacion con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    logger.info("Fin del middleware para validar la existencia de una observacion")
    next()
}



async function validarJSONObservacionPOST(req, res, next) {

    logger.info("Middleware para validar el JSON de la observacion en el POST")
    const { observacion, id_proceso_judicial, ...extraData } = req.body

    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!observacion || !id_proceso_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o la observacion o el id del proceso judicial esta vacio.'
        })
    }
    if (isNaN(id_proceso_judicial)) {
        return res.status(400).json({
            message: 'El id del proceso judicial no es un número.'
        })
    }
    try {
        const procesoJudicial = await procesoJudicialDAO.obtenerProcesoJudicialMiddleware(id_proceso_judicial)
        if (!procesoJudicial) {
            return res.status(404).json({
                message: 'No existe un proceso judicial con ese id'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de un proceso judicial: " + error)
        return res.status(500).json({
            message: 'No existe un proceso judicial con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    //Limite 200
    if (observacion.length > 200) {
        return res.status(400).json({
            message: 'El campo "observacion" excede el tamaño permitido.'
        });
    }

    logger.info("Fin del middleware para validar el JSON de la observacion en el POST")
    next()
}




async function validarJSONObservacionPUT(req, res, next) {

    logger.info("Middleware para validar el JSON de la observacion en el PUT")
    const { id_observacion, observacion, id_proceso_judicial, ...extraData } = req.body

    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!id_observacion || !observacion || !id_proceso_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el id de la observacion o la observacion o el id del proceso judicial esta vacio.'
        })
    }

    if (isNaN(id_observacion)) {
        return res.status(400).json({
            message: 'El id de la observacion no es un número.'
        })
    }


    if (isNaN(id_proceso_judicial)) {
        return res.status(400).json({
            message: 'El id del proceso judicial no es un número.'
        })
    }
    try {
        const procesoJudicial = await procesoJudicialDAO.obtenerProcesoJudicialMiddleware(id_proceso_judicial)
        if (!procesoJudicial) {
            return res.status(404).json({
                message: 'No existe un proceso judicial con ese id'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de un proceso judicial: " + error)
        return res.status(500).json({
            message: 'No existe un proceso judicial con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }

    if (observacion.length > 200) {
        return res.status(400).json({
            message: 'El campo "observacion" excede el tamaño permitido.'
        });
    }

    if (id_observacion !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id de la observacion proporcionado no coincide con el id de la observacion que se quiere modificar.'
        })
    }

    /*
    {
    "id_observacion": 1,
    "observacion": "bbbbb",
    "id_proceso_judicial": 1
}
    */
    try {
        const observacion_obtenida = await controlObservacion.obtenerObservacion(Number(id_observacion))

        //Evalua que el id de proceso judicial sea el mismo que el de la observacion encontrada

        if (observacion_obtenida.id_proceso_judicial !== Number(id_proceso_judicial)) {
            return res.status(400).json({
                message: 'El id del proceso judicial proporcionado no coincide con el id del proceso judicial de la observacion que se quiere modificar.'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de una observacion: " + error)
        return res.status(500).json({
            message: 'No existe una observacion con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    logger.info("Fin del middleware para validar el JSON de la observacion en el PUT")
    next()
}





module.exports = {
    existeObservacion,
    validarJSONObservacionPOST,
    validarJSONObservacionPUT
    , existeProcesoJudicial
}
