const etniaDAO = require('../data-access/etniaDAO')
const logger = require('../utilidades/logger');

/**
 * @abstract Método que permite obtener todas las etnias
 * @returns {array} Retorna un arreglo de objetos de etnias si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerEtnias = async (req, res) => {
  try {

    logger.info('Peticion para obtener etnias')


    logger.info("Obteniendo el parametro activo", req.query.activo)
    const activo = req.query.activo;


    logger.info("Se valida si el parametro activo es diferente de null o undefined o vacio, para obtener las etnias correspondientes activas o todas las etnias" + activo)
    if (activo !== undefined && activo !== null && activo !== "") {
      logger.info("Se obtienen las etnias activas")
      const etnias = await etniaDAO.obtenerEtnias(activo)
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
      if ( etnias === null || etnias === undefined ||  etnias.length === 0) {

        logger.info("No se encontraron etnias")
        return res.status(404).json({
          message: 'No se encontraron etnias'
        });

      }

      logger.info("Se envian las etnias")
      res.json(etnias)
    } else {
      logger.info("Se obtienen todas las etnias")
      const etnias = await etniaDAO.obtenerEtnias()
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined o vacio")
      if (etnias === null || etnias === undefined ||  etnias.length === 0) {
        logger.info("No se encontraron etnias")
         return res.status(404).json({
          message: 'No se encontraron etnias'
        });
      }
      logger.info("Se envian las etnias")
      res.json(etnias)
    }
  } catch (error) {
    logger.error('Error al obtener las etnias', error)
    res.status(500).json({
      message:error.message
    })
  }
}

/**
 * @abstract Método que permite obtener una etnia por su id
 * @param {number} id - ID de la etnia a obtener
 * @returns {object} Retorna el objeto de la etnia si la operación fue exitosa, de lo contrario lanza un error
 */
const obtenerEtnia = async (req, res) => {
  try {

    logger.info('Peticion para obtener etnia por id')


    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params
 
    logger.info("Se manada a llamar el metodo para obtener la etnia")
    const etnia = await etniaDAO.obtenerEtnia(Number(id))

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (etnia === null || etnia === undefined) {
      logger.info("No se encontro la etnia")
      return res.status(404).json({
        message: 'Etnia no encontrada'
      });
    }
    logger.info("Se envia la etnia", etnia)
    res.json(etnia)
  } catch (error) {
    logger.error('Error al obtener la etnia', error)
     res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite crear una etnia
 * @param {object} etnia - Objeto que contiene los datos de la etnia
 * @returns {object} Retorna el objeto de la etnia creada si la operación fue exitosa, de lo contrario lanza un error
 */
const crearEtnia = async (req, res) => {
  try { 
    logger.info('Peticion para crear etnia')  

    logger.info("Obteniendo los datos de la etnia", req.body)
    const { nombre, estatus_general } = req.body

    logger.info("Se llama al metodo para crear la etnia")
    const etnia = await etniaDAO.crearEtnia({ nombre, estatus_general })
     
    logger.info("Se envia la etnia creada", etnia)
    res.json(etnia)
  } catch (error) {
    logger.error('Error al crear la etnia', error)
    res.status(500).json({
      message: error.message
    })
  }
}

/**
 * @abstract Método que permite actualizar una etnia
 * @param {object} etnia - Objeto que contiene los datos de la etnia
 * @returns {object} Retorna el objeto de la etnia actualizada si la operación fue exitosa, de lo contrario lanza un error
 */
const actualizarEtnia = async (req, res) => {
  try {
    logger.info('Peticion para actualizar etnia por id')


    logger.info("Obteniendo el parametro id", req.params.id)
    const { id } = req.params

    logger.info("Obteniendo los datos de la etnia", req.body)
    const { nombre, estatus_general } = req.body

    logger.info("Se llama al metodo para actualizar la etnia")
    const result = await etniaDAO.actualizarEtnia(Number(id), {
      nombre, estatus_general
    })


    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (!result) {

      logger.info("No se encontro la etnia")
      return res.status(404).json({
        message: error.message
      })
    } else {

      logger.info("Se obtiene la etnia actualizada")
      const actualizado = await etniaDAO.obtenerEtnia(Number(id))
      logger.info("Se envia la etnia actualizada", actualizado)
      res.status(200).json(actualizado)
    }
  } catch (error) {
    logger.error('Error al actualizar la etnia', error)
    res.status(500).json({
      message: error.message
    })
  }
}

const obtenerEtniasPaginacion = async (req, res) => {
  try {
   logger.info('Peticion para obtener etnias paginadas')  

    logger.info("Obteniendo el parametro pagina y total", req.query.pagina, req.query.total)
    const pagina = req.query.pagina;
    const total = req.query.total;

    logger.info("Se valida si el parametro total es diferente de null o undefined o vacio, para obtener el total de etnias o las etnias paginadas")
    if (total === "true") {    
      logger.info("Se obtiene el total de etnias")
      const result = await etniaDAO.obtenerTotalEtnias();
      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined) {

        logger.info("Error al obtener el total de etnias")
        return res.status(404).json({
          message: 'Error al obtener el total de etnias'
        });
      } else {

        logger.info("Se envia el total de etnias")
        res.status(200).json({
          totalEtnias: result
        });
      }

    } else {

      logger.info("Se obtienen las etnias paginadas")
      const result = await etniaDAO.obtenerEtniasPaginacion(pagina);

      logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
      if (result === null || result === undefined || result.length === 0) {
        logger.info("Error al obtener las etnias")
        return res.status(404).json({
          message: 'Error al obtener las etnias'
        });
      } else {
        logger.info("Se envian las etnias", result)
        res.status(200).json({
          etnias: result
        });
      }
    }
  } catch (error) {

    logger.error('Error al obtener las etnias paginadas', error)
    res.status(500).json({
      message: error.message
    })
  }
}




module.exports = {
  obtenerEtnias,
  obtenerEtnia,
  crearEtnia,
  actualizarEtnia,
  obtenerEtniasPaginacion
}
