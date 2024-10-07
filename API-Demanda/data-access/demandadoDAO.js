const Demandado = require('../models/demandado')
const logger = require('../utilidades/logger');

class DemandadoDAO {
  /**
 * @abstract Método que permite crear un demandado en la base de datos
 * @param {object} demandado - Objeto que contiene los datos del demandado
 * @returns {object} Retorna el objeto del demandado creado si la operación fue exitosa, de lo contrario lanza un error
 */
  async crearDemandado({ id_demandado }) {
    try {
      logger.info("Creando de demandado", { id_demandado })
      const demandado = await Demandado.create({ id_demandado })
      logger.info("Demandado creado", { demandado })
      return demandado
    } catch (err) {   
      //   console.log(err.message)
    logger.error("Error al crear demandado", { error: err.message })
      throw err
    }
  }


  /**
 * @abstract Método que permite obtener un demandado de la base de datos por su id
 * @param {number} id - ID del demandado a obtener
 * @returns {object} Retorna el objeto del demandado si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerDemandado(id) {
    try {
      logger.info("Obteniendo demandado", { id })
      const demandado = await Demandado.findByPk(id)

      if (!demandado) {
        logger.info("No se encontró el demandado")
        throw new Error("No se encontró el demandado")
      }

      logger.info("Demandado obtenido", { demandado })
      return demandado
    } catch (err) {
      logger.error("Error al obtener demandado", { error: err.message })
      throw err
    }
  }



}

module.exports = new DemandadoDAO()
