const modeloEmpleado = require('../modelos/modeloEmpleado.js');
const logger = require('../utilidades/logger');


/**
 * @abstract Función que permite obtener todos los empleados
 * @returns  empleados
 * */
const obtenerEmpleados = async () => {
    try {
         logger.info("Se obtienen los empleados")
        return await modeloEmpleado.Empleado.findAll({
            raw: false,
            nest: true,
            include: [{
                model: modeloEmpleado.DistritoJudicial
            }

            ]
        });


    } catch (error) {
       // console.log("Error empleados:", error.message);
        logger.error("Error empleados:", error.message);
        return null;
    }
};

/**
 *  @abstract Función que permite obtener un empleado por su id
 * @param {*} id id del empleado
 * @returns empleado
 * */
const obtenerEmpleadoPorId = async (id) => {
    try {
         logger.info("Se obtiene el empleado por su id", id)
        //La busqueda sera por el id empleado y id distrito judicial
        return await modeloEmpleado.Empleado.findByPk(id, {
            raw: false,
            nest: true,

            include: [{
                model: modeloEmpleado.DistritoJudicial
            }
            ]
        });
    } catch (error) {
       //  console.log("Error empleados:", error.message);
        logger.error("Error empleados:", error.message); 
       return null;
    }
};

const obtenerEmpleadoPorPorIdMiddleware = async (id) => {
    try {
         logger.info("Se obtiene el empleado por su id", id)
        return await modeloEmpleado.Empleado.findOne({
            raw: false,
            nest: true,
            where: { id_empleado: id, estatus_general: "ACTIVO" },
        });
    } catch (error) {
      //  console.log("Error empleados:", error.message);
        logger.error("Error empleados:", error.message); 
      return null;
    }
}


/**
 * @abstract Función que permite agregar un empleado
 * @param {*} empleado empleado a agregar
 * @returns empleado si se agrega correctamente, false si no  agrega
 * */
const agregarEmpleado = async (empleado) => {
    try {
       logger.info("Se agrega el empleado", empleado)
        const controlAsesor = require('./controlAsesor.js');
        const controlDefensor = require('./controlDefensor.js');
        const empleado_objeto = JSON.parse(JSON.stringify(empleado));
        logger.info("En caso de ser asesor se agrega el empleado y asesor, caso contrario se agrega el empleado y defensor")
        if (empleado_objeto.tipo_empleado === "asesor") {

                  
            const datos_empleado = {
                id_distrito_judicial: empleado_objeto.id_distrito_judicial,
                tipo_empleado: empleado_objeto.tipo_empleado,
                estatus_general: empleado_objeto.estatus_general
            }
            logger.info("Se agrega el empleado", datos_empleado)
            const empleado_agregado = (await modeloEmpleado.Empleado.create(datos_empleado, { raw: true, nest: true })).dataValues;
            const id_empleado = empleado_agregado.id_empleado;

            const datos_asesor = {
                id_asesor: id_empleado,
                nombre_asesor: empleado_objeto.nombre,
            }
            logger.info("Se agrega el asesor", datos_asesor)    
            await controlAsesor.agregarAsesor(datos_asesor);
            logger.info("Se obtiene el asesor por su id", id_empleado)
            return await controlAsesor.obtenerAsesorPorId(id_empleado);
        }
        if (empleado_objeto.tipo_empleado === "defensor") {

            const datos_empleado = {
                id_distrito_judicial: empleado_objeto.id_distrito_judicial,
                tipo_empleado: empleado_objeto.tipo_empleado,
                estatus_general: empleado_objeto.estatus_general
            }
            logger.info("Se agrega el empleado", datos_empleado)
            const empleado_agregado = (await modeloEmpleado.Empleado.create(datos_empleado, { raw: true, nest: true })).dataValues;

            const id_empleado = empleado_agregado.id_empleado;

            const datos_defensor = {
                id_defensor: id_empleado,
                nombre_defensor: empleado_objeto.nombre,
            }
            logger.info("Se agrega el defensor", datos_defensor)
            await controlDefensor.agregarDefensor(datos_defensor);
            logger.info("Se obtiene el defensor por su id", id_empleado)
            return await controlDefensor.obtenerDefensorPorId(id_empleado);
        }



        //return (await modeloEmpleado.Empleado.create(empleado, { raw: true, nest: true })).dataValues;
    } catch (error) {
      //  console.log("Error empleados:", error.message);
        logger.error("Error empleados:", error.message); 
      return false;
    }
};



