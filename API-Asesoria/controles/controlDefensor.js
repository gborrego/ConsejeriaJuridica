const modeloDefensor = require('../modelos/modeloDefensor.js');
const controlEmpleado = require('./controlEmpleados.js');
//Falta relacion de defensor y asesoria y actualizar controles
const logger = require('../utilidades/logger');

/**	
 * @abstract Función que permite obtener todos los defensores
 * @returns  defensores
 * */

const obtenerDefensores = async (id_distrito_judicial, pagina) => {
    try {
        /*
        pagina = parseInt(pagina,10);
        const offset = (pagina - 1) * 10;   
        const limit = 10;   
        const whereClause = {};
        whereClause['$empleado.id_distrito_judicial$'] = id_distrito_judicial;
        return await modeloDefensor.Defensor.findAll({
            raw: false,
            nest: true,
            include: [{
                model: modeloDefensor.Empleado
            }
            ],
            where: whereClause,
            limit: limit,
            offset: offset
        });
        Perdon no es un limite de 10 es de 5
        */
    logger.info("Se obtienen los defensores por distrito judicial", id_distrito_judicial)

    logger.info("Se establece la pagina, offset y limit", pagina)

        pagina = parseInt(pagina, 10);
        const offset = (pagina - 1) * 5;
        const limit = 5;
 
        logger.info("Se obtienen los defensores por distrito judicial y paginacion")
        return await modeloDefensor.Defensor.findAll({
            raw: false,
            nest: true,
            include: [{
                model: modeloDefensor.Empleado,
                where: { id_distrito_judicial: id_distrito_judicial }
            }
            ]
            , limit: limit,
            offset: offset
        });
  

    } catch (error) {
      //     console.log("Error defensor:", error.message);
           logger.error("Error defensor:", error.message);  
      return null;
    }
};

const obtenerDefensoresByDistrito = async (id_distrito_judicial, activo) => {
    try {
        logger.info("Se obtienen los defensores por distrito judicial", id_distrito_judicial)
        
        
      logger.info("Se valida si se obtienen los defensores activos o no activos", activo)
        if (activo === 'true' || activo === true) {
            logger.info("Se obtienen los defensores activos por distrito judicial", id_distrito_judicial)
            const whereClause = {};
            whereClause['$empleado.estatus_general$'] = "ACTIVO";
            whereClause['$empleado.id_distrito_judicial$'] = id_distrito_judicial;
            return await modeloDefensor.Defensor.findAll({
                raw: false,
                nest: true,
                include: [{
                    model: modeloDefensor.Empleado
                }
                ],
                where: whereClause
            });
        }else {
            const whereClause = {};
            logger.info("Se obtienen los defensores no activos por distrito judicial", id_distrito_judicial)
            whereClause['$empleado.id_distrito_judicial$'] = id_distrito_judicial;
            return await modeloDefensor.Defensor.findAll({
                raw: false,
                nest: true,
                include: [{
                    model: modeloDefensor.Empleado
                }
                ],
                where: whereClause
            });
        }

    } catch (error) {
     //     console.log("Error defensor:", error.message);
       logger.error("Error defensor:", error.message); 
      return null;
    }
};

/**
 * @abstract Función que permite obtener un defensor por su id
 * @param {*} id id del defensor
 * @returns defensor
 * */
const obtenerDefensorPorId = async (id) => {
    try {
         logger.info("Se obtiene el defensor por su id", id)
        return await modeloDefensor.Defensor.findByPk(id, {
            raw: false,
            nest: true,
            include: [{
                model: modeloDefensor.Empleado
            }
            ]
        });
    } catch (error) {
        //console.log("Error defensor:", error.message);
        logger.error("Error defensor:", error.message);
        return null;
    }
};

/**
 * @abstract Función que permite agregar un defensor
 * @param {*} defensor defensor a agregar
 * @returns defensor si se agrega correctamente, false si no  agrega
 * */
const agregarDefensor = async (defensor) => {
    try {
        logger.info("Se agrega el defensor", defensor)
        return (await modeloDefensor.Defensor.create(defensor, { raw: true, nest: true })).dataValues;
    } catch (error) {
      //  console.log("Error defensor:", error.message);
       logger.error("Error defensor:", error.message);
       return false;
    }
};


/**
 * @abstract Función que permite actualizar un defensor
 * @param {*} id id del defensor a actualizar
 * @param {*} defensor defensor a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 * */
const actualizarDefensor = async (id, defensor) => {
    try {
        logger.info("Se actualiza el defensor", defensor)
        const result = await modeloDefensor.Defensor.update(defensor, { where: { id_defensor: id } });
        logger.info("Se retorna el resultado de la actualizacion", result[0] === 1)	
        return result[0] === 1;
    } catch (error) {
       // console.log("Error defensor:", error.message);
         logger.error("Error defensor:", error.message); 
       return false;
    }
};

const obtenerDefensoresZona = async (id) => {
    try {
        logger.info("Se obtienen los defensores por zona", id)
        const defensores = await controlEmpleado.obtenerEmpleadosDefensoresPorZona(id);
        logger.info("Se valida si existen defensores", defensores)
        if (defensores) {
             logger.info("Se obtienen los defensores por id", defensores)
            const defensoresReturn = [];
            for (let i = 0; i < defensores.length; i++) {
                defensores[i] = defensores[i];
                const defensor = await obtenerDefensorPorId(defensores[i].id_empleado);
                defensoresReturn.push(defensor);
            }
            logger.info("Se retorna los defensores", defensoresReturn)
            return defensoresReturn;
        }
        logger.info("No existen defensores")
        return null;
    } catch (error) {
      //  console.log("Error defensor:", error.message);
        logger.error("Error defensor:", error.message); 
      return null;
    }
};
const obtenerDefensorIDSimpleMiddleware = async (id) => {
    try {
         logger.info("Se obtiene el defensor por su id", id)
        const defensor = await modeloDefensor.Defensor.findByPk(id);
        logger.info("Se retorna el defensor", defensor)
        return defensor;
    } catch (error) {
       logger.error("Error defensor:", error.message); 
       // console.log("Error defensor:", error.message);
        return null;
    }
}

/**
 * @abstract Función que permite obtener un defensor por su id
 * @param {*} id id del defensor
 * @returns defensor
 * */
const obtenerDefensorPorIdActivo = async (id) => {
    try {
        logger.info("Se obtiene el defensor por su id", id)
        return await modeloDefensor.Defensor.findByPk(id, {
            raw: false,
            nest: true,
            include: [{
                model: modeloDefensor.Empleado
            }
            ]
        });
    } catch (error) {
       // console.log("Error defensor:", error.message);
        logger.error("Error defensor:", error.message); 
       return null;
    }
};

// Exportar los módulos
module.exports = {
    obtenerDefensores,
    obtenerDefensorPorId,
    agregarDefensor,
    actualizarDefensor,
    obtenerDefensoresZona,
    obtenerDefensorIDSimpleMiddleware,
    obtenerDefensoresByDistrito
};
