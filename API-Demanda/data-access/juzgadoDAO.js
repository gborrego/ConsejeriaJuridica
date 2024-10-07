const Juzgado = require('../models/juzgado')
const logger = require('../utilidades/logger');

class JuzgadoDAO {
  /**
 * @abstract Método que permite crear un juzgado en la base de datos
 * @param {object} juzgado - Objeto que contiene los datos del juzgado
 * @returns {object} Retorna el objeto del juzgado creado si la operación fue exitosa, de lo contrario lanza un error
 */

  async crearJuzgado({ nombre_juzgado, estatus_general }) {
    try {
      logger.info("Creando de juzgado", { nombre_juzgado, estatus_general })
      const juzgado = await Juzgado.create({ nombre_juzgado, estatus_general })
      logger.info("Juzgado creado", { juzgado })
      return juzgado
    } catch (err) {
      logger.error("Error al crear juzgado", { error: err.message })
      throw err
    }
  }

  /**
 * @abstract Método que permite obtener todos los juzgados de la base de datos
 * @returns {array} Retorna un arreglo de objetos de juzgados si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerJuzgados(activo) {
    try {
      logger.info("Obteniendo juzgados, en base a su estatus", { activo })

      if (activo !== undefined && activo !== null && activo !== "") {
        logger.info("Se envió el parámetro activo y se obtendrán los juzgados activos")
        const juzgados = await Juzgado.findAll({ where: { estatus_general: "ACTIVO" } })
        if (juzgados === null || juzgados.length === 0) {
          logger.info("No hay juzgados activos registrados")
          throw new Error("No hay juzgados activos registrados")
        }

        logger.info("Juzgados activos obtenidos", { juzgados })
        return juzgados
      } else {
        logger.info("No se envió el parámetro activo y se obtendrán todos los juzgados")
        const juzgados = await Juzgado.findAll()

        if (juzgados === null || juzgados.length === 0) {
          logger.info("No hay juzgados registrados")
          throw new Error("No hay juzgados registrados")
        }

        logger.info("Juzgados obtenidos", { juzgados })
        return juzgados
      }
    } catch (err) {

      logger.error("Error al obtener juzgados", { error: err.message })
      throw err
    }
  }

  /**
 * @abstract Método que permite obtener un juzgado de la base de datos por su id
 * @param {number} id - ID del juzgado a obtener
 * @returns {object} Retorna el objeto del juzgado si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerJuzgado(id) {
    try {
      logger.info("Obteniendo juzgado por ID", { id })
      const juzgado = await Juzgado.findByPk(id)
      if (!juzgado) {
        logger.info("No se encontró el juzgado")
        throw new Error("No se encontró el juzgado")
      }

      logger.info("Juzgado obtenido", { juzgado })
      return juzgado
    } catch (err) {
      logger.error("Error al obtener juzgado por ID", { error: err.message })
      throw err
    }
  }

  /**
 * @abstract Método que permite actualizar un juzgado en la base de datos
 * @param {number} id_juzgado - ID del juzgado a actualizar
 * @param {object} juzgado - Objeto que contiene los nuevos datos del juzgado
 * @returns {object} Retorna el objeto del juzgado actualizado si la operación fue exitosa, de lo contrario lanza un error
 */
  async actualizarJuzgado(id_juzgado, { nombre_juzgado, estatus_general }) {
    try {
      logger.info("Actualizando juzgado", { id_juzgado, nombre_juzgado, estatus_general })
      const juzgado = await Juzgado.update({ nombre_juzgado, estatus_general }, { where: { id_juzgado } })
      logger.info("Juzgado actualizado retonando resultado", { result: juzgado[0] === 1 })
      return juzgado[0] == 1
    } catch (err) {
      logger.error("Error al actualizar juzgado", { error: err.message })
      throw err
    }
  }

    
   async obtenerJuzgadosPaginacion(pagina) {
    try {
      logger.info("Obteniendo juzgados paginados y limitados a 10", { pagina })
      pagina = parseInt(pagina, 10)
      const offset = (pagina - 1) * 10
      const resultados = await Juzgado.findAll({ offset: offset, limit: 10 })

      if (resultados === null || resultados.length === 0) {
        logger.info("No se encontraron juzgados paginados")
        throw new Error("No se encontraron juzgados paginados")
      }

      logger.info("Juzgados paginados obtenidos", { resultados })
      return resultados
    } catch (err) {

      logger.error("Error al obtener juzgados paginados", { error: err.message })
      throw err
    }
  }
 
  async obtenerTotalJuzgados() {
    try {
      logger.info("Obteniendo total de juzgados")
      return await Juzgado.count()
    } catch (err) {
      logger.error("Error al obtener total de juzgados", { error: err.message })
      throw err
    }
  }


}

module.exports = new JuzgadoDAO()
