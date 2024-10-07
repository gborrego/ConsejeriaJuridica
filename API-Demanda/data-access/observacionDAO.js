

const Observacion = require('../models/observacion')
const logger = require('../utilidades/logger');

class ObservacionDAO {

   /** 
    * Método que permite crear una observación en la base de datos
    * @param {object} observacion - Objeto que contiene los datos de la observación
    * @returns {object} Retorna el objeto de la observación creada si la operación fue exitosa, de lo contrario lanza un error
    * */


   async crearObservacion({ id_proceso_judicial, observacion }) {
      try {
         logger.info("Creando de observación", { id_proceso_judicial, observacion })
         const observacionEncontrada = await Observacion.create({ id_proceso_judicial, observacion })
         logger.info("Observación creada", { observacionEncontrada })
         return observacionEncontrada
      } catch (err) {

        // console.log(err.message)
       logger.error("Error al crear observación", { error: err.message })
         throw err
      }
   }

   /**
    * Método que permite obtener una observación de la base de datos por su id
    * @param {number} id_observacion - ID de la observación a obtener
    * @returns {object} Retorna el objeto de la observación si la operación fue exitosa, de lo contrario lanza un error
    * */


   async obtenerObservacion(id_observacion) {
      try {
         logger.info("Obteniendo observación por ID", { id_observacion })
         const observacion = await Observacion.findByPk(id_observacion)
         if (!observacion) {
            logger.info("No se encontró la observación")
            throw new Error("No se encontró la observación")
         }


         logger.info("Observación obtenida", { observacion })
         return observacion
      } catch (err) {
         logger.error("Error al obtener observación por ID", { error: err.message })
         throw err
      }
   }

   /**
    * Método que permite obtener todas las observaciones de un proceso judicial
    * @param {number} id_proceso_judicial - ID del proceso judicial a obtener sus observaciones
    * @returns {array} Retorna un arreglo de objetos de observaciones si la operación fue exitosa, de lo contrario lanza un error
    * */


   async obtenerObservacionesPorProcesoJudicial(id_proceso_judicial, totalBool, pagina) {

      try {
         logger.info("Obteniendo observaciones por proceso judicial", { id_proceso_judicial })
         const limite = 10
         const offset = (parseInt(pagina, 10) - 1) * limite
         const whereClause = { id_proceso_judicial: id_proceso_judicial }

         logger.info("Si el total es true, se obtiene el total de observaciones por proceso judicial, de lo contrario se obtiene las observaciones por proceso judicial paginado", { totalBool })
         if (totalBool) {

            logger.info("Obteniendo total de observaciones por proceso judicial", { whereClause })
            return await Observacion.count({
               raw: false,
               nest: true,
               where: whereClause
            })
         } else {
            logger.info("Obteniendo observaciones por proceso judicial paginado", { whereClause, limite, offset })
            const observaciones = await Observacion.findAll({
               raw: false,
               nest: true,
               where: whereClause,
               limit: limite,
               offset: offset
            })
              
            if(  observaciones === null || observaciones.length === 0){
               logger.info("No se encontraron observaciones por proceso judicial paginado")
               throw new Error("No se encontraron observaciones por proceso judicial paginado")
            }

             logger.info("Se verifica si el total de observaciones por proceso judicial es mayor a 0")
            if (observaciones.length > 0) {
               logger.info("Observaciones por proceso judicial paginado obtenido", { observaciones })
               return observaciones
            } else {
               logger.info("No se encontraron observaciones por proceso judicial paginado")  
               return null
            }
         }
      }
      catch (error) {

         logger.error("Error al obtener observaciones por proceso judicial", { error: error.message })
         throw error
      }
   }
   /** 
    * Método que permite actualizar una observación en la base de datos
    * @param {number} id_observacion - ID de la observación a actualizar
    * @param {object} observacion - Objeto que contiene los datos de la observación
    * @returns {boolean} Retorna true si la operación fue exitosa, de lo contrario lanza un error
    * */

   async actualizarObservacion(id_observacion, { observacion, id_proceso_judicial }) {
      try {
         logger.info("Actualizando observación", { id_observacion, observacion, id_proceso_judicial })
         const observacionActualizado = await Observacion.update({ observacion, id_proceso_judicial }, { where: { id_observacion: id_observacion } })
         logger.info("Observación actualizada retonando resultado", { result: observacionActualizado[0] === 1 })
         return observacionActualizado[0] === 1
      } catch (err) {
         console.log(err.message)
         logger.error("Error al actualizar observación", { error: err.message })
         throw err
      }
   }

}

module.exports = new ObservacionDAO()