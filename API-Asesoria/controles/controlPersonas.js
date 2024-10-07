const modeloPersona = require('../modelos/modeloPersona');
const { Op } = require("sequelize");
const logger = require('../utilidades/logger');

/**
 * @abstract Función que permite obtener todas las personas
 * @returns personas
 */
const obtenerPersonas = async () => {
  try {
    logger.info("Se obtienen las personas")
    return await modeloPersona.Persona.findAll({
      raw: true,
      nest: true
      ,
      attributes: {
        exclude: ['id_domicilio', 'id_genero']
      },
      include: [modeloPersona.Domicilio, modeloPersona.Genero]
    });
  } catch (error) {
   // console.log("Error personas:", error.message);
    logger.error("Error personas:", error.message);
    return null;
  }
};

/**
 *  @abstract Función que permite obtener una persona por su id
 * @param {*} id id de la persona
 * @returns persona
 */
const obtenerPersonaPorId = async (id) => {
  try {
    logger.info("Se obtiene la persona por su id", id)
    return await modeloPersona.Persona.findByPk(id, {
      raw: false,
      nest: true
      , attributes: {
        exclude: ['id_domicilio', 'id_genero']
      },
      include: [modeloPersona.Domicilio, modeloPersona.Genero]
    });
  } catch (error) {
  //  console.log("Error personas:", error.message);
    logger.error("Error personas:", error.message);  
  return null;
  }
};

/**
 *  @abstract Función que permite agregar una persona
 * @param {*} persona persona a agregar
 *  @returns persona si se agrega correctamente, false si no  agregar
 */
const agregarPersona = async (persona) => {
  try {
    logger.info("Se agrega la persona", persona)  
    return (await modeloPersona.Persona.create(persona, { raw: true, nest: true })).dataValues;
  } catch (error) {
  //  console.log("Error personas:", error.message);
   logger.error("Error personas:", error.message);  
   return false;
  }
};


/**
 * @abstract Función que permite actualizar una persona
 * @param {*} persona persona a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarPersona = async (persona) => {
  try {
    logger.info("Se actualiza la persona", persona)
    const result = await modeloPersona.Persona.update(persona, { where: { id_persona: persona.id_persona } });
    logger.info("Se retonra el resultado de actualizar a la persona", result[0] === 1)
     return result[0] === 1; 
  } catch (error) {
    logger.error("Error personas:", error.message);
    //console.log("Error personas:", error.message);
    return false;
  }
};


/**
 *  @abstract Función que permite obtener una persona por su nombre
 * @param {*} nombre nombre de la persona
 * @param {*} apellido_paterno apellido paterno de la persona
 * @param {*} apellido_materno apellido materno de la persona
 * @returns persona
 * */
const obtenerPersonasNombre = async (nombre, apellido_paterno, apellido_materno) => {
  try {

    logger.info("Se obtiene la persona por su nombre, apellido paterno y apellido materno", nombre, apellido_paterno, apellido_materno)
    logger.info("Se crea la clausula where", whereClause)
    const whereClause = {};
    
    logger.info("Se verifica si el nombre es diferente de nulo y asu vez se agrega a la clausula where", nombre)
    if (nombre) {
      whereClause.nombre = { [Op.like]: `%${nombre}%` };
    }

    logger.info("Se verifica si el apellido paterno es diferente de nulo y asu vez se agrega a la clausula where", apellido_paterno)
    if (apellido_paterno) {
      whereClause.apellido_paterno = { [Op.like]: `%${apellido_paterno}%` };
    }

    logger.info("Se verifica si el apellido materno es diferente de nulo y asu vez se agrega a la clausula where", apellido_materno)
    if (apellido_materno) {
      whereClause.apellido_materno = { [Op.like]: `%${apellido_materno}%` };
    }


    logger.info("Se obtienen las personas por su nombre, apellido paterno y apellido materno", whereClause)
    const personas_pre = await modeloPersona.Persona.findAll({
      where: whereClause,
      raw: true,
      nest: true,
      attributes: {
        exclude: ['id_domicilio', 'id_genero']
      },
      include: [modeloPersona.Domicilio, modeloPersona.Genero]
    });

    logger.info("Se obtienen los id de las personas", personas_pre.map(persona_pre => persona_pre.id_persona))
    const personas = personas_pre.map(persona_pre => persona_pre.id_persona);

    logger.info("Se verifica si la longitud de las personas es igual a 0", personas.length)
    if (personas.length === 0) {
      logger.info("No se encontraron personas")
      return null;
    } else {
      logger.info("Se encontraron personas")
      return personas;
    }
  } catch (error) {
 //   console.log("Error personas:", error.message);
  logger.error("Error personas:", error.message); 
  return null;
  }
};

const obtenerPersonaPorPorIdMiddleware = async (id) => {
  try {
    logger.info("Se obtiene la persona por su id y su estatus activo", id)
    return await modeloPersona.Persona.findByPk(id);
  } catch (error) {
    logger.error("Error personas:", error.message);
    //console.log("Error personas:", error.message);
    return null;
  }
};

//Module exports
module.exports = {
  obtenerPersonas,
  obtenerPersonaPorId,
  agregarPersona,
  actualizarPersona,
  obtenerPersonasNombre,
  obtenerPersonaPorPorIdMiddleware
};
