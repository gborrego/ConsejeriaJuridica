const controlEmpleado = require('../controles/controlEmpleados');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");
const logger = require('../utilidades/logger');

/**
 * @abstract Servicio  que permite agregar un empleado
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * */
const agregarEmpleado = asyncError(async (req, res, next) => {
    logger.info("Petición para agregar un empleado", req.body)

    logger.info("Se llama al control de empleados, y asi el de agregar empleado")
    const result = await controlEmpleado.agregarEmpleado(req.body);


    logger.info("Se valida el resultado de agregar al empleado")
    if (result === false) {
        logger.error("Error al agregar un empleado")
        const error = new CustomeError('Error al agregar un empleado', 400);
        return next(error);
    } else {
        logger.info("Empleado agregado correctamente")

        res.status(201).json({
            empleado: "Empleado agregado correctamente"
        });
    }
}
);



/**
 * @abstract Servicio  que permite actualizar un empleado
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * */
const actualizarEmpleado = asyncError(async (req, res, next) => {
    logger.info("Petición para actualizar un empleado", req.body)


    logger.info("Se llama al control de empleados, y asi el de actualizar empleado")
      const result = await controlEmpleado.actualizarEmpleado(req.params.id, req.body);

    logger.info("Se valida el resultado de actualizar al empleado")
    if (result === false) {
        logger.error("Error al actualizar un empleado")
        const error = new CustomeError('Error al actualizar el empleado, o datos iguales', 400);
        return next(error);
    } else {
        logger.info("Empleado actualizado correctamente")
        res.status(200).json({
            empleado: "Empleado actualizado correctamente"
        });
    }
}
);
/*
const obtenerEmpleados = asyncError(async (req, res, next) => {
    const result = await controlEmpleado.obtenerEmpleados();
    if ( result === false) {
        const error = new CustomeError('Error al obtener los empleados', 400);
        return next(error);
    } else {
    
        res.status(200).json({
            empleados: result
        });
    }
}
);

const obtenerEmpleadoPorId = asyncError(async (req, res, next) => {
    const result = await controlEmpleado.obtenerEmpleadoPorId(req.params.id);
    if ( result === false) {
        const error = new CustomeError('Error al obtener el empleado', 400);
        return next(error);
    } else {
    
        res.status(200).json({
            empleado: result
        });
    }
}
);
*/
 
const obtenerEmpleadosBusqueda = asyncError(async (req, res, next) => {
    
    logger.info("Petición para obtener los empleados por busqueda")


    logger.info("Se obtienen los parametros de la busqueda", req.query)
    const id_distrito_judicial = req.query.id_distrito_judicial;
    const pagina = req.query.pagina;
    const total = req.query.total;

    logger.info("Se valida si se requiere el total de empleados, o los empleados paginados")
    if (total === 'true') {

        logger.info("Se llama al control de empleados, y asi el de obtener empleados por busqueda, para obtener el total de empleados")
        const result = await controlEmpleado.obtenerEmpleadosBusqueda(id_distrito_judicial, null, true);

        logger.info("Se valida el resultado de la consulta de empleados")
        if (result === false) {
            logger.error("Error al obtener los empleados")
            const error = new CustomeError('Error al obtener los empleados', 400);
            return next(error);
        } else {
            logger.info("Se retornan el total de empleados")
            res.status(200).json({
                totalEmpleados: result
            });
        }
    } else {

        logger.info("Se llama al control de empleados, y asi el de obtener empleados por busqueda, para obtener los empleados paginados")
        const result = await controlEmpleado.obtenerEmpleadosBusqueda(id_distrito_judicial, pagina, false);

        logger.info("Se valida el resultado de la consulta de empleados")
        if (result === false) {
            logger.error("Error al obtener los empleados")
            const error = new CustomeError('Error al obtener los empleados', 400);
            return next(error);
        } else {

            logger.info("Se retornan los empleados")
            res.status(200).json({
                empleados: result
            });
        }
    }
}
);

//Module exports
module.exports = {
    agregarEmpleado,
    actualizarEmpleado,
    obtenerEmpleadosBusqueda
    //obtenerEmpleados,
    //obtenerEmpleadoPorId
}