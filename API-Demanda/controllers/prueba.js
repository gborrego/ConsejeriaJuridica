

  const PruebaDAO = require('../data-access/pruebaDAO')
  const logger = require('../utilidades/logger');

  /** 
   * Función que permite crear una prueba
   * @param {Object} req Objeto de petición
   *  @param {Object} res Objeto de respuesta
   * @returns {Object} Objeto con la prueba creada
   * */
  
 
    const crearPrueba = async (req, res) => {
      try {
         logger.info('Peticion para crear prueba')

        logger.info("Obteniendo los datos de la prueba", req.body)
        const { descripcion_prueba,  id_proceso_judicial } = req.body

        logger.info("Se llama al metodo para crear la prueba")
        const prueba = await PruebaDAO.crearPrueba({
          descripcion_prueba,
          id_proceso_judicial
        })

        logger.info("Se envia la prueba creada", prueba)
        res.json(prueba)
      } catch (error) {

        logger.error('Error al crear la prueba', error)
        res.status(500).json({
          message:error.message
        })
      }
    }

    
    /**
     * Función que permite obtener una prueba por su id
     * @param {Object} req Objeto de petición
     * @param {Object} res Objeto de respuesta
     * @returns {Object} Objeto con la prueba encontrada
     * */

    const obtenerPrueba = async (req, res) => {
      try {
      logger.info('Peticion para obtener prueba por id')
         

        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params

        logger.info("Se llama al metodo para obtener la prueba")
        const prueba = await PruebaDAO.obtenerPrueba(Number(id))

        logger.info("Se valida si la prueba existe")
        if(prueba===null || prueba===undefined){
          logger.info("No se encontro la prueba")
          res.status(404).json({
            message: 'Prueba no encontrada'
          })
        }else{

          logger.info("Se envia la prueba encontrada", prueba)
          res.status(200).json(prueba)
        }
        
      } catch (error) {
        res.status(500).json({
          message: error.message
        })
      }
    }
/**
 * Función que permite actualizar una prueba
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con la prueba actualizada
 * */


    const actualizarPrueba = async (req, res) => {
      try {
        logger.info('Peticion para actualizar prueba por id')


        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params

        logger.info("Obteniendo los datos de la prueba", req.body)
        const { descripcion_prueba , id_proceso_judicial } = req.body

        logger.info("Se llama al metodo para actualizar la prueba")
       const result= await PruebaDAO.actualizarPrueba(Number(id), {
         descripcion_prueba,id_proceso_judicial
        })


        logger.info("Se valida si la prueba fue actualizada")
        if (result) {

           logger.info("Se obtiene la prueba actualizada")
          const actualizado = await PruebaDAO.obtenerPrueba(Number(id))
          logger.info("Se envia la prueba actualizada", actualizado)
          res.status(201).json(actualizado)
        } else {
          logger.info("No se actualizo la prueba, los datos a actualizar son iguales a los datos actuales")
          res.status(500).json({
            message: error.message
          })
        }
      } catch (error) {

        logger.error('Error al actualizar la prueba', error)
        res.status(500).json({
          message: error.message
        })
      }
    }

const obtenerPruebasPorProcesoJudicial = async (req, res) => {
 
  try {
    logger.info('Peticion para obtener pruebas por id_proceso_judicial')


    logger.info("Obteniendo los parametros, id_proceso_judicial, total y pagina", req.query)
    let { id_proceso_judicial, total, pagina } = req.query;
    const totalBool = total === 'true';
    id_proceso_judicial = parseInt(id_proceso_judicial, 10) || null;
    pagina = parseInt(pagina, 10) || 1;

    logger.info("Se llama al metodo para obtener las pruebas por id_proceso_judicial paginados o el total de pruebas")
    const result = await PruebaDAO.obtenerPruebasPorProcesoJudicial(id_proceso_judicial || null, totalBool, pagina);

    logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
    if (!result || (Array.isArray(result) && result.length === 0)) {

      logger.info("No se encontraron pruebas")
      return res.status(404).json({ message: 'No se encontraron pruebas' });
    }

    logger.info("Se envia el total de pruebas o las pruebas encontradas", result)
    const responseKey = totalBool ? 'totalPruebas' : 'pruebas';
    res.status(200).json({ [responseKey]: result });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

    

    // Exportar todas las funciones
    module.exports = {
      crearPrueba,
      obtenerPrueba,
      actualizarPrueba,
      obtenerPruebasPorProcesoJudicial
    }

