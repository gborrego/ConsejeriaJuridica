
const controlDistritoJudicial = require('../controles/controlDistritosJudiciales')
const controlEmpleado = require('../controles/controlEmpleados')
const logger = require('../utilidades/logger');

async function existeDistritoJudicial(req, res, next) {
    logger.info("Middleware para validar la existencia de un distrito judicial")
    const distritoJudicial = await controlDistritoJudicial.obtenerDistritoJudicial(Number(req.body.id_distrito_judicial))

    if (!distritoJudicial) {
        return res.status(400).json({
            message: 'El distrito judicial proporcionado no existe.'
        })
    }
    logger.info("Fin del middleware para validar la existencia de un distrito judicial")

    next()
}
const controlDistrito = require('../controles/controlDistritosJudiciales.js');

async function existeEmpleado(req, res, next) {
    logger.info("Middleware para validar la existencia de un empleado")
    const empleado = await controlEmpleado.obtenerEmpleadoPorId(Number(req.params.id))

    if (!empleado) {
        return res.status(404).json({
            message: 'El empleado proporcionado no existe.'
        })
    }
    logger.info("Fin del middleware para validar la existencia de un empleado") 
    next()
}


async function validarJSONEmpleadoPOST(req, res, next) {

    logger.info("Middleware para validar el JSON del empleado en el POST")
    const { nombre, tipo_empleado, estatus_general, id_distrito_judicial, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!nombre || !tipo_empleado || !estatus_general || !id_distrito_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el nombre, el tipo de empleado, el estatus general o el id del distrito judicial esta vacio.'
        })
    }

    if (nombre.length > 100) {
        return res.status(400).json({
            message: 'El campo "nombre" excede el tamaño permitido.'
        });
    }

    if (tipo_empleado !== 'asesor' && tipo_empleado !== 'defensor') {
        return res.status(400).json({
            message: 'El campo "tipo_empleado" solo acepta los valores "asesor" o "defensor".'
        });
    }

    if (estatus_general !== 'ACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO".'
        });
    }

    if (isNaN(id_distrito_judicial)) {
        return res.status(400).json({
            message: 'El campo "id_distrito_judicial" debe ser de tipo numérico.'
        });
    }

    //Valida que el id de distrito judicial exista
    try {
        const distrito = await controlDistrito.obtenerDistritoPorPorIdMiddleware(id_distrito_judicial);
        if (!distrito) {
            return res.status(400).json({ message: "El id de distrito judicial no existe" });
        }
    } catch (error) {
        return res.status(400).json({ message: "El id de distrito judicial no existe" });
    }

    logger.info("Fin del middleware para validar el JSON del empleado en el POST")

    next()
}




async function validarJSONEmpleadoPUT(req, res, next) {
    logger.info("Middleware para validar el JSON del empleado en el PUT")
    const { id_empleado, nombre, tipo_empleado, estatus_general, id_distrito_judicial, ...extraData } = req.body

    // Verifica si hay datos adicionales en el cuerpo de la petición
    if (Object.keys(extraData).length !== 0) {
        return res.status(400).json({
            message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
        });
    }

    if (!id_empleado || !nombre || !tipo_empleado || !estatus_general || !id_distrito_judicial) {
        return res.status(400).json({
            message: 'Faltan datos en el cuerpo de la petición, o el id del empleado, el nombre, el tipo de empleado, el estatus general o el id del distrito judicial esta vacio.'
        })
    }


    if (isNaN(id_empleado)) {
        return res.status(400).json({
            message: 'El campo "id_empleado" debe ser de tipo numérico.'
        });
    }

    if (nombre.length > 100) {
        return res.status(400).json({
            message: 'El campo "nombre" excede el tamaño permitido.'
        });
    }

    if (tipo_empleado !== 'asesor' && tipo_empleado !== 'defensor') {
        return res.status(400).json({
            message: 'El campo "tipo_empleado" solo acepta los valores "asesor" o "defensor".'
        });
    }

    if (estatus_general !== 'ACTIVO' && estatus_general !== 'INACTIVO') {
        return res.status(400).json({
            message: 'El campo "estatus_general" solo acepta los valores "ACTIVO" o "INACTIVO".'
        });
    }

    if (isNaN(id_distrito_judicial)) {
        return res.status(400).json({
            message: 'El campo "id_distrito_judicial" debe ser de tipo numérico.'
        });
    }

    if (id_empleado !== Number(req.params.id)) {
        return res.status(400).json({
            message: 'El id del empleado proporcionado no coincide con el id de la URL.'
        })
    }

    const empleado = await controlEmpleado.obtenerEmpleadoPorId(Number(req.params.id))


    if (empleado.id_distrito_judicial !== id_distrito_judicial) {
        return res.status(400).json({
            message: 'El id del distrito judicial proporcionado no coincide con el id del distrito judicial del empleado, no se puede cambiar el distrito judicial del empleado.'
        })
    }

    if (empleado.tipo_empleado !== tipo_empleado) {
        return res.status(400).json({
            message: 'El tipo de empleado proporcionado no coincide con el tipo de empleado del empleado, no se puede cambiar el tipo de empleado del empleado.'
        })
    }

     logger.info("Fin del middleware para validar el JSON del empleado en el PUT")
    next()
}


module.exports = {
    validarJSONEmpleadoPOST,
    validarJSONEmpleadoPUT,

    existeDistritoJudicial,
    existeEmpleado
}