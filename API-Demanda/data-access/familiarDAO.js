


const Familiar = require('../models/familiar')
const logger = require('../utilidades/logger');

class FamiliarDAO {
  /**  
   * Método que permite crear un familiar en la base de datos
   * @param {object} familiar - Objeto que contiene los datos del familiar
   * @returns {object} Retorna el objeto del familiar creado si la operación fue exitosa, de lo contrario lanza un error
   * */


  async crearFamiliar({  nombre, nacionalidad, 
    parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, 
    pobrezaExtrema, id_promovente }) {
    try {
      logger.info("Creando de familiar", { nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente })
      const familiar = await Familiar.create({ nombre, nacionalidad, parentesco, 
        perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente })
      logger.info("Familiar creado", { familiar })
      return familiar
    } catch (err) {
      logger.error("Error al crear familiar", { error: err.message })
     // console.log(err.message)
      throw err
    }
  }
  /**
   * Método que permite actualizar un familiar en la base de datos
   * @param {number} id_familiar - ID del familiar a actualizar
   * @param {object} familiar - Objeto que contiene los datos del familiar
   * @returns {boolean} Retorna true si la operación fue exitosa, de lo contrario lanza un error
   * */
  
  
  async actualizarFamiliar(id_familiar, { nombre, nacionalidad, parentesco, perteneceComunidadLGBT, 
    adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente }) {
    try {
      logger.info("Actualizando familiar", { id_familiar, nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente })
      const familiar = await Familiar.update({  nombre, nacionalidad, parentesco, perteneceComunidadLGBT,
         adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente }, { where: { id_familiar: id_familiar } })
      logger.info("Familiar actualizado retonando resultado", { result: familiar[0] === 1 })
      return familiar[0] === 1
    } catch (err) {
    //  console.log(err.message)
       logger.error("Error al actualizar familiar", { error: err.message })  
    throw err
    }
  }
   
 

  async obtenerFamiliarPorPromovente(id_promovente, totalBool, pagina) {

    try {
      logger.info("Obteniendo familiar por promovente y limitadas a 10 registros por página", { id_promovente, totalBool, pagina })
      const limite = 10
      const offset = (parseInt(pagina, 10) - 1) * limite
      const whereClause = { id_promovente: id_promovente }

      logger.info("Si el total es true, se obtiene el total de familiar por promovente, de lo contrario se obtiene el familiar por promovente paginado", { totalBool })
      if (totalBool) {

        logger.info("Obteniendo total de familiar por promovente", { whereClause })
        return await Familiar.count({
          raw: false,
          nest: true,
          where: whereClause
        })
      } else {

        logger.info("Obteniendo familiares por promovente", { whereClause })
        const familiares = await Familiar.findAll({
          raw: false,
          nest: true,
          where: whereClause,
          limit: limite,
          offset: offset
        })
        
        if (familiares === null || familiares.length === 0) {
          logger.info("No se encontraron familiares por promovente paginado")
          throw new Error("No se encontraron familiares por promovente paginado")
        }


        logger.info("Se verifica si el total de familiares por promovente es mayor a 0")
        if (familiares.length > 0) {
          logger.info("Familiares por promovente obtenidos", { familiares })
          return familiares
        } else {
          logger.info("No se encontraron familiares por promovente", { familiares })
          return null
        }
      }
    } catch (error) {
      logger.error("Error al obtener familiares por promovente", { error: error.message })
      throw error
    }
  }


  async obtenerFamiliar(id) {
    try {
      logger.info("Obteniendo familiar por ID", { id })
      const familiar = await Familiar.findByPk(id)
      if (!familiar) {
        logger.info("No se encontró el familiar")
        throw new Error("No se encontró el familiar")
      }

      logger.info("Familiar obtenido", { familiar })
      return familiar
    } catch (err) {
      logger.error("Error al obtener familiar por ID", { error: err.message })
      throw err
    }
  }




}



module.exports = new FamiliarDAO()