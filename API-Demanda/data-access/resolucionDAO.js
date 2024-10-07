


const Resolucion = require('../models/resolucion')
const logger = require('../utilidades/logger');

class ResolucionDAO {

    /**
     * Método que permite crear una resolución en la base de datos
     * @param {object} resolucion - Objeto que contiene los datos de la resolución
     * @returns {object} Retorna el objeto de la resolución creada si la operación fue exitosa, de lo contrario lanza un error
     * */


    async crearResolucion({ id_proceso_judicial, resolucion, fecha_resolucion }) {
        try {
            logger.info("Creando de resolución", { id_proceso_judicial, resolucion, fecha_resolucion })
            const resolucionCreda = await Resolucion.create({ id_proceso_judicial, resolucion, fecha_resolucion })
            logger.info("Resolución creada", { resolucionCreda })
            return resolucionCreda
        } catch (err) {   //   console.log(err.message)
            logger.error("Error al crear resolución", { error: err.message })
            throw err
        }
    }



    /**
     * Método que permite obtener una resolución de la base de datos por su id
     * @param {number} id_resolucion - ID de la resolución a obtener
     * @returns {object} Retorna el objeto de la resolución si la operación fue exitosa, de lo contrario lanza un error
     * */

    async obtenerResolucion(id_resolucion) {
        try {
            logger.info("Obteniendo resolución por ID", { id_resolucion })
            const resolucion = await Resolucion.findByPk(id_resolucion)
            if (!resolucion) {
                logger.info("No se encontró la resolución")
                throw new Error("No se encontró la resolución")
            }

            logger.info("Resolución obtenida", { resolucion })
            return resolucion
        } catch (err) {
            logger.error("Error al obtener resolución por ID", { error: err.message })
            throw err
        }
    }
    /**
     * Método que permite obtener todas las resoluciones de un proceso judicial
     * @param {number} id_proceso_judicial - ID del proceso judicial a obtener sus resoluciones
     * @returns {array} Retorna un arreglo de objetos de resoluciones si la operación fue exitosa, de lo contrario lanza un error
     * */

    async obtenerResolucionesPorProcesoJudicial(id_proceso_judicial, totalBool, pagina) {

        try {
            logger.info("Obteniendo resoluciones por proceso judicial y limitando a 10", { id_proceso_judicial })
            const limite = 10
            const offset = (parseInt(pagina, 10) - 1) * limite
            const whereClause = { id_proceso_judicial: id_proceso_judicial }

            logger.info("Verificando si se envió el parámetro totalBool, con el fin de obtener el total de resoluciones o solo las resoluciones")
            if (totalBool) {
                logger.info("Se envió el parámetro totalBool y se obtendrá el total de resoluciones")
                return await Resolucion.count({
                    raw: false,
                    nest: true,
                    where: whereClause
                })
            } else {
                logger.info("No se envió el parámetro totalBool y se obtendrán las resoluciones paginadas")
                const resoluciones = await Resolucion.findAll({
                    raw: false,
                    nest: true,
                    where: whereClause,
                    limit: limite,
                    offset: offset
                }) 
                  if(resoluciones === null ||  resoluciones.length === 0){
                    logger.info("No se encontraron resoluciones por proceso judicial paginado")
                    throw new Error("No se encontraron resoluciones por proceso judicial paginado")
                } 


                logger.info("Verificando si el total de resoluciones es mayor a 0")
                if (resoluciones.length > 0) {
                    logger.info("Resoluciones paginadas obtenidas", { resoluciones })
                    return resoluciones
                } else {
                    logger.info("No se encontraron resoluciones paginadas")
                    return null
                }
            }

        }
        catch (error) {
            logger.error("Error al obtener resoluciones por proceso judicial", { error: error.message })
            throw error
        }

    }

    /**
     * Método que permite actualizar una resolución en la base de datos
     * @param {number} id_resolucion - ID de la resolución a actualizar
     * @param {object} resolucion - Objeto que contiene los datos de la resolución
     * @returns {boolean} Retorna true si la operación fue exitosa, de lo contrario lanza un error
     * */

    async actualizarResolucion(id_resolucion, { resolucion, fecha_resolucion }) {
        try {
            logger.info("Actualizando resolución", { id_resolucion, resolucion, fecha_resolucion })
            const resolucionActualizado = await Resolucion.update({ resolucion, fecha_resolucion }, { where: { id_resolucion: id_resolucion } })
            logger.info("Resolución actualizada retonando resultado", { result: resolucionActualizado[0] === 1 })
            return resolucionActualizado[0] === 1
        } catch (err) {    //  console.log(err.message)
            logger.error("Error al actualizar resolución", { error: err.message })
            throw err
        }
    }

}


module.exports = new ResolucionDAO()