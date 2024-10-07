

const FamiliarDAO = require('../data-access/familiarDAO')
const promoventeDAO = require('../data-access/promoventeDAO')
const logger = require('../utilidades/logger');

/**
 * Función que permite crear un familiar
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con el familiar creado
 * */


const crearFamiliar = async (req, res) => {
    try {
    logger.info('Peticion para crear familiar') 
      
    logger.info("Obteniendo los datos del familiar", req.body)
        const { id_promovente, nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema } = req.body
         
        logger.info("Se llama al metodo para crear el familiar")
        const familiar = await FamiliarDAO.crearFamiliar({
            id_promovente,
            nombre,
            nacionalidad,
            parentesco,
            perteneceComunidadLGBT,
            adultaMayor,
            saludPrecaria,
            pobrezaExtrema
        })

        logger.info("Se envia el familiar creado", familiar)    
        res.json(familiar)
    } catch (error) {
        logger.error('Error al crear el familiar', error)
        res.status(500).json({
            message:error.message
        })
    }
}


/**
 * Función que permite obtener un familiar por su id
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con el familiar encontrado
 * */


const obtenerFamiliar = async (req, res) => {
    try {
        logger.info('Peticion para obtener familiar por id')


        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params


        logger.info("Se valida si el parametro id es diferente de null o undefined o vacio")
        const familiar = await FamiliarDAO.obtenerFamiliar(Number(id))

        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
        if (familiar === null || familiar === undefined) {

            logger.info("Familiar no encontrado")
            res.status(404).json({
                message: 'Familiar no encontrado'
            })
        }
        else {

            logger.info("Se envia el familiar")
            res.status(200).json(familiar)
        }
    } catch (error) {


        logger.error('Error al obtener el familiar', error)
        res.status(500).json({
            message: error.message
        })
    }
}

/**
 * Función que permite actualizar un familiar
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @returns {Object} Objeto con el familiar actualizado
 * */



const actualizarFamiliar = async (req, res) => {
    try {
        logger.info('Peticion para actualizar familiar por id')


        logger.info("Obteniendo el parametro id", req.params.id)
        const { id } = req.params

        
        logger.info("Obteniendo los datos del familiar", req.body)
        const { id_promovente, nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema } = req.body
        
        logger.info("Se llama al metodo para actualizar el familiar")
        const result= await FamiliarDAO.actualizarFamiliar(Number(id), {
            id_promovente,
            nombre,
            nacionalidad,
            parentesco,
            perteneceComunidadLGBT,
            adultaMayor,
            saludPrecaria,
            pobrezaExtrema
        })
    
        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
        if (result) {

            logger.info("Familiar actualizado", result)
            res.status(200).json({
                message: 'Familiar actualizado'

            })
        }
        else {

            logger.info("Familiar no actualizado,datos iguales")
            res.status(404).json({
                message: 'Familiar no actualizado,datos iguales'
            })
        }
    } catch (error) {

        logger.error('Error al actualizar el familiar', error)
        res.status(500).json({
            message: error.message
        })
    }
}

const obtenerFamiliaresPorPromovente = async (req, res) => {

    try {
        logger.info('Peticion para obtener familiares por promovente')



        logger.info("Obteniendo los parametros, id_promovente, total y pagina", req.query.id_promovente, req.query.total, req.query.pagina)
        let {id_promovente, total, pagina} = req.query
        const totalBool = total === 'true'
         id_promovente = parseInt(id_promovente, 10) || null
         pagina = parseInt(pagina, 10) || 1

         logger.info("Se manda a llama el metodo para obtener familiares por promovente paginados, total:", totalBool, "pagina:", pagina, "id_promovente:", id_promovente)
        const result = await FamiliarDAO.obtenerFamiliarPorPromovente(id_promovente || null, totalBool, pagina)

        logger.info("Se valida si el resultado de la consulta es diferente de null o undefined")
        if (!result || (Array.isArray(result) && result.length === 0)) {

            logger.info("No se encontraron familiares")
            return res.status(404).json({ message: 'No se encontraron familiares' })
        }

        logger.info("Se envian los familiares o el total de familiares")
        const responseKey = totalBool
            ? 'totalFamiliares'
            : 'familiares'
        res.status(200).json({ [responseKey]: result })

    } catch (error) {
        logger.error('Error al obtener los familiares por promovente', error)
        res.status(500).json({
            message: error.message
        })
    }
}

/**
 * Exporta todos los módulos
 * */


module.exports = {
    crearFamiliar,
    obtenerFamiliar,
    actualizarFamiliar,
    obtenerFamiliaresPorPromovente
}





