

const controlFamiliar = require('../data-access/familiarDAO')
const controlPromovente = require('../data-access/promoventeDAO')
const logger = require('../utilidades/logger');


async function existePromovente(req, res, next) {
    logger.info("Middleware para validar la existencia de un promovente")
    try {
        const { id_promovente } = req.query
        const promovente = await controlPromovente.obtenerPromoventeMiddlware(Number(id_promovente))
        if (!promovente) {
            return res.status(404).json({
                message: 'No existe un promovente con el id proporcionado, asi que no se puede continuar con la petición.'
            })
        }
    } catch (error) {
        logger.error("No existe un promovente con el id proporcionado, asi que no se puede continuar con la petición.", { error: error.message })
        return res.status(500).json({
            message: ' No existe un promovente con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    logger.info("Fin del middleware para validar la existencia de un promovente")
    next()
}


async function existeFamiliar(req, res, next) {
    logger.info("Middleware para validar la existencia de un familiar")
    try {
        const { id } = req.params
        const familiar = await controlFamiliar.obtenerFamiliar(Number(id))
        if (!familiar) {
            return res.status(404).json({
                message: 'No existe un familiar con el id proporcionado, asi que no se puede continuar con la petición.'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de un familiar", { error: error.message })
        return res.status(500).json({
            message: 'No existe un familiar con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    logger.info("Fin del middleware para validar la existencia de un familiar")
    next()
}



async function validarJSONFamiliarPOST(req, res, next) {
    logger.info("Middleware para validar el JSON del familiar en el POST")
    const { nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente, ...extraData } = req.body
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }
    if (!nombre || !nacionalidad || !parentesco || perteneceComunidadLGBT === undefined || adultaMayor === undefined || saludPrecaria === undefined || pobrezaExtrema === undefined || !id_promovente) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el nombre del familiar o la nacionalidad o el parentesco o si pertenece a la comunidad LGBT o si es adulto mayor o si tiene salud precaria o si se encuentra en pobreza extrema o el id del promovente esta vacio.'
        })
    }

    if (isNaN(id_promovente)) {
        return res.status(400).json({
            message: 'El id del promovente no es un número.'
        })
    }
    try {
        const promovente = await controlPromovente.obtenerPromoventeMiddlware(Number(id_promovente))
        if (!promovente) {
            return res.status(404).json({
                message: 'No existe un promovente con el id proporcionado, asi que no se puede continuar con la petición.'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de un promovente: " + error)
        return res.status(500).json({
            message: 'No existe un promovente con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    if (nombre.length > 100) {
        return res.status(400).json({
            message: 'El campo "nombre" excede el tamaño permitido.'
        });
    }

    if (nacionalidad.length > 100) {
        return res.status(400).json({
            message: 'El campo "nacionalidad" excede el tamaño permitido.'
        });
    }

    if (parentesco.length > 100) {
        return res.status(400).json({
            message: 'El campo "parentesco" excede el tamaño permitido.'
        });
    }

    if (perteneceComunidadLGBT !== Boolean(perteneceComunidadLGBT)) {
        return res.status(400).json({
            message: 'El campo "perteneceComunidadLGBT" no es un booleano.'
        })
    }

    if (adultaMayor !== Boolean(adultaMayor)) {
        return res.status(400).json({
            message: 'El campo "adultaMayor" no es un booleano.'
        })
    }

    if (saludPrecaria !== Boolean(saludPrecaria)) {
        return res.status(400).json({
            message: 'El campo "saludPrecaria" no es un booleano.'
        })
    }


    if (pobrezaExtrema !== Boolean(pobrezaExtrema)) {
        return res.status(400).json({
            message: 'El campo "pobrezaExtrema" no es un booleano.'
        })
    }
    logger.info("Fin del middleware para validar el JSON del familiar en el POST")


    next()
}




async function validarJSONFamiliarPUT(req, res, next) {
    logger.info("Middleware para validar el JSON del familiar en el PUT")
    const { id_familiar, nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente, ...extraData } = req.body

    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }
    //Esta peticion de abajo por ejemplo si adulto mayor es booleando pos entrara dentro del if verda y solo lo que quiero verificar es que esita
    if (!id_familiar || !nombre || !nacionalidad || !parentesco || perteneceComunidadLGBT === undefined || adultaMayor === undefined || saludPrecaria === undefined || pobrezaExtrema === undefined || !id_promovente) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el id del familiar o el nombre del familiar o la nacionalidad o el parentesco o si pertenece a la comunidad LGBT o si es adulto mayor o si tiene salud precaria o si se encuentra en pobreza extrema o el id del promovente esta vacio.'
        })
    }

    if (isNaN(id_familiar)) {
        return res.status(400).json({
            message: 'El campo "id_familiar" no acepta valores numericos.'
        });
    }

    if (isNaN(id_promovente)) {
        return res.status(400).json({
            message: 'El id del promovente no es un número.'
        })
    }

    if (nombre.length > 100) {
        return res.status(400).json({
            message: 'El campo "nombre" excede el tamaño permitido.'
        });
    }


    if (nacionalidad.length > 100) {
        return res.status(400).json({
            message: 'El campo "nacionalidad" excede el tamaño permitido.'
        });
    }


    if (parentesco.length > 100) {
        return res.status(400).json({
            message: 'El campo "parentesco" excede el tamaño permitido.'
        });
    }


    if (perteneceComunidadLGBT !== Boolean(perteneceComunidadLGBT)) {
        return res.status(400).json({
            message: 'El campo "perteneceComunidadLGBT" no es un booleano.'
        })
    }

    if (adultaMayor !== Boolean(adultaMayor)) {
        return res.status(400).json({
            message: 'El campo "adultaMayor" no es un booleano.'
        })
    }

    if (saludPrecaria !== Boolean(saludPrecaria)) {
        return res.status(400).json({
            message: 'El campo "saludPrecaria" no es un booleano.'
        })
    }


    if (pobrezaExtrema !== Boolean(pobrezaExtrema)) {
        return res.status(400).json({
            message: 'El campo "pobrezaExtrema" no es un booleano.'
        })
    }


    if (id_familiar !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id del familiar proporcionado no coincide con el id del familiar que se quiere modificar.'
        })
    }


    try {
        const familiarObtenido = await controlFamiliar.obtenerFamiliar(Number(id_familiar))
        //Evalua que el id del promovente sea el mismo que el del familiar encontrado
        if (familiarObtenido.id_promovente !== id_promovente) {
            return res.status(400).json({
                message: 'El id del promovente proporcionado no coincide con el id del promovente del familiar que se quiere modificar, no es posible cambiar el promovente del familiar.'
            })
        }
    } catch (error) {
        logger.error("Error en el middleware para validar la existencia de un familiar: " + error)
        return res.status(500).json({
            message: 'No existe un familiar con el id proporcionado, asi que no se puede continuar con la petición.'
        })
    }
    logger.info("Fin del middleware para validar el JSON del familiar en el PUT")

    next()
}



module.exports = {
    existeFamiliar,
    validarJSONFamiliarPOST,
    validarJSONFamiliarPUT,
    existePromovente
}