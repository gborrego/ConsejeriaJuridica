const { where } = require('sequelize');
const modeloTurno = require('../modelos/modeloTurno');

//Falta relacion de defensor y asesoria y actualizar controles
const logger = require('../utilidades/logger');

/**
 * @abstract Función que permite obtener todos los turnos
 * @returns turnos
 */
const obtenerTurnos = async (id_defensor, id_distrito_judicial, total, pagina) => {
  try { 
    logger.info("Se obtienen los turnos, con respecto a su id_defensor y id_distrito_judicial", id_defensor, id_distrito_judicial)

    logger.info("Se establece el limite y el offset para la paginación", pagina)
    const limite = 10;
    const offset = (parseInt(pagina, 10) - 1) * limite;

    logger.info("Se crea la clausula where para la consulta")
    const whereClause = { estatus_general: "NO_SEGUIMIENTO" };

    logger.info("Se valida si existen los parametros id_defensor y id_distrito_judicial, para agregarlos a la clausula where")
    if (id_defensor) whereClause.id_defensor = id_defensor;
    if (id_distrito_judicial) whereClause['$defensor.empleado.id_distrito_judicial$'] = id_distrito_judicial;

    logger.info("Se valida si se obtiene el total de los turnos o los turnos paginados")
    if (total) {
      logger.info("Se obtiene el total de los turnos")
      return await modeloTurno.Turno.count({
        raw: false,
        nest: true,
        where: whereClause,
        include: [
          {
            model: modeloTurno.Asesoria,
          }, 
          {
            model: modeloTurno.Defensor,
            include: [
              {
                model: modeloTurno.Empleado,
              },
            ],
          },

        ] });
    } else {
      logger.info("Se obtienen los turnos paginados")
      const turnos_pre = await modeloTurno.Turno.findAll({
        raw: false,
        nest: true,
        where: whereClause,
        include: [
          {
            model: modeloTurno.Asesoria,
          }, 
          {
            model: modeloTurno.Defensor,
            include: [
              {
                model: modeloTurno.Empleado,
              },
            ],
          },

        ]
       // ,limit: limite,
      //  offset: offset
      });
    
     const controlAsesoria = require('./controlAsesoria');
     logger.info("Se crea un arreglo de turnos")

      const turnos = [];

       logger.info("Se retornar los turnos con sus respecto a la paginación , de manera manual")
      const pageSize = 10;
      const pageNumber = parseInt(pagina, 10);
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;

       const turnosOnPage = turnos_pre.slice(startIndex, endIndex); 

        logger.info("Se obtiene la asesoria de cada turno")
      for (let i = 0; i < turnosOnPage.length; i++) {
        const turno = JSON.parse(JSON.stringify(turnosOnPage[i]));
        const asesoria = await controlAsesoria.obtenerAsesoriaPorId(turno.id_asesoria);
        delete asesoria.turno;
        delete turno.id_asesoria;
        delete turno.id_defensor;
        turno.asesoria = asesoria;
        turnos.push(turno);
      }

      logger.info("Se retornan los turnos en caso de que existan")
       if (turnos.length > 0) {
        logger.info("Se retornan los turnos")
        return turnos;
      } else {
        logger.info("No se encontraron turnos")
        return null;
      }
    }
  } catch (error) {
    //console.error("Error turno:", error.message);
    logger.error("Error turno:", error.message);
    throw error;
  }
};

/**
 * @abstract Función que permite obtener un turno por su id
 * @param {*} id id del turno
 * @returns turno
 */
const obtenerTurnoPorId = async (id) => {
  try {
    const controlAsesoria = require('./controlAsesoria');

     
    logger.info("Se obtiene el turno por su id", id)
    const turno_pre = await modeloTurno.Turno.findByPk(id, {
      raw: false,
      nest: true,
      include: [
        {
          model: modeloTurno.Asesoria,
        }, 
        {
          model: modeloTurno.Defensor,
          include: [
            {
              model: modeloTurno.Empleado,
            },
          ],
        },

      ] 
    });
    logger.info("Se obtiene la asesoria del turno") 
    const turno = JSON.parse(JSON.stringify(turno_pre));
    const asesoria = await controlAsesoria.obtenerAsesoriaPorId(turno.id_asesoria);
    delete asesoria.turno;
    delete turno.id_asesoria;
    delete turno.id_defensor;
    turno.asesoria = asesoria;
    logger.info("Se retorna el turno")
    return turno;
  } catch (error) {
    //console.error("Error turno:", error.message);
    //console.log("Error turno:", error.message);
     logger.error("Error turno:", error.message); 
    return null;
  }
};
const obtenerTurnoPorDefensorId = async (id) => {
  try {
    const controlAsesoria = require('./controlAsesoria');

    logger.info("Se obtiene el turno por su id_defensor", id)
    const turno_pre = await modeloTurno.Turno.findAll({
      raw: false,
      nest: true,
      include: [
        {
          model: modeloTurno.Asesoria,
        }, 
        {
          model: modeloTurno.Defensor,
          include: [
            {
              model: modeloTurno.Empleado,
            },
          ],
        },

      ] ,
      where: { id_defensor: id, estatus_general: "NO_SEGUIMIENTO" },
    });

    
    logger.info("Se crea un arreglo de turnos y se obtiene la asesoria de cada turno")
    const turnos = [];

    for (let i = 0; i < turno_pre.length; i++) {
      const turno = JSON.parse(JSON.stringify(turno_pre[i]));
      const asesoria = await controlAsesoria.obtenerAsesoriaPorId(turno.id_asesoria);
      delete asesoria.turno;
      delete turno.id_asesoria;
      delete turno.id_defensor;
      turno.asesoria = asesoria;
      turnos.push(turno);
    }

    logger.info("Se retornan los turnos en caso de que existan")
    return turnos;
  } catch (error) {
    //console.error("Error turno:", error.message);
   // console.log("Error turno:", error.message);
    logger.error("Error turno:", error.message);   
   return null;
  }

}

/**
 * @abstract Función que permite agregar un turno
 * @param {*} turno turno a agregar
 * @returns turno si se agrega correctamente, false si no  agregar
 * */
const agregarTurno = async (turno) => {
  try {
    logger.info("Se agrega el turno", turno)
    return (await modeloTurno.Turno.create(turno, { raw: true, nest: true })).dataValues;
  } catch (error) {
   // console.log("Error turno:", error.message);
    logger.error("Error turno:", error.message); 
   return false;
  }
};



/**
 * @abstract Función que permite actualizar un turno
 * @param {*} turno turno a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarTurno = async (turno) => {
  try {
    logger.info("Se actualiza el turno", turno)
    const result = await modeloTurno.Turno.update(turno, { where: { id_turno: turno.id_turno } });
    logger.info("Se retorna el turno actualizado", result[0] === 1)
    return result[0] === 1;
  } catch (error) {
    //console.log("Error turno:", error.message);
     logger.error("Error turno:", error.message);
    return false;
  }
};


const onbtenerTurnoIDSimple = async (id) => {
  try {
    logger.info("Se obtiene el turno por su id", id)
    const turno = await modeloTurno.Turno.findByPk(id, {
      raw: true,
    });
    logger.info("Se retorna el turno", turno)
    return turno;
  } catch (error) {
  //  console.log("Error turno:", error.message);
    logger.error("Error turno:", error.message);
   return null;
  }
};

//    Module exports:
module.exports = {
  obtenerTurnos,
  obtenerTurnoPorId,
  agregarTurno,
  actualizarTurno,
  obtenerTurnoPorDefensorId,
  onbtenerTurnoIDSimple
};