/**
 * @abstract Función que permite actualizar un empleado
 * @param {*} id id del empleado a actualizar
 * @param {*} empleado empleado a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 * */
const actualizarEmpleado = async (id, empleado) => {
    try {
        //       realiza algo similar con respect al metodo de agregar pero ahora en actualizar7
        logger.info("Se actualiza el empleado", empleado)
        const controlAsesor = require('./controlAsesor.js');
        const controlDefensor = require('./controlDefensor.js');
        const empleado_objeto = JSON.parse(JSON.stringify(empleado));
        logger.info("En caso de ser asesor se actualiza el empleado y asesor, caso contrario se actualiza el empleado y defensor")
        if (empleado_objeto.tipo_empleado === "asesor") {

            const datos_empleado = {
                id_distrito_judicial: empleado_objeto.id_distrito_judicial,
                tipo_empleado: empleado_objeto.tipo_empleado,
                estatus_general: empleado_objeto.estatus_general,
                id_empleado: id

            }
            logger.info("Se actualiza el empleado", datos_empleado)
            const empleado_actualizado = (await modeloEmpleado.Empleado.update(datos_empleado, { where: { id_empleado: id } }))[0];
            if (empleado_actualizado === 1) {
                const datos_asesor = {
                    id_asesor: id,
                    nombre_asesor: empleado_objeto.nombre,
                }
                logger.info("Se actualiza el asesor", datos_asesor)
                await controlAsesor.actualizarAsesor(datos_asesor);
                return true
            } else {
                const datos_asesor = {
                    id_asesor: id,
                    nombre_asesor: empleado_objeto.nombre,
                }
                logger.info("Se actualiza el asesor", datos_asesor)
                return await controlAsesor.actualizarAsesor(datos_asesor);
            }
        }
        if (empleado_objeto.tipo_empleado === "defensor") {

            const datos_empleado = {
                id_distrito_judicial: empleado_objeto.id_distrito_judicial,
                tipo_empleado: empleado_objeto.tipo_empleado,
                estatus_general: empleado_objeto.estatus_general,
                id_empleado: id
            }
            logger.info("Se actualiza el empleado", datos_empleado)
            const empleado_actualizado = (await modeloEmpleado.Empleado.update(datos_empleado, { where: { id_empleado: id } }))[0];
            if (empleado_actualizado === 1) {

                const datos_defensor = {
                    id_defensor: id,
                    nombre_defensor: empleado_objeto.nombre,
                }
                logger.info("Se actualiza el defensor", datos_defensor)
                await controlDefensor.actualizarDefensor(datos_defensor);
                return true
            } else {
                const datos_defensor = {
                    id_defensor: id,
                    nombre_defensor: empleado_objeto.nombre,
                }
                logger.info("Se actualiza el defensor", datos_defensor)
                return await controlDefensor.actualizarDefensor(datos_defensor);
            }
        }
        return false;
    } catch (error) {
        return false;
    }
};

const obtenerEmpleadosAsesoresPorZona = async (id) => {
    try {
         logger.info("Se obtienen los empleados asesores por zona", id) 
        return await modeloEmpleado.Empleado.findAll({
            raw: false,
            nest: true,

            include: [{
                model: modeloEmpleado.DistritoJudicial,
                where: { id_zona: id }
            }
            ], where: { tipo_empleado: "asesor" }
        });
    } catch (error) {
       // console.log("Error empleados:", error.message);
        logger.error("Error empleados:", error.message);
       return null;
    }
}
const obtenerEmpleadosDefensoresPorZona = async (id) => {
    try {
            logger.info("Se obtienen los empleados defensores por zona", id)
        return await modeloEmpleado.Empleado.findAll({
            raw: false,
            nest: true,

            include: [{
                model: modeloEmpleado.DistritoJudicial,
                where: { id_zona: id }
            }
            ], where: { tipo_empleado: "defensor" }
        });
    } catch (error) {
      //   console.log("Error empleados:", error.message);
        logger.error("Error empleados:", error.message);
       return null;
    }
}

