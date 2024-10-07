const procesoJudicialDAO = require('../data-access/proceso_judicialDAO')

const logger = require('../utilidades/logger');




/**
 * @abstract Método que permite crear un proceso judicial
 * @param {object} procesoJudicial - Objeto que contiene los datos del proceso judicial
 * @returns {object} Retorna el objeto del proceso judicial creado si la operación fue exitosa, de lo contrario lanza un error
 */
const crearProcesoJudicial = async (req, res) => {
  try {
   
    logger.info('Peticion para crear proceso judicial')


    logger.info("Obteniendo los datos del proceso judicial", req.body)
    const { turno, promovente, demandado, proceso } = req.body

    logger.info("Se llama al metodo para crear el proceso judicial")
    const procesoJudicial = await procesoJudicialDAO.crearProcesoJudicial({
      turno, promovente, demandado, proceso
    })

    logger.info("Se envia el proceso judicial creado", procesoJudicial)
    res.json(procesoJudicial)
  } catch (error) {

    logger.error('Error al crear el proceso judicial', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite obtener todos los procesos judiciales
 * @returns {array} Retorna un arreglo de objetos de procesos judiciales si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerProcesosJudiciales = async (req, res) => {
  try {

     logger.info('Peticion para obtener procesos judiciales')


     logger.info("Se llama al metodo para obtener los procesos judiciales")
    const procesosJudiciales = await procesoJudicialDAO.obtenerProcesosJudiciales()

     logger.info("Se valida si hay procesos judiciales")
    if (procesosJudiciales === null || procesosJudiciales.length === 0) {
        logger.info("No hay procesos judiciales registrados")
      res.status(404).json({
        message: "No hay procesos judiciales registrados"
      })
    }
    else {
      logger.info("Se envian los procesos judiciales", procesosJudiciales)
      res.status(200).json(procesosJudiciales)
    }
  } catch (error) {
    logger.error('Error al obtener los procesos judiciales', error)
    res.status(500).json({
      message: error.message
    })
  }
}
/**
 * @abstract Método que permite obtener todos los procesos judiciales por defensor
 * @returns {array} Retorna un arreglo de objetos de procesos judiciales si la operación fue exitosa, de lo contrario lanza un error
 */


const obtenerProcesosJudicialesBusqueda = async (req, res) => {
  try {
   logger.info('Peticion para obtener procesos judiciales por busqueda')  


   logger.info("Obteniendo los datos de la busqueda", req.query)
    let { id_defensor, id_distrito_judicial, total, pagina, estatus_proceso } = req.query;
    const totalBool = total === 'true';

    pagina = parseInt(pagina, 10) || 1;
    id_defensor = parseInt(id_defensor, 10) || null;
    id_distrito_judicial = parseInt(id_distrito_judicial, 10) || null;
    

    logger.info("Se llama al metodo para obtener los procesos judiciales por busqueda ya sea por defensor o distrito judicial y obtener el total de procesos judiciales o los procesos judiciales paginados")
    const result = await procesoJudicialDAO.obtenerProcesosJudicialesBusqueda(id_defensor, id_distrito_judicial, totalBool, pagina, estatus_proceso);

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
    if (!result || (Array.isArray(result) && result.length === 0)) {
      logger.info("No hay procesos judiciales registrados")
      return res.status(404).json({ message: "No hay procesos judiciales registrados" });
    }
    
    logger.info("Se envian los procesos judiciales o el total de procesos judiciales", result)
    const responseKey = totalBool ? 'totalProcesosJudiciales' : 'procesosJudiciales';
    res.status(200).json({ [responseKey]: result });
  } catch (error) {

    logger.error('Error al obtener los procesos judiciales por busqueda', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite obtener un proceso judicial por su id
 * @param {number} id - ID del proceso judicial a obtener
 * @returns {object} Retorna el objeto del proceso judicial si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerProcesoJudicial = async (req, res) => {
  try {
    logger.info('Peticion para obtener proceso judicial por id')
 
    logger.info("Obteniendo el id del proceso judicial", req.params)


    const { id } = req.params
     
    logger.info("Se llama al metodo para obtener el proceso judicial")
    const procesoJudicial = await procesoJudicialDAO.obtenerProcesoJudicial(Number(id))
      

    logger.info("Se valida si el proceso judicial fue encontrado")
    if (procesoJudicial === null) {

      logger.info("Proceso judicial no encontrado")
      res.status(404).json({
        message: "Proceso judicial no encontrado"
      })
    }
    else {

      logger.info("Se envia el proceso judicial", procesoJudicial)
      res.status(200).json(procesoJudicial)
    }
  } catch (error) {

    logger.error('Error al obtener el proceso judicial', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite actualizar un proceso judicial
 * @param {object} procesoJudicial - Objeto que contiene los datos del proceso judicial
 * @returns {object} Retorna el objeto del proceso judicial actualizado si la operación fue exitosa, de lo contrario lanza un error
 */
const actualizarProcesoJudicial = async (req, res) => {
  try {

    logger.info('Peticion para actualizar proceso judicial por id')



    logger.info("Obteniendo el id del proceso judicial", req.params)
    const { id } = req.params


    logger.info("Obteniendo los datos del proceso judicial", req.body)
    const { promovente, demandado, proceso } = req.body


    logger.info("Se llama al metodo para actualizar el proceso judicial")
    const procesoJudicial = await procesoJudicialDAO.actualizarProcesoJudicialOficial(Number(id), {
      promovente, demandado, proceso
    })

    logger.info("Se envia el proceso judicial actualizado", procesoJudicial)
    res.json(procesoJudicial)
  } catch (error) {

    logger.error('Error al actualizar el proceso judicial', error)
    res.status(500).json({
      message: error.message
    })
  }
}


const obtenerProcesosJudicialesPorTramite = async (req, res) => {
  try {
   logger.info('Peticion para obtener procesos judiciales por tramite') 


    logger.info("Obteniendo el estatus de tramite", req.query)
    const estatus_proceso = req.query.estatus_proceso
    
    logger.info("Se llama al metodo para obtener los procesos judiciales por tramite")
    const procesosJudiciales = await procesoJudicialDAO.obtenerProcesosJudicialesPorTramite(estatus_proceso)
     
    logger.info("Se valida si hay procesos judiciales en estatus de tramite")
    if (procesosJudiciales === null || procesosJudiciales === undefined) {
      logger.info("No hay procesos judiciales en estatus de tramite")
      res.status(404).json({
        message: "No hay proceso judiciales en estatus de tramite"
      })
    }
    else {

      logger.info("Se envian los procesos judiciales en estatus de tramite", procesosJudiciales)
      res.status(200).json(procesosJudiciales)
    }
  } catch (error) {
    logger.error('Error al obtener los procesos judiciales por tramite', error)
   // console.log(error.message)
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  crearProcesoJudicial,
  obtenerProcesosJudiciales,
  obtenerProcesoJudicial,
  actualizarProcesoJudicial,
  obtenerProcesosJudicialesBusqueda
  ,
  obtenerProcesosJudicialesPorTramite
}
