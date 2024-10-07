


const controlResolucion = require('../data-access/resolucionDAO')
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

async function existeResolucion(req, res, next) {
    logger.info("Middleware para validar la existencia de una resolución")

    const { id } = req.params
    try{
    const resolucion = await controlResolucion.obtenerResolucion(Number(id))
    if (!resolucion) {
        return res.status(404).json({
            message: 'No existe una resolución con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
} catch (error) {
    logger.error("Error en el middleware para validar la existencia de una resolución: " + error)
    return res.status(500).json({
        message: 'No existe una resolución con el id proporcionado, asi que no se puede continuar con la petición.'
    })
}


    logger.info("Fin del middleware para validar la existencia de una resolución")
    next()
}




async function validarJSONResolucionPOST(req, res, next) {

    logger.info("Middleware para validar el JSON de la resolución en el POST")

    const { resolucion, fecha_resolucion, id_proceso_judicial, ...extraData } = req.body

    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!resolucion || !fecha_resolucion || !id_proceso_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición,  la resolución, la fecha de la resolución o el id del proceso judicial esta vacio.'
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

    if (resolucion.length > 200) {
        return res.status(400).json({
            message: 'El campo "resolucion" excede el tamaño permitido.'
        });
    }

    if (isNaN(Date.parse(fecha_resolucion))) {
        return res.status(400).json({
            message: 'El campo "fecha_estado_procesal" no es una fecha.'
        });
    }


    logger.info("Fin del middleware para validar el JSON de la resolución en el POST")
    next()
}




async function validarJSONResolucionPUT(req, res, next) {
    logger.info("Middleware para validar el JSON de la resolución en el PUT")

    const { id_resolucion, resolucion, fecha_resolucion, id_proceso_judicial, ...extraData } = req.body

    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }


    if (!id_resolucion || !resolucion || !fecha_resolucion || !id_proceso_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición.'
        })
    }

    if (isNaN(id_resolucion)) {
        return res.status(400).json({
            message: 'El id de la resolución no es un número.'
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
    if (resolucion.length > 200) {
        return res.status(400).json({
            message: 'El campo "resolucion" excede el tamaño permitido.'
        });
    }


    if (isNaN(Date.parse(fecha_resolucion))) {
        return res.status(400).json({
            message: 'El campo "fecha_estado_procesal" no es una fecha.'
        });
    }


    if (id_resolucion !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id de la resolución proporcionado no coincide con el id de la resolución que se quiere modificar.'
        })
    }

    /*
 {
     "id_resolucion": 1,
     "resolucion": "aaaaaaaaaaaa",
     "fecha_resolucion": "2024-05-11",
     "id_proceso_judicial": 1
 }
    */
try{
    const resolucion_obtenida = await controlResolucion.obtenerResolucion(Number(id_resolucion));
    //Evalua que el id del proceso judicial sea el mismo que el de la resolucion encontrada
    if (resolucion_obtenida.id_proceso_judicial !== id_proceso_judicial) {
        return res.status(400).json({
            message: 'El id del proceso judicial proporcionado no coincide con el id del proceso judicial de la resolución que se quiere modificar.'
        })
    }
} catch (error) {
    logger.error("Error en el middleware para validar la existencia de una resolución: " + error)
    return res.status(500).json({
        message: 'No existe una resolución con el id proporcionado, asi que no se puede continuar con la petición.'
    })
}

    logger.info("Fin del middleware para validar el JSON de la resolución en el PUT")

    next()
}





module.exports = {
    existeResolucion,
    validarJSONResolucionPOST,
    validarJSONResolucionPUT,
    existeProcesoJudicial
}