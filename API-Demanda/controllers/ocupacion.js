const ocupacionDAO = require('../data-access/ocupacionDAO')
const logger = require('../utilidades/logger');

/**
 * @abstract Método que permite obtener todas las ocupaciones
 * @returns {array} Retorna un arreglo de objetos de ocupaciones si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerOcupaciones = async (req, res) => {
  try {
    logger.info('Peticion para obtener ocupaciones')


    logger.info("Obteniendo el parametro activo", req.query.activo)
    const activo = req.query.activo;

    logger.info("Se valida si el parametro activo es diferente de null o undefined o vacio, para obtener las ocupaciones correspondientes activas o todas las ocupaciones" + activo)
    if (activo !== undefined && activo !== null && activo !== "") {
      logger.info("Se obtienen las ocupaciones activas")
    const ocupaciones = await ocupacionDAO.obtenerOcupaciones(activo)
    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
    if (ocupaciones === null || ocupaciones === undefined ||  ocupaciones.length === 0) {
      logger.info("No se encontraron ocupaciones")
      return res.status(404).json({
        message: 'No se encontraron ocupaciones'
      });
    }
    logger.info("Se envian las ocupaciones", ocupaciones)
    res.json(ocupaciones)
  }else{
    logger.info("Se obtienen todas las ocupaciones")
    const ocupaciones = await ocupacionDAO.obtenerOcupaciones()
    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
    if (ocupaciones === null || ocupaciones === undefined || ocupaciones.length === 0) {
      logger.info("No se encontraron ocupaciones")
       return res.status(404).json({
        message: 'No se encontraron ocupaciones'
      });
    }
    logger.info("Se envian las ocupaciones", ocupaciones)
    res.json(ocupaciones)
  }
  } catch (error) {
    logger.error('Error al obtener las ocupaciones', error)
    res.status(500).json({
      message: 'Error al realizar la consulta con bd'
    })
  }
}

/**
 * @abstract Método que permite obtener una ocupación por su id
 * @param {number} id - ID de la ocupación a obtener
 * @returns {object} Retorna el objeto de la ocupación si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerOcupacion = async (req, res) => {
  try {
    logger.info('Peticion para obtener ocupacion por id')
    const { id } = req.params

    logger.info("Se llama al metodo para obtener la ocupacion")
    const ocupacion = await ocupacionDAO.obtenerOcupacion(Number(id))

    logger.info("Se valida si la ocupacion existe")
    if (ocupacion === null || ocupacion === undefined) {
      logger.info("Ocupacion no encontrada")
      return res.status(404).json({
        message: 'Ocupación no encontrada'
      });
    }
    logger.info("Se envia la ocupacion", ocupacion)
    res.json(ocupacion)
  } catch (error) {
    logger.error('Error al obtener la ocupación', error)
    res.status(500).json({
      message: 'Error al realizar la consulta con bd'
    })
  }
}

/**
 * @abstract Método que permite crear una ocupación
 * @param {object} ocupacion - Objeto que contiene los datos de la ocupación
 * @returns {object} Retorna el objeto de la ocupación creada si la operación fue exitosa, de lo contrario lanza un error
 */
const crearOcupacion = async (req, res) => {
  try {
    logger.info('Peticion para crear ocupacion')


    logger.info("Obteniendo los datos de la ocupacion", req.body)
    const { descripcion_ocupacion, estatus_general } = req.body

    logger.info("Se llama al metodo para crear la ocupacion")
    const ocupacion = await ocupacionDAO.crearOcupacion({ descripcion_ocupacion, estatus_general })
 
    logger.info("Se envia la ocupacion creada", ocupacion)
    res.json(ocupacion)
  } catch (error) {

    logger.error('Error al crear la ocupación', error)
    res.status(500).json({
      message: 'Error al realizar la consulta con bd'
    })
  }
}

/**
 * @abstract Método que permite actualizar una ocupación
 * @param {object} ocupacion - Objeto que contiene los datos de la ocupación
 * @returns {object} Retorna el objeto de la ocupación actualizada si la operación fue exitosa, de lo contrario lanza un error
 */
const actualizarOcupacion = async (req, res) => {
  try {
    logger.info('Peticion para actualizar ocupacion por id')


    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params

    logger.info("Obteniendo los datos de la ocupacion", req.body)
    const { descripcion_ocupacion } = req.body
    const { estatus_general } = req.body

    logger.info("Se llama al metodo para actualizar la ocupacion")
    const result = await ocupacionDAO.actualizarOcupacion(Number(id), {
      descripcion_ocupacion,
      estatus_general
    })

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (!result) {

      logger.info("No se encontro la ocupacion a actualizar")
      return res.status(404).json({
        message: 'No se encontró la ocupación a actualizar'
      })
    }
    else {
     
      logger.info("Se obtiene la ocupacion actualizada")
      const ocupacion = await ocupacionDAO.obtenerOcupacion(Number(id))
      logger.info("Se envia la ocupacion actualizada", ocupacion)
      res.status(200).json(ocupacion)
    }
  } catch (error) {

    logger.error('Error al actualizar la ocupación', error)
    res.status(500).json({
      message: 'Error al realizar la consulta con bd'
    })
  }
}



const obtenerOcupacionesPaginacion = async (req, res) => {
  try {
    logger.info('Peticion para obtener ocupaciones paginadas')

    logger.info("Obteniendo los parametros pagina y total", req.query.pagina, req.query.total)
    const pagina = req.query.pagina;
    const total = req.query.total;

    logger.info("Se valida si el parametro total es igual a true, para obtener el total de ocupaciones o las ocupaciones paginadas")
    if (total === "true") {   
       logger.info("Se obtiene el total de ocupaciones")
      const result = await ocupacionDAO.obtenerTotalOcupaciones();
        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined) {

        logger.info("Error al obtener el total de ocupaciones")
        return res.status(404).json({
          message: 'Error al obtener el total de ocupaciones'
        });
      } else {

        logger.info("Se envia el total de ocupaciones")
        res.status(200).json({
          totalOcupaciones: result
        });
      }

    } else {

      logger.info("Se obtienen las ocupaciones paginadas")  
      const result = await ocupacionDAO.obtenerOcupacionesPaginacion(pagina);
        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined || result.length === 0) {
        logger.info("Error al obtener las ocupaciones")
        return res.status(404).json({
          message: 'Error al obtener las ocupaciones'
        });
      } else {
        logger.info("Se envian las ocupaciones", result)
        res.status(200).json({
          ocupaciones: result
        });
      }
    }
  } catch (error) {
    logger.error('Error al obtener las ocupaciones', error)
    res.status(500).json({
      message: 'Error al realizar la consulta con bd'
    })
  }
}


module.exports = {
  obtenerOcupaciones,
  crearOcupacion,
  obtenerOcupacion,
  actualizarOcupacion,
  obtenerOcupacionesPaginacion
}
