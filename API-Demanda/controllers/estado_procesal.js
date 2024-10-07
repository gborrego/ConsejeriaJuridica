const e = require('express')
const estado_procesalDAO = require('../data-access/estado_procesalDAO')

const logger = require('../utilidades/logger');

/**
 * @abstract Método que permite obtener un estado procesal por su id
 * @param {number} id - ID del estado procesal a obtener
 * @returns {object} Retorna el objeto del estado procesal si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerEstadoProcesal = async (req, res) => {
  try {
    logger.info('Peticion para obtener estado procesal por id')


    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params

    logger.info("Se valida si el parametro id es diferente de null o undefined o vacio")
    const estado_procesal = await estado_procesalDAO.obtenerEstadoProcesal(Number(id))

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (estado_procesal === null || estado_procesal === undefined) {

      logger.info("No se encontro el estado procesal")
      return res.status(404).json({
        message: 'Estado procesal no encontrado'
      });
    }

    logger.info("Se envia el estado procesal")
    res.json(estado_procesal)
  } catch (error) {

    logger.error('Error al obtener el estado procesal', error)
  //  console.log(error)
    res.status(500).json({
      message:error.message
    })
  }
}



/**
 * @abstract Método que permite crear un estado procesal
 * @param {object} estado_procesal - Objeto que contiene los datos del estado procesal
 * @returns {object} Retorna el objeto del estado procesal creado si la operación fue exitosa, de lo contrario lanza un error
 */
const crearEstadoProcesal = async (req, res) => {
  try {
    logger.info('Peticion para crear estado procesal')


    logger.info("Obteniendo los datos del estado procesal", req.body)
    const { descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial } = req.body

    logger.info("Se llama al metodo para crear el estado procesal")
    const estado_procesal = await estado_procesalDAO.crearEstadoProcesal({ descripcion_estado_procesal, fecha_estado_procesal, id_proceso_judicial })
    
    logger.info("Se envia el estado procesal")
    res.json(estado_procesal)
  } catch (error) {

    logger.error('Error al crear el estado procesal', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite actualizar un estado procesal
 * @param {object} estado_procesal - Objeto que contiene los datos del estado procesal
 * @returns {object} Retorna el objeto del estado procesal actualizado si la operación fue exitosa, de lo contrario lanza un error
 */
const actualizarEstadoProcesal = async (req, res) => {
  try {
    logger.info('Peticion para actualizar estado procesal')


    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params

    logger.info("Obteniendo los datos del estado procesal", req.body)
    const { id_estado_procesal, ...data } = req.body

    logger.info("Se llama al metodo para actualizar el estado procesal")
    const result= await estado_procesalDAO.actualizarEstadoProcesal(Number(id), data)

    logger.info("Se valida si el resultado de la actualizacion es diferente de null o undefined")
    if(result) {
      logger.info("Se obtiene el estado procesal actualizado")
      const actualizado = await estado_procesalDAO.obtenerEstadoProcesal(Number(id))

      logger.info("Se envia el estado procesal actualizado")
      return res.status(201).json(actualizado)


    }else{
      logger.info("Error al realizar la actualizacion del estado procesal, datos iguales")
      return res.status(500).json({ message: 'Error al realizar la actualizacion del estado procesal, datos iguales' })
    }
    
  } catch (error) {

    logger.error('Error al actualizar el estado procesal', error)
    res.status(500).json({
      message: error.message
    })
  }
}

const obtenerEstadosProcesalesPorProcesoJudicial = async (req, res) => {
  try {

    logger.info('Peticion para obtener estados procesales por proceso judicial')


    logger.info("Obteniendo los parametros", req.query)
    let { id_proceso_judicial, total, pagina } = req.query
    
    ;
    const totalBool = total === 'true';
    id_proceso_judicial = parseInt(id_proceso_judicial, 10) || null;
    pagina = parseInt(pagina, 10) || 1;
    logger.info('Obteniendo estados procesales por proceso judicia paginados, total:', totalBool, 'pagina:', pagina, 'id_proceso_judicial:', id_proceso_judicial);  
    const result = await estado_procesalDAO.obtenerEstadoProcesalPorProcesoJudicial(id_proceso_judicial || null, totalBool, pagina);

    logger.info('Se valida si el resultado de la consulta es diferente de null o undefined')
    if (!result || (Array.isArray(result) && result.length === 0)) {

      logger.info('No se encontraron estados procesales')
      return res.status(404).json({ message: 'No se encontraron estados procesales' });
    }
    logger.info('Se envian los estados procesales o el total de estados procesales')
    const responseKey = totalBool ? 'totalEstadosProcesales' : 'estadosProcesales';
    res.status(200).json({ [responseKey]: result });
  } catch (error) {
    logger.error('Error al obtener los estados procesales por proceso judicial', error)
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  obtenerEstadoProcesal,
  crearEstadoProcesal,
  actualizarEstadoProcesal,
  obtenerEstadosProcesalesPorProcesoJudicial
}
