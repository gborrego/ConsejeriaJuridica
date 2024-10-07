const escolaridadDAO = require('../data-access/escolaridadDAO')
const logger = require('../utilidades/logger');

/**
 * @abstract Método que permite obtener todas las escolaridades
 * @returns {array} Retorna un arreglo de objetos de escolaridades si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerEscolaridades = async (req, res) => {
  try {
    logger.info('Peticion para obtener escolaridades')

    logger.info("Obteniendo el parametro activo", req.query.activo)
    const activo = req.query.activo;

    logger.info("Se valida si el parametro activo es diferente de null o undefined o vacio, para obtener las escolaridades correspondientes activas o todas las escolaridades" + activo)
    if (activo !== undefined && activo !== null && activo !== "") {
      logger.info("Se obtienen las escolaridades activas")
      const escolaridades = await escolaridadDAO.obtenerEscolaridades(activo)
       
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
      if (escolaridades === null || escolaridades === undefined || escolaridades.length === 0) {
        logger.info("No se encontraron escolaridades")
        return res.status(404).json({
          message: 'No se encontraron escolaridades'
        });
      }
      logger.info("Se envian las escolaridades")
      res.json(escolaridades)
    } else {
      logger.info("Se obtienen todas las escolaridades")
      const escolaridades = await escolaridadDAO.obtenerEscolaridades()
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
      if (escolaridades === null || escolaridades === undefined || escolaridades.length === 0) {
        logger.info("No se encontraron escolaridades")
        return res.status(404).json({
          message: 'No se encontraron escolaridades'
        });
      }
      logger.info("Se envian las escolaridades")
      res.json(escolaridades)
    }

  } catch (error) {
    logger.error('Error al obtener las escolaridades', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite obtener una escolaridad por su id
 * @param {number} id - ID de la escolaridad a obtener
 * @returns {object} Retorna el objeto de la escolaridad si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerEscolaridad = async (req, res) => {
  try {
     logger.info('Peticion para obtener escolaridad por id')

     logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params

    logger.info("Se valida si el parametro id es diferente de null o undefined o vacio")
    const escolaridad = await escolaridadDAO.obtenerEscolaridadPorId(Number(id))

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (escolaridad === null || escolaridad === undefined) {

      logger.info("Escolaridad no encontrada")
      res.status(404).json({
        message: 'Escolaridad no encontrada'
      })
    }
    else {

      logger.info("Se envia la escolaridad")
      res.status(200).json(escolaridad)
    }
  } catch (error) {

    logger.error('Error al obtener la escolaridad', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite crear una escolaridad
 * @param {object} escolaridad - Objeto que contiene los datos de la escolaridad
 * @returns {object} Retorna el objeto de la escolaridad creada si la operación fue exitosa, de lo contrario lanza un error
 */
const crearEscolaridad = async (req, res) => {
  try {
    logger.info('Peticion para crear escolaridad')
 
    logger.info("Obteniendo los datos de la escolaridad", req.body)
    const { descripcion, estatus_general } = req.body

    logger.info("Se valida si la descripcion es diferente de null o undefined o vacio")
    const escolaridad = await escolaridadDAO.crearEscolaridad({ descripcion, estatus_general })
     
    logger.info("Se envia la escolaridad")
    res.json(escolaridad) 
  } catch (error) {

    logger.error('Error al crear la escolaridad', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite actualizar una escolaridad
 * @param {object} escolaridad - Objeto que contiene los datos de la escolaridad
 * @returns {object} Retorna el objeto de la escolaridad actualizada si la operación fue exitosa, de lo contrario lanza un error
 */
const actualizarEscolaridad = async (req, res) => {
  try {
    logger.info('Peticion para actualizar escolaridad')


    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params

    logger.info("Obteniendo los datos de la escolaridad", req.body)
    const { descripcion, estatus_general } = req.body

    logger.info("Se valida si la descripcion es diferente de null o undefined o vacio")
    const result = await escolaridadDAO.actualizarEscolaridad(Number(id), { descripcion, estatus_general })

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (result) {
      logger.info("Se obtiene la escolaridad actualizada")
      const escolaridad = await escolaridadDAO.obtenerEscolaridadPorId(Number(id))
      res.status(200).json(escolaridad)
    } else {
      logger.info("Escolaridad no actualizada,ya que son los mismos datos")
      res.status(404).json({
        message: 'Escolaridad no actualizada,ya que son los mismos datos'
      })
    }

  } catch (error) {

    logger.error('Error al actualizar la escolaridad', error)
    res.status(500).json({
      message: error.message
    })
  }
}



const obtenerEscolaridadesPaginacion = async (req, res) => {
  try {

    logger.info('Peticion para obtener escolaridades paginadas')  

    logger.info("Obteniendo el parametro pagina y total", req.query.pagina, req.query.total)
    const pagina = req.query.pagina;
    const total = req.query.total;

    logger.info("Se valida si el parametro total es igual a true, para obtener el total de escolaridades")
    if (total === "true") {      
      logger.info("Se obtiene el total de escolaridades") 
      const result = await escolaridadDAO.obtenerTotalEscolaridades();
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined) {
        logger.info("Error al obtener el total de escolaridades")
        return res.status(404).json({
          message: 'Error al obtener el total de escolaridades'
        });
      } else {
        logger.info("Se envia el total de escolaridades")
        res.status(200).json({
          totalEscolaridades: result
        });
      }

    } else {
      logger.info("Se obtienen las escolaridades paginadas")
      const result = await escolaridadDAO.obtenerEscolaridadesPaginacion(pagina);
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined || result.length === 0) {
        logger.info("Error al obtener las escolaridades")
        return res.status(404).json({
          message: 'Error al obtener las escolaridades'
        });
      } else {
        logger.info("Se envian las escolaridades")
        res.status(200).json({
          escolaridades: result
        });
      }
    }
  } catch (error) {
    logger.error('Error al obtener las escolaridades paginadas', error)
    res.status(500).json({
      message: error.message
    })
  }
}


module.exports = {
  obtenerEscolaridades,
  crearEscolaridad,
  obtenerEscolaridad,
  actualizarEscolaridad,
  obtenerEscolaridadesPaginacion
}
