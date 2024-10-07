

const Prueba = require('../models/prueba')
const logger = require('../utilidades/logger');

class PruebaDAO {

  /**
   * Método que permite crear una prueba en la base de datos
   * @param {object} prueba - Objeto que contiene los datos de la prueba
   * @returns {object} Retorna el objeto de la prueba creada si la operación fue exitosa, de lo contrario lanza un error
   * */

  async crearPrueba({ descripcion_prueba,  id_proceso_judicial }) {
    try {
      logger.info("Creando de prueba", { descripcion_prueba, id_proceso_judicial })
      const prueba = await Prueba.create({ descripcion_prueba, id_proceso_judicial })
      logger.info("Prueba creada", { prueba })
      return prueba
    } catch (err) {    //  console.log(err.message)
   logger.error("Error al crear prueba", { error: err.message })
      throw err
    }
  }

 
  /**
   * Método que permite obtener una prueba de la base de datos por su id
   * @param {number} id_prueba - ID de la prueba a obtener
   * @returns {object} Retorna el objeto de la prueba si la operación fue exitosa, de lo contrario lanza un error
   * */
  async obtenerPrueba(id_prueba) {
    try {
      logger.info("Obteniendo prueba por ID", { id_prueba })
       const prueba = await Prueba.findByPk(id_prueba)
     if (!prueba) { 

        logger.info("No se encontró la prueba")
        throw new Error("No se encontró la prueba")
      }
        
      logger.info("Prueba obtenida", { prueba })
      return prueba
    } catch (err) {
      logger.error("Error al obtener prueba por ID", { error: err.message })
      throw err
    }
  }
  /**
   * Método que permite obtener todas las pruebas de un proceso judicial
   * @param {number} id_proceso_judicial - ID del proceso judicial a obtener sus pruebas
   * @returns {array} Retorna un arreglo de objetos de pruebas si la operación fue exitosa, de lo contrario lanza un error
   * */

  async obtenerPruebasPorProcesoJudicial(id_proceso_judicial, totalBool, pagina) {

     try {
      logger.info("Obteniendo pruebas por proceso judicial y limitando a 10", { id_proceso_judicial })
      const limite = 10
      const offset = (parseInt(pagina, 10) - 1) * limite
      const whereClause = { id_proceso_judicial: id_proceso_judicial }

      logger.info("Verificando si se envió el parámetro totalBool con el fin de obtener el total de pruebas o solo las pruebas")
      if (totalBool) {

        logger.info("Se envió el parámetro totalBool y se obtendrá el total de pruebas")
        return await Prueba.count({
          raw: false,
          nest: true,
          where: whereClause
        })
      } else {
        logger.info("No se envió el parámetro totalBool y se obtendrán las pruebas por proceso judicial paginado", { whereClause })
        const pruebas = await Prueba.findAll({
          raw: false,
          nest: true,
          where: whereClause,
          limit: limite,
          offset: offset
        }) 
        if (pruebas === null || pruebas === undefined || pruebas.length === 0) {
          logger.info("No se encontraron pruebas por proceso judicial paginado")
          throw new Error("No se encontraron pruebas por proceso judicial paginado")  
        }
        logger.info("Se verifica si el total de pruebas por proceso judicial es mayor a 0")
        if (pruebas.length > 0) {
          logger.info("Pruebas por proceso judicial paginado obtenido", { pruebas })
          return pruebas
        } else {
          logger.info("No se encontraron pruebas por proceso judicial paginado")
          return null
        }
      }

    }
    catch (error) {
      logger.error("Error al obtener pruebas por proceso judicial", { error: error.message })
      throw error
    }
  }

  /**
   * Método que permite actualizar una prueba en la base de datos
   * @param {number} id_prueba - ID de la prueba a actualizar
   * @param {object} prueba - Objeto que contiene los datos de la prueba
   * @returns {boolean} Retorna true si la operación fue exitosa, de lo contrario lanza un error
   * */
  async actualizarPrueba(id_prueba, { descripcion_prueba , id_proceso_judicial }) {
    try {
      logger.info("Actualizando prueba", { id_prueba, descripcion_prueba, id_proceso_judicial })
      const pruebaActualizado = await Prueba.update({ descripcion_prueba, id_proceso_judicial }, { where: { id_prueba: id_prueba } })
      logger.info("Prueba actualizada retonando resultado", { result: pruebaActualizado[0] === 1 })
      return pruebaActualizado[0] === 1
    } catch (err) {  //    console.log(err.message)
      logger.error("Error al actualizar prueba", { error: err.message })
      throw err
    }
  }

}   

module.exports = new PruebaDAO ()