const obtenerEmpleadoIDAndDistrito = async (req) => {
    try {
         logger.info("Se obtiene el empleado por su id y distrito judicial", req)
        const req_objeto = JSON.parse(JSON.stringify(req));
        const objeto_encontrado = await modeloEmpleado.Empleado.findOne({
            raw: false,
            nest: true,
            where: { id_empleado: req_objeto.id_empleado, id_distrito_judicial: req_objeto.id_distrito_judicial }
        });
        const pre_objeto = JSON.parse(JSON.stringify(objeto_encontrado));

        logger.info("Se valida si el empleado es asesor y el usuario es asesor, si el empleado es defensor y el usuario es defensor")
        if (pre_objeto.tipo_empleado === "asesor" && req_objeto.id_tipouser === "2") {
            logger.info("Se retorna el empleado", pre_objeto)
            return pre_objeto;
        }
        if (pre_objeto.tipo_empleado === "defensor" && req_objeto.id_tipouser === "3") {
            logger.info("Se retorna el empleado", pre_objeto)
            return pre_objeto;
        }
        logger.info("No se encontro el empleado")
        return null;
    } catch (error) {
        logger.error("Error empleados:", error.message);
        //console.log("Error empleados:", error.message);
        return null;
    }
}

const obtenerEmpleadosBusqueda = async (id_distrito_judicial, pagina, total) => {
    try {
        logger.info("Se obtienen los empleados por distrito judicial", id_distrito_judicial)
        logger.info("Se valida si se obtiene el total de empleados o los empleados por paginacion", total)
        if (total === true) {
            logger.info("Se obtiene el total de empleados por distrito judicial", id_distrito_judicial)
            return await modeloEmpleado.Empleado.count({
                where: { id_distrito_judicial: id_distrito_judicial }
            });
        } else {
            logger.info("Se obtienen los empleados por distrito judicial y paginacion", id_distrito_judicial, pagina)
            pagina = parseInt(pagina, 10);
            const limite = 10;
            const offset = (pagina - 1) * 10;
            const empleados_pre = await modeloEmpleado.Empleado.findAll({
                raw: false,
                nest: true,
                include: [{
                    model: modeloEmpleado.DistritoJudicial
                }

                ], where: { id_distrito_judicial: id_distrito_judicial }
                , limit: limite,
                offset: offset
            });
            //obtenerDefensorPorId
            //obtenerAsesorPorId
            //recorre ciclo for y dependiendo del tipo de empleado se obtiene el empleado
            const empleados = [];
            const controlAsesor = require('./controlAsesor.js');
            const controlDefensor = require('./controlDefensor.js');
            logger.info("Se recorre el ciclo for para obtener los empleados, validando si es asesor o defensor")
            for (let i = 0; i < empleados_pre.length; i++) {
                const empleado = JSON.parse(JSON.stringify(empleados_pre[i]));
                if (empleado.tipo_empleado === "asesor") {
                    const asesor = await controlAsesor.obtenerAsesorPorId(empleado.id_empleado);
                    empleados.push(asesor);
                }
                if (empleado.tipo_empleado === "defensor") {
                    const defensor = await controlDefensor.obtenerDefensorPorId(empleado.id_empleado);
                    empleados.push(defensor);
                }
            }
            logger.info("Se retornan los empleados", empleados)
            return empleados;

        }

    } catch (error) {
     //   console.log("Error empleados:", error.message);
        logger.error("Error empleados:", error.message);  
     return null;
    }
}



module.exports = {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    agregarEmpleado,
    actualizarEmpleado,
    obtenerEmpleadosAsesoresPorZona, obtenerEmpleadosDefensoresPorZona,
    obtenerEmpleadoPorPorIdMiddleware, obtenerEmpleadoIDAndDistrito, obtenerEmpleadosBusqueda

};