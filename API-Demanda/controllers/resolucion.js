

const ResolucionDAO = require('../data-access/resolucionDAO')
const logger = require('../utilidades/logger');

/** 
 * Función que permite crear una resolucion
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con la resolucion creada
 * */

const crearResolucion = async (req, res) => {
    try {
        logger.info('Peticion para crear resolucion')

        logger.info("Obteniendo los datos de la resolucion", req.body)

        const { id_proceso_judicial, resolucion, fecha_resolucion } = req.body
      
    logger.info("Se llama al metodo para crear la resolucion")  
         const resolucionCreado = await ResolucionDAO.crearResolucion({
            id_proceso_judicial,
            resolucion,
            fecha_resolucion
        })

        logger.info("Se envia la resolucion creada", resolucionCreado)
        res.status(201).json(resolucionCreado)
    } catch (error) {
        logger.error('Error al crear la resolucion', error)
        res.status(500).json({
            message: error.message
        })
    }
}



/**
 * Función que permite obtener una resolucion por su id
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con la resolucion encontrada
 * */

const obtenerResolucion = async (req, res) => {
    try {
        logger.info('Peticion para obtener resolucion por id')


        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params

        logger.info("Se llama al metodo para obtener la resolucion")
        const resolucion = await ResolucionDAO.obtenerResolucion(Number(id))

        logger.info("Se valida si la resolucion existe")
        if (resolucion === null || resolucion === undefined) {
            logger.info("No se encontro la resolucion")
            res.status(404).json({
                message: 'Resolucion no encontrada'
            })
        } else {
            logger.info("Se envia la resolucion", resolucion)
            res.status(200).json(resolucion)
        }
    } catch (error) {
        logger.error('Error al obtener la resolucion', error)
        res.status(500).json({
            message: error.message
        })
    }
}

/**
 * Función que permite actualizar una resolucion
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con la resolucion actualizada
 * */

const actualizarResolucion = async (req, res) => {
    try {
        logger.info('Peticion para actualizar resolucion por id')


        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params

        logger.info("Obteniendo los datos de la resolucion", req.body)
        const { resolucion, fecha_resolucion } = req.body

        logger.info("Se llama al metodo para actualizar la resolucion")
        const result = await ResolucionDAO.actualizarResolucion(Number(id), {
            resolucion,
            fecha_resolucion
        })

        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
        if (result) {
            logger.info("Se obtiene la resolucion actualizada")
            const actualizado = await ResolucionDAO.obtenerResolucion(Number(id))
            logger.info("Se envia la resolucion actualizada", actualizado)
            res.status(201).json(actualizado)
        } else {
            logger.info("No se actualizo la resolucion, los datos a actualizar son iguales a los datos actuales")
            res.status(500).json({
                message: 'Error al realizar la actualizacion de la resolucion, datos iguales'
            })
        }
    } catch (error) {
        logger.error('Error al actualizar la resolucion', error)
        res.status(500).json({
            message: error.message
        })
    }
}

const obtenerResolucionesPorProcesoJudicial = async (req, res) => {

    try {
      logger.info('Peticion para obtener resoluciones por id_proceso_judicial')
         

        logger.info("Obteniendo los parametros, id_proceso_judicial, total y pagina", req.query)
        let { id_proceso_judicial, total, pagina } = req.query;
        const totalBool = total === 'true';
        id_proceso_judicial = parseInt(id_proceso_judicial, 10) || null;
        pagina = parseInt(pagina, 10) || 1;

        logger.info("Se llama al metodo para obtener las resoluciones por id_proceso_judicial paginados o el total de resoluciones")
        const result = await ResolucionDAO.obtenerResolucionesPorProcesoJudicial(id_proceso_judicial || null, totalBool, pagina);
        
        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
        if (!result || (Array.isArray(result) && result.length === 0)) {

            logger.info("No se encontraron resoluciones")
            return res.status(404).json({ message: 'No se encontraron resoluciones' });
        }

        logger.info("Se envian las resoluciones o el total de resoluciones")
        const responseKey = totalBool ? 'totalResoluciones' : 'resoluciones';
        res.status(200).json({ [responseKey]: result });
    }
    catch (error) {
        logger.error('Error al obtener las resoluciones por id_proceso_judicial', error)
        res.status(500).json({ message: error.message });
    }

}

// Exportar todas las funciones
module.exports = {
    crearResolucion,
    obtenerResolucion,
    actualizarResolucion,
    obtenerResolucionesPorProcesoJudicial
}