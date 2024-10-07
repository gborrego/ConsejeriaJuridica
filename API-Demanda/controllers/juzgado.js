const e = require('express');
const juzgadoDAO = require('../data-access/juzgadoDAO')
const logger = require('../utilidades/logger');

/**
 * @abstract Método que permite obtener todos los juzgados
 * @returns {array} Retorna un arreglo de objetos de juzgados si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerJuzgados = async (req, res) => {
  try {
    logger.info('Peticion para obtener juzgados')
     

    logger.info("Obteniendo el parametro activo", req.query.activo)
    const activo = req.query.activo;


    logger.info("Se valida si el parametro activo es diferente de null o undefined o vacio, para obtener los juzgados correspondientes activos o todos los juzgados" + activo)
    if (activo !== undefined && activo !== null && activo !== "") {

      logger.info("Se obtienen los juzgados activos")
      const juzgados = await juzgadoDAO.obtenerJuzgados(activo)
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
      if (juzgados === null || juzgados ===undefined || juzgados.length === 0) {

        logger.info("No se encontraron juzgados")
        return res.status(404).json({
          message: 'No se encontraron juzgados'
        });
      }
      logger.info("Se envian los juzgados", juzgados)
      res.json(juzgados)
    } else {

      logger.info("Se obtienen todos los juzgados")
      const juzgados = await juzgadoDAO.obtenerJuzgados()
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
      if (juzgados === null || juzgados ===undefined || juzgados.length === 0) {

        logger.info("No se encontraron juzgados")
        return res.status(404).json({
          message: 'No se encontraron juzgados'
        });
      }
      logger.info("Se envian los juzgados", juzgados)
      res.json(juzgados)
    }
  } catch (error) {
    logger.error('Error al obtener los juzgados', error)
    res.status(500).json({
      message:error.message
    })
  }
}

/**
 * @abstract Método que permite obtener un juzgado por su id
 * @param {number} id - ID del juzgado a obtener
 * @returns {object} Retorna el objeto del juzgado si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerJuzgado = async (req, res) => {
  try {
    logger.info('Peticion para obtener juzgado por id')


    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params
  
    logger.info("Se manda a llamar el metodo para obtener el juzgado por id")
    const juzgado = await juzgadoDAO.obtenerJuzgado(Number(id))
      
    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (juzgado === null || juzgado === undefined) {

      logger.info("Juzgado no encontrado")
      return res.status(404).json({
        message: 'Juzgado no encontrado'
      });
    }

    logger.info("Se envia el juzgado", juzgado)
    res.json(juzgado)
  } catch (error) {

    logger.error('Error al obtener el juzgado', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite crear un juzgado
 * @param {object} juzgado - Objeto que contiene los datos del juzgado
 * @returns {object} Retorna el objeto del juzgado creado si la operación fue exitosa, de lo contrario lanza un error
 */
const crearJuzgado = async (req, res) => {
  try {
   logger.info('Peticion para crear juzgado') 
 
    logger.info("Obteniendo los datos del juzgado", req.body)
    const { nombre_juzgado, estatus_general } = req.body

    logger.info("Se llama al metodo para crear el juzgado")
    const juzgado = await juzgadoDAO.crearJuzgado({ nombre_juzgado, estatus_general })

    logger.info("Se envia el juzgado creado", juzgado)
    res.json(juzgado)
  } catch (error) {

    logger.error('Error al crear el juzgado', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite actualizar un juzgado
 * @param {object} juzgado - Objeto que contiene los datos del juzgado
 * @returns {object} Retorna el objeto del juzgado actualizado si la operación fue exitosa, de lo contrario lanza un error
 */
const actualizarJuzgado = async (req, res) => {
  try {
    logger.info('Peticion para actualizar juzgado por id')
     

    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params

    logger.info("Obteniendo los datos del juzgado", req.body)
    const { nombre_juzgado, estatus_general } = req.body


    logger.info("Se llama al metodo para actualizar el juzgado")
    const result = await juzgadoDAO.actualizarJuzgado(Number(id), {
      nombre_juzgado, estatus_general
    })

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (result) {

      logger.info("Se obtiene el juzgado actualizado")
      const juzgado = await juzgadoDAO.obtenerJuzgado(Number(id))
      logger.info("Se envia el juzgado actualizado", juzgado)
      res.status(200).json(juzgado)
    } else {
      logger.info("No se actualizo el juzgado, los datos a actualizar son iguales a los datos actuales")
      return res.status(404).json({
        message: 'Datos a actualizar completamente iguales a los datos actuales'
      })
    }
  } catch (error) {
    logger.error('Error al actualizar el juzgado', error)
    res.status(500).json({
      message:error.message
    })
  }
}


const obtenerJuzgadosPaginacion = async (req, res) => {
  try {
    logger.info('Peticion para obtener juzgados paginados')


    logger.info("Obteniendo el parametro pagina, total", req.query.pagina, req.query.total)
    const pagina = req.query.pagina;
    const total = req.query.total;

    logger.info("Se valida si el parametro total es igual a true, para obtener el total de juzgados")
    if (total === "true") {  
      logger.info("Se obtiene el total de juzgados")
      const result = await juzgadoDAO.obtenerTotalJuzgados();

      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined) {

        logger.info("Error al obtener el total de juzgados")
        return res.status(404).json({
          message: 'Error al obtener el total de juzgados'
        });
      } else {

        logger.info("Se envia el total de juzgados")
        res.status(200).json({
          totalJuzgados: result
        });
      }

    } else {

      logger.info("Se obtienen los juzgados paginados")
      const result = await juzgadoDAO.obtenerJuzgadosPaginacion(pagina);

      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined || result.length === 0) {

        logger.info("Error al obtener los juzgados")
        return res.status(404).json({
          message: 'Error al obtener los juzgados'
        });
      } else {
       logger.info("Se envian los juzgados", result)
        res.status(200).json({
          juzgados: result
        });
      }
    }
  } catch (error) {

    logger.error('Error al obtener los juzgados paginados', error)
    res.status(500).json({
      message: error.message
    })
  }
}



module.exports = {
  obtenerJuzgados,
  obtenerJuzgado,
  crearJuzgado,
  actualizarJuzgado,
  obtenerJuzgadosPaginacion
}
