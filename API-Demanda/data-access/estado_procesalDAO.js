const logger = require('../utilidades/logger');
const estado_procesal = require('../models/estado_procesal')

class EstadoProcesalDAO {
  /**
   * @abstract Método que permite crear un estado procesal en la base de datos
   * @param {object} estadoProcesal - Objeto que contiene los datos del estado procesal
   * @returns {object} Retorna el objeto del estado procesal creado si la operación fue exitosa, de lo contrario lanza un error
   */
  async crearEstadoProcesal({ descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial }) {
    try {
      logger.info("Creando de estado procesal", { descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial })
      const result = await estado_procesal.create({ descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial })
      logger.info("Estado procesal creado", { result })
      return result
    } catch (error) {
      
      //console.log(err.message)
 logger.error("Error al crear estado procesal", { error: error.message })
      throw error
    }
  }

  /**
   * @abstract Método que permite actualizar un estado procesal en la base de datos
   * @param {number} id_estado_procesal - ID del estado procesal a actualizar
   * @param {object} estadoProcesal - Objeto que contiene los nuevos datos del estado procesal
   * @returns {object} Retorna el objeto del estado procesal actualizado si la operación fue exitosa, de lo contrario lanza un error
   */
  async actualizarEstadoProcesal(id_estado_procesal, { descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial }) {
    try {
      logger.info("Actualizando estado procesal", { id_estado_procesal, descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial })
      const result = await estado_procesal.update({ descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial }, { where: { id_estado_procesal } })
      logger.info("Estado procesal actualizado retonando resultado", { result: result[0] === 1 })
      return result[0] == 1
    } catch (error) {
      logger.error("Error al actualizar estado procesal", { error: error.message })
     // console.log(err.message)
 
      throw error
    }
  }

  async obtenerEstadoProcesalPorProcesoJudicial(id_proceso_judicial, totalBool, pagina) {

    try {
      logger.info("Obteniendo estado procesal por proceso judicial", { id_proceso_judicial })
       
      const limite = 10;
      const offset = (parseInt(pagina, 10) - 1) * limite;
        const whereClause = { id_proceso_judicial: id_proceso_judicial };
    
        logger.info("Si el total es true, se obtiene el total de estado procesal por proceso judicial, de lo contrario se obtiene el estado procesal por proceso judicial paginado", { totalBool })
      if (totalBool) {

        logger.info("Obteniendo total de estado procesal por proceso judicial", { whereClause })
        return await estado_procesal.count({
          raw: false,
          nest: true,
          where: whereClause
        });
      } else {
        logger.info("Obteniendo estado procesal por proceso judicial paginado", { whereClause, limite, offset })
        const estadosProcesales = await estado_procesal.findAll({
          raw: false,
          nest: true,
          where: whereClause,
          limit: limite,
          offset: offset
        });
        if (estadosProcesales === null || estadosProcesales.length === 0) {
          logger.info("No se encontraron estado procesal por proceso judicial paginado")
          throw new Error("No se encontraron estado procesal por proceso judicial paginado")
        }


        logger.info("Se verifica si el total de estado procesal por proceso judicial es mayor a 0")
        if (estadosProcesales.length > 0) {
          logger.info("Estado procesal por proceso judicial paginado obtenido", { estadosProcesales })
          return estadosProcesales;
        } else {
          logger.info("No se encontraron estado procesal por proceso judicial paginado")
          return null;
        }
      }
    }
    catch (error) {
      logger.error("Error al obtener estado procesal por proceso judicial", { error: error.message })
      //console.log(error.message)
      throw error;
    // console.log(error.message)  
      //throw error;
    }

  }


  /**
   * @abstract Método que permite obtener un estado procesal de la base de datos por su id
   * @param {number} id_estado_procesal - ID del estado procesal a obtener
   * @returns {object} Retorna el objeto del estado procesal si la operación fue exitosa, de lo contrario lanza un error
   */
  async obtenerEstadoProcesal(id_estado_procesal) {
    try {
      logger.info("Obteniendo estado procesal por ID", { id_estado_procesal })
      const estadoProcesal = await estado_procesal.findByPk(id_estado_procesal)
      if (!estadoProcesal) {
        logger.info("No se encontró el estado procesal")
        throw new Error("No se encontró el estado procesal")
      }

      logger.info("Estado procesal obtenido", { estadoProcesal })
      return estadoProcesal
    } catch (error) {
      logger.error("Error al obtener estado procesal por ID", { error: error.message })
      throw error
    }
  }

}

module.exports = new EstadoProcesalDAO()
