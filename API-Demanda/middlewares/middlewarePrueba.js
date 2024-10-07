

const controlPrueba = require('../data-access/pruebaDAO')
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

async function existePrueba(req, res, next) {
    logger.info("Middleware para validar la existencia de una prueba")
    try {
    const { id } = req.params
    const prueba = await controlPrueba.obtenerPrueba(Number(id))
    if (!prueba) {
        return res.status(404).json({
            message: 'No existe una prueba con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
} catch (error) {
    logger.error("Error en el middleware para validar la existencia de una prueba", { error: error.message })
    return res.status(500).json({
        message: 'No existe una prueba con el id proporcionado, asi que no se puede continuar con la petición.'
    })
}

    logger.info("Fin del middleware para validar la existencia de una prueba")
    next()
}



async function validarJSONPruebaPOST(req, res, next) {

    logger.info("Middleware para validar el JSON de la prueba en el POST")
    const { descripcion_prueba, id_proceso_judicial, ...extraData } = req.body
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!descripcion_prueba || !id_proceso_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o la descripción de la prueba o el id del proceso judicial esta vacio.'
        })
    }

    if (isNaN(id_proceso_judicial)) {
        return res.status(400).json({
            message: 'El id del proceso judicial no es un número.'
        })
    }
    try{
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

    if (descripcion_prueba.length > 200) {
        return res.status(400).json({
            message: 'El campo "descripcion_prueba" excede el tamaño permitido.'
        });
    }
   logger.info("Fin del middleware para validar el JSON de la prueba en el POST")
    next()
}




async function validarJSONPruebaPUT(req, res, next) {

    logger.info("Middleware para validar el JSON de la prueba en el PUT")
    const { id_prueba, descripcion_prueba, id_proceso_judicial, ...extraData } = req.body

    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!id_prueba || !descripcion_prueba || !id_proceso_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o la descripción de la prueba o el id del proceso judicial esta vacio.'
        })
    }

    if (isNaN(id_prueba)) {
        return res.status(400).json({
            message: 'El id de la prueba no es un número.'
        })
    }



    if (isNaN(id_proceso_judicial)) {
        return res.status(400).json({
            message: 'El id del proceso judicial no es un número.'
        })
    }
try{
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

    if (descripcion_prueba.length > 200) {
        return res.status(400).json({
            message: 'El campo "descripcion_prueba" excede el tamaño permitido.'
        });
    }

    if (id_prueba !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id de la prueba proporcionado no coincide con el id de la prueba que se quiere modificar.'
        })
    }
    /*
  {
      "id_prueba": 1,
      "descripcion_prueba": "aaaaaaaaaaaaa",
      "id_proceso_judicial": 1
  }
    */
   try {
    const prueba_obtenida = await controlPrueba.obtenerPrueba(Number(id_prueba))
    //Evalua que el id del proceso judicial sea el mismo que el de la prueba encontrada

    if (prueba_obtenida.id_proceso_judicial !== Number(id_proceso_judicial)) {
        return res.status(400).json({
            message: 'El id del proceso judicial proporcionado no coincide con el id del proceso judicial al que pertenece la prueba que se quiere modificar.'
        })
    }

} catch (error) {
    logger.error("Error en el middleware para validar la existencia de una prueba: " + error)
    return res.status(500).json({
        message: 'No existe una prueba con el id proporcionado, asi que no se puede continuar con la petición.'
    })
}
    logger.info("Fin del middleware para validar el JSON de la prueba en el PUT")
    next()
}





module.exports = {
    existePrueba,
    validarJSONPruebaPOST,
    validarJSONPruebaPUT,
    existeProcesoJudicial
}



