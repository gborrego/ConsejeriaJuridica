const { log } = require('winston');
const Escolaridad = require('../models/escolaridad')
const logger = require('../utilidades/logger');

class EscolaridadDAO {
  /**
   * @abstract Método que permite crear una escolaridad en la base de datos
   * @param {object} descripcion - Objeto que contiene los datos de la escolaridad
   * @returns {object} Retorna el objeto de la escolaridad creada si la operación fue exitosa, de lo contrario lanza un error
   */
  async crearEscolaridad({ descripcion,estatus_general }) {
    try {
      logger.info("Creando de escolaridad", { descripcion,estatus_general })
      const escolaridad = await Escolaridad.create({ descripcion,estatus_general })
      logger.info("Escolaridad creada", { escolaridad })
      return escolaridad
    } catch (err) {
      logger.error("Error al crear escolaridad", { error: err.message })
      throw err
    }
  }

  /**
   * @abstract Método que permite obtener todas las escolaridades de la base de datos
   * @returns {array} Retorna un arreglo de objetos de escolaridades si la operación fue exitosa, de lo contrario lanza un error
   */
  async obtenerEscolaridades(activo) {
    try {
      logger.info("Obteniendo escolaridades, en base a su estatus", { activo })

      logger.info("Verificando si se envió el parámetro activo")
      if (activo !== undefined && activo !== null && activo !== "") {
        logger.info("Se envió el parámetro activo y se obtendrán las escolaridades activas")
        const escolaridades = await Escolaridad.findAll({ where: { estatus_general: "ACTIVO" } })
   
        if (escolaridades === null || escolaridades.length === 0) {
          logger.info("No hay escolaridades activas registradas")
          throw new Error("No hay escolaridades activas registradas")
        }


        logger.info("Escolaridades activas obtenidas", { escolaridades })
        return escolaridades
      } else{
        logger.info("No se envió el parámetro activo y se obtendrán todas las escolaridades")
        const escolaridades = await Escolaridad.findAll()
        if (escolaridades === null || escolaridades.length === 0) {
          logger.info("No hay escolaridades registradas")
          throw new Error("No hay escolaridades registradas")
        }

        logger.info("Escolaridades obtenidas", { escolaridades })
        return escolaridades
      }
    } catch (err) {
      logger.error("Error al obtener escolaridades", { error: err.message })
      throw err
    }
  }

  /**
   * @abstract Método que permite obtener una escolaridad de la base de datos por su id
   * @param {number} id - ID de la escolaridad a obtener
   * @returns {object} Retorna el objeto de la escolaridad si la operación fue exitosa, de lo contrario lanza un error
   */
  async obtenerEscolaridadPorId(id) {
    try {
      logger.info("Obteniendo escolaridad por ID", { id })
      const escolaridad = await Escolaridad.findByPk(id)
      
      if (!escolaridad) {
        logger.info("No se encontró la escolaridad")
        throw new Error("No se encontró la escolaridad")
      }

      logger.info("Escolaridad obtenida", { escolaridad })
      return escolaridad
    } catch (err) {
      logger.error("Error al obtener escolaridad por ID", { error: err.message })
      throw err
    }
  }

  /**
   * @abstract Método que permite actualizar una escolaridad en la base de datos
   * @param {number} id_escolaridad - ID de la escolaridad a actualizar
   * @param {object} descripcion - Objeto que contiene los nuevos datos de la escolaridad
   * @returns {object} Retorna el objeto de la escolaridad actualizada si la operación fue exitosa, de lo contrario lanza un error
   */
  async actualizarEscolaridad(id_escolaridad, { descripcion,estatus_general }) {
    try {
      logger.info("Actualizando escolaridad", { id_escolaridad, descripcion,estatus_general })
       const escolaridad = await Escolaridad.update({ descripcion,estatus_general }, { where: { id_escolaridad } })
      logger.info("Escolaridad actualizada retonando resultado",{result:escolaridad [0] === 1})
       return escolaridad [0]==1
    } catch (err) {
      logger.error("Error al actualizar escolaridad", { error: err.message })
      throw err
    }
  }
  



  async obtenerEscolaridadesPaginacion(pagina) {
    try {
      logger.info("Obteniendo escolaridades por paginación, y limitando a 10 resultados por página", { pagina })
      pagina = parseInt(pagina, 10)
      const offset = (pagina - 1) * 10
      logger.info("Obteniendo escolaridades por paginación", { offset })
      const resultados = await Escolaridad.findAll({ offset: offset, limit: 10 })

      
      if (resultados === null || resultados.length === 0) { 
        logger.info("No se encontraron escolaridades paginadas")
        throw new Error("No se encontraron escolaridades paginadas")
      }
      

      logger.info("Escolaridades obtenidas por paginación", { resultados })
      return resultados
    } catch (err) {
      logger.error("Error al obtener escolaridades por paginación", { error: err.message })
      throw err
    }
  }

  async obtenerTotalEscolaridades() {
    try {
      logger.info("Obteniendo total de escolaridades")
      return await Escolaridad.count()
    } catch (err) {
      logger.error("Error al obtener total de escolaridades", { error: err.message })
      throw err
    }

  }

 
}

module.exports = new EscolaridadDAO()
