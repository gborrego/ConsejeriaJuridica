



const observacionDAO = require('../data-access/observacionDAO')
const logger = require('../utilidades/logger');

/**
 * Función que permite crear una observacion
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con la observacion creada
 * */


const crearObservacion = async (req, res) => {
    try {
        logger.info('Peticion para crear observacion')
        
        
        logger.info("Obteniendo los datos de la observacion", req.body)
        const { id_proceso_judicial, observacion } = req.body

            logger.info("Se llama al metodo para crear la observacion")
        const observacion_creada = await observacionDAO.crearObservacion({
            id_proceso_judicial,
            observacion
        })

        logger.info("Se envia la observacion creada", observacion_creada)
        res.status(200).json(observacion_creada)
    } catch (error) {

        logger.error('Error al crear la observacion', error)
        res.status(500).json({
            message: error.message
        })
    }
}


/**
 * Función que permite obtener una observacion por su id
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con la observacion encontrada
 * */


const obtenerObservacion = async (req, res) => {
    try {
        logger.info('Peticion para obtener observacion por id') 

        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params


        logger.info("Se llama al metodo para obtener la observacion")
        const observacion = await observacionDAO.obtenerObservacion(Number(id))

        logger.info("Se valida si la observacion existe")
        if (observacion === null || observacion === undefined) {

            logger.info("Observacion no encontrada")
            res.status(404).json({
                message: 'Observacion no encontrada'
            })
        }
        else {

            logger.info("Se envia la observacion", observacion)
            res.status(200).json(observacion)
        }

    } catch (error) {
        logger.error('Error al obtener la observacion', error)
        res.status(500).json({
            message: error.message
        })
    }
}

/**
 * Función que permite actualizar una observacion
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con la observacion actualizada
 * */




const actualizarObservacion = async (req, res) => {
    try {
         logger.info('Peticion para actualizar observacion por id')


        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params

        logger.info("Obteniendo los datos de la observacion", req.body)
        const { observacion, id_proceso_judicial } = req.body

        logger.info("Se llama al metodo para actualizar la observacion")
        const result = await observacionDAO.actualizarObservacion(Number(id), {
            observacion, id_proceso_judicial
        })

        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
        if (result) {

            logger.info("Observacion actualizada")
            res.status(200).json({
                message: 'Observacion actualizada'
            })
        }
        else {
            logger.info("Observacion no actualizada,datos iguales")
            res.status(404).json({
                message: 'Observacion no actualizada,datos iguales'
            })
        }
    } catch (error) {
        logger.error('Error al actualizar la observacion', error)
        res.status(500).json({
            message: error.message
        })
    }
}

 const obtenerObservacionesPorProcesoJudicial = async (req, res) => { 
    try {
        logger.info('Peticion para obtener observaciones por id_proceso_judicial')


        logger.info("Obteniendo los datos de la observacion, total, pagina y id_proceso_judicial", req.query.id_proceso_judicial, req.query.total, req.query.pagina)
        let {id_proceso_judicial, total, pagina} = req.query;
        const totalBool = total === 'true';
        id_proceso_judicial = parseInt(id_proceso_judicial, 10) || null;
        pagina = parseInt(pagina, 10) || 1;

        logger.info("Se llama al metodo para obtener las observaciones por id_proceso_judicial paginadas")
        const result = await observacionDAO.obtenerObservacionesPorProcesoJudicial(id_proceso_judicial || null, totalBool, pagina);
       
        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
        if (!result || (Array.isArray(result) && result.length === 0)) {
            logger.info('No se encontraron observaciones')
            return res.status(404).json({ message: 'No se encontraron observaciones' });
        }

        logger.info('Se envian las observaciones o el total de observaciones');
        const responseKey = totalBool ? 'totalObservaciones' : 'observaciones';
        res.status(200).json({ [responseKey]: result });
    }
    catch (error) {
        logger.error('Error al obtener las observaciones por id_proceso_judicial', error)
        res.status(500).json({ message: error.message });
    }


}


// Exportación de funciones



module.exports = {

    crearObservacion,
    obtenerObservacion,
    actualizarObservacion,
    obtenerObservacionesPorProcesoJudicial
}

