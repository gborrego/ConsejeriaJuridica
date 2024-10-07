const modeloAsesor = require('../modelos/modeloAsesor');
const controlEmpleado = require('./controlEmpleados.js');
const logger = require('../utilidades/logger');

/** 
 * @abstract Función que permite obtener todos los asesores
 * @returns  asesores
 * */
const obtenerAsesores = async (id_distrito_judicial,pagina) => {
  try {
/*
    const whereClause = {};
    whereClause['$empleado.id_distrito_judicial$'] = id_distrito_judicial;
    return await modeloAsesor.Asesor.findAll({
      raw: false,
      nest: true,
      include: [{
        model: modeloAsesor.Empleado
      }
      ]
      ,
      where: whereClause
    });
    */
   logger.info("Se crean la pagina, offset y limit")

    pagina = parseInt(pagina,10);
    const offset = (pagina - 1) * 5;
    const limit = 5;

    logger.info("Se obtienen los asesores, en base a la pagina, offset y limit")
    const result= await modeloAsesor.Asesor.findAll({  
      raw: false,
      nest: true,
      include: [{
          model: modeloAsesor.Empleado,
          where: { id_distrito_judicial: id_distrito_judicial }
      }
      ]
       ,limit: limit,
      offset: offset
  });
  logger.info("Se retornan los asesores")
  return result;
  } catch (error) {
    logger.error("Error de asesores:", error.message);
    //console.log("Error de asesores:", error.message);
    return null;
  }
};


/**
 * @abstract Función que permite obtener un asesor por su id
 * @param {*} id id del asesor
 *  @returns asesor
 * */

const obtenerAsesorPorId = async (id) => {
  try {
    logger.info("Se obtiene el asesor por su id", id)
    const result =await modeloAsesor.Asesor.findByPk(id, {
      raw: false,
      nest: true,
      include: [{
        model: modeloAsesor.Empleado
      }
      ]
    });
    logger.info("Se retorna el asesor")
    return result;
  } catch (error) {
   // console.log("Error de asesores:", error.message);
    logger.error("Error de asesores:", error.message);
   return null;
  }
};

/** 
 * @abstract Función que permite agregar un asesor
 *  @param {*} asesor  asesor a agregar
 *  @returns asesor si se agrega correctamente, false si no  agrega     
 * */
const agregarAsesor = async (asesor) => {
  try {
    logger.info("Se agrega el asesor", asesor)
    const result =(await modeloAsesor.Asesor.create(asesor, { raw: true, nest: true })).dataValues;
    logger.info("Se retorna el asesor")
    return result;
  } catch (error) {
    logger.error("Error de asesores:", error.message);
    //console.log("Error de asesores:", error.message);
    return false;
  }
};


/**
 * @abstract Función que permite actualizar un asesor
 * @param {*} asesor asesor a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 * */
const actualizarAsesor = async (asesor) => {
  try {
    logger.info("Se actualiza el asesor", asesor)
    const result = await modeloAsesor.Asesor.update(asesor, { where: { id_asesor: asesor.id_asesor } });
    logger.info("Se retorna el resultado de la actualización")
     return result[0] === 1;
  } catch (error) {
    logger.error("Error de asesores:", error.message);
  //  console.log("Error de asesores:", error.message);
    return false;
  }
};

const obtenerAsesoresZona = async (id) => {
  try {
    logger.info("Se obtienen los asesores por zona", id)
    logger.info("Se obtienen los empleados tipo asesor por zona")
    const asesores = await controlEmpleado.obtenerEmpleadosAsesoresPorZona(id);
    logger.info("Se verifica si los asesores son nulos")
    if (asesores) {
      logger.info("Se crean los asesores filtrados")
      const asesoresFiltrados = [];
      for (let i = 0; i < asesores.length; i++) {
        const asesor = await obtenerAsesorPorId(asesores[i].id_empleado);
        asesoresFiltrados.push(asesor);
      }
      logger.info("Se retornan los asesores filtrados")
      return asesoresFiltrados;
    }
    logger.info("No se encontraron asesores")
    return null;
  } catch (error) {
    logger.error("Error de asesores:", error.message);
   // console.log("Error de asesores:", error.message);
    return null;
  }
}
const obtenerAsesoresByDistrito = async (id_distrito_judicial) => {
  try {
    logger.info("Se obtienen los asesores por distrito judicial", id_distrito_judicial)

    logger.info("Se crean la clausula where")
    const whereClause = {};

    logger.info("Se agregan los campos a la clausula where")
    whereClause['$empleado.estatus_general$'] = "ACTIVO";
    whereClause['$empleado.id_distrito_judicial$'] = id_distrito_judicial;
    
    logger.info("Se obtienen los asesores por distrito judicial")
     const result = await modeloAsesor.Asesor.findAll({
      raw: false,
      nest: true,
      include: [{
        model: modeloAsesor.Empleado
      }
      ]
      ,
      where: whereClause
    });
    logger.info("Se retornan los asesores")
    return result;

  } catch (error) {
    //console.log("Error de asesores:", error.message);
    logger.error("Error de asesores:", error.message);
    return null;
  }
};

//  Exportar los módulos    
module.exports = {
  obtenerAsesores,
  obtenerAsesorPorId,
  agregarAsesor,
  actualizarAsesor, obtenerAsesoresZona,
  obtenerAsesoresByDistrito
};
