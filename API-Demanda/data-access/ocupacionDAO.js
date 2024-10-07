const logger = require('../utilidades/logger');
const Ocupacion = require('../models/ocupacion')

class OcupacionDAO {

  /**
 * @abstract Método que permite crear una ocupación en la base de datos
 * @param {object} ocupacion - Objeto que contiene los datos de la ocupación
 * @returns {object} Retorna el objeto de la ocupación creada si la operación fue exitosa, de lo contrario lanza un error
 */
  async crearOcupacion({ descripcion_ocupacion ,estatus_general}) {
    try {
       logger.info("Creando de ocupacion", { descripcion_ocupacion,estatus_general })
      const ocupacion = await Ocupacion.create({ descripcion_ocupacion,estatus_general })
      logger.info("Ocupacion creada", { ocupacion })
      return ocupacion
    } catch (err) {
      throw err
    }
  }

  /**
 * @abstract Método que permite obtener todas las ocupaciones de la base de datos
 * @returns {array} Retorna un arreglo de objetos de ocupaciones si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerOcupaciones(activo) {
    try {
       
      logger.info("Obteniendo ocupaciones, en base a su estatus", { activo })
      if (activo !== undefined && activo !== null && activo !== "") {
        logger.info("Se envió el parámetro activo y se obtendrán las ocupaciones activas")
        const ocupaciones = await Ocupacion.findAll({ where: { estatus_general: "ACTIVO" } })
     if(ocupaciones ===null || ocupaciones.length === 0){
        logger.info("No hay ocupaciones activas registradas")
        throw new Error("No hay ocupaciones activas registradas")
     }

        logger.info("Ocupaciones activas obtenidas", { ocupaciones })
        return ocupaciones
      }else{
        logger.info("No se envió el parámetro activo y se obtendrán todas las ocupaciones")
      const ocupaciones = await Ocupacion.findAll()
      if(ocupaciones ===null || ocupaciones.length === 0){
        logger.info("No hay ocupaciones registradas")
        throw new Error("No hay ocupaciones registradas")
      }

      logger.info("Ocupaciones obtenidas", { ocupaciones })
      return ocupaciones
      }
    } catch (err) {
      logger.error("Error al obtener ocupaciones", { error: err.message })
      throw err
    }
  }

  /**
 * @abstract Método que permite obtener una ocupación de la base de datos por su id
 * @param {number} id - ID de la ocupación a obtener
 * @returns {object} Retorna el objeto de la ocupación si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerOcupacion(id) {
    try {
      logger.info("Obteniendo ocupacion por ID", { id })
      const ocupacion = await Ocupacion.findByPk(id)
      if (!ocupacion) {
        logger.info("No se encontró la ocupacion")
        throw new Error("No se encontró la ocupacion")
      }

      logger.info("Ocupacion obtenida", { ocupacion })
      return ocupacion
    } catch (err) {
      logger.error("Error al obtener ocupacion por ID", { error: err.message })
      throw err
    }
  }

  /**
 * @abstract Método que permite actualizar una ocupación en la base de datos
 * @param {number} id_ocupacion - ID de la ocupación a actualizar
 * @param {object} ocupacion - Objeto que contiene los nuevos datos de la ocupación
 * @returns {object} Retorna el objeto de la ocupación actualizada si la operación fue exitosa, de lo contrario lanza un error
 */
  async actualizarOcupacion(id_ocupacion, { descripcion_ocupacion,estatus_general }) {
    try {
      logger.info("Actualizando de ocupacion", { id_ocupacion, descripcion_ocupacion,estatus_general })
      const ocupacion = await Ocupacion.update({ descripcion_ocupacion ,estatus_general}, { where: { id_ocupacion } })
      logger.info("Retornando resultado de la actualización", { result: ocupacion[0] === 1 })
      return ocupacion[0]==1
    } catch (err) {
      logger.error("Error al actualizar ocupacion", { error: err.message })
      throw err
    }
  }



  async obtenerOcupacionesPaginacion(pagina) {
    try {
      logger.info("Obteniendo ocupaciones por paginación y límite de 10", { pagina })
      pagina = parseInt(pagina, 10)
      const offset = (pagina - 1) * 10
      const resultados = await Ocupacion.findAll({ offset: offset, limit: 10 })
      if (resultados === null || resultados.length === 0) {
        logger.info("No se encontraron ocupaciones")
        throw new Error("No se encontraron ocupaciones")
      }

      logger.info("Ocupaciones paginadas obtenidas", { resultados })
      return resultados
    } catch (err) {
      throw err
    }
  }


  async obtenerTotalOcupaciones() {
    try {
      logger.info("Obteniendo total de ocupaciones")
      return await Ocupacion.count()
    } catch (err) {
      logger.error("Error al obtener total de ocupaciones", { error: err.message })
      throw err
    }

  }


   
}

module.exports = new OcupacionDAO()
