const Etnia = require('../models/etnia')
const logger = require('../utilidades/logger');
class EtniaDAO {

  /**
   * @abstract Método que permite crear una etnia en la base de datos
   * @param {object} etnia - Objeto que contiene los datos de la etnia
   * @returns {object} Retorna el objeto de la etnia creada si la operación fue exitosa, de lo contrario lanza un error
   */
  async crearEtnia({ nombre, estatus_general }) {
    try {
      logger.info("Creando de etnia", { nombre, estatus_general })  
      const etnia = await Etnia.create({ nombre, estatus_general })
      logger.info("Etnia creada", { etnia })
      return etnia
    } catch (err) {
      logger.error("Error al crear etnia", { error: err.message })
      throw err
    }
  }

  /**
   * @abstract Método que permite obtener todas las etnias de la base de datos
   * @returns {array} Retorna un arreglo de objetos de etnias si la operación fue exitosa, de lo contrario lanza un error
   */
  async obtenerEtnias(activo) {
    try {
      logger.info("Obteniendo etnias, en base a su estatus", { activo })
      if (activo !== undefined && activo !== null && activo !== "") {
        logger.info("Se envió el parámetro activo y se obtendrán las etnias activas")
        const etnias = await Etnia.findAll({ where: { estatus_general: "ACTIVO" } })
        if (etnias === null || etnias.length === 0) {
          logger.info("No hay etnias activas registradas")
          throw new Error("No hay etnias activas registradas")
        }
        logger.info("Etnias activas obtenidas", { etnias })
        return etnias
      } else {
        logger.info("No se envió el parámetro activo y se obtendrán todas las etnias")
        const etnias = await Etnia.findAll()
        if (etnias === null || etnias.length === 0) {
          logger.info("No hay etnias registradas")
          throw new Error("No hay etnias registradas")
        }
        logger.info("Etnias obtenidas", { etnias })
        return etnias
      }
    } catch (err) {
      logger.error("Error al obtener etnias", { error: err.message })
      throw err
    }
  }

  /**
   * @abstract Método que permite obtener una etnia de la base de datos por su id
   * @param {number} id - ID de la etnia a obtener
   * @returns {object} Retorna el objeto de la etnia si la operación fue exitosa, de lo contrario lanza un error
   */
  async obtenerEtnia(id) {
    try {
      logger.info("Obteniendo etnia por ID", { id })
      const etnia = await Etnia.findByPk(id)
      
      if (!etnia) {
        logger.info("No se encontró la etnia")
        throw new Error("No se encontró la etnia")
      }


      logger.info("Etnia obtenida", { etnia })
      return etnia
    } catch (err) {
      logger.error("Error al obtener etnia por ID", { error: err.message })
      throw err
    }
  }

  /**
   * @abstract Método que permite actualizar una etnia en la base de datos
   * @param {number} id_etnia - ID de la etnia a actualizar
   * @param {object} etnia - Objeto que contiene los nuevos datos de la etnia
   * @returns {object} Retorna el objeto de la etnia actualizada si la operación fue exitosa, de lo contrario lanza un error
   */
  async actualizarEtnia(id_etnia, { nombre, estatus_general }) {
    try {
      logger.info("Actualizando etnia", { id_etnia, nombre, estatus_general })
      const etnia = await Etnia.update({ nombre, estatus_general }, { where: { id_etnia } })
      logger.info("Etnia actualizada retonando resultado", { result: etnia[0] === 1 })
      return etnia[0] == 1
    } catch (err) {
      logger.error("Error al actualizar etnia", { error: err.message })
      throw err
    }
  }



  async obtenerEtniasPaginacion(pagina) {
    try {
      logger.info("Obteniendo etnias paginadas y limitadas a 10 registros por página", { pagina })
      pagina = parseInt(pagina, 10)
      const offset = (pagina - 1) * 10
  
      logger.info("Obteniendo etnias paginadas", { offset })
      const resultados = await Etnia.findAll({ offset: offset, limit: 10 })
 
      if (resultados === null || resultados.length === 0) {
        logger.info("No se encontraron etnias paginadas")
        throw new Error("No se encontraron etnias paginadas")
      }

      logger.info("Etnias paginadas obtenidas", { resultados })
      return resultados
    } catch (err) {
      logger.error("Error al obtener etnias paginadas", { error: err.message })
      throw err
    }
  }


  async obtenerTotalEtnias() {
    try {
      logger.info("Obteniendo total de etnias")
      return await Etnia.count()
    } catch (err) {
      logger.error("Error al obtener total de etnias", { error: err.message })
      throw err
    }

  }

}

module.exports = new EtniaDAO()
