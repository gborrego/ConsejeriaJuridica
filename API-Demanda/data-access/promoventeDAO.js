const Promovente = require('../models/promovente')
const etniaDAO = require('../data-access/etniaDAO')
const escolaridadDAO = require('../data-access/escolaridadDAO')
const ocupacionDAO = require('../data-access/ocupacionDAO')
const familiarDAO = require('../data-access/familiarDAO')
const logger = require('../utilidades/logger');

class PromoventeDAO {
  /**
 * @abstract Método que permite crear un promovente en la base de datos
 * @param {object} promovente - Objeto que contiene los datos del promovente
 * @returns {object} Retorna el objeto del promovente creado si la operación fue exitosa, de lo contrario lanza un error
 */
  async crearPromovente({id_promovente, español, id_escolaridad, id_etnia, id_ocupacion }) {
    try {
       logger.info("Creando de promovente", { id_promovente, español, id_escolaridad, id_etnia, id_ocupacion })
      const promovente = await Promovente.create({ id_promovente, español, id_escolaridad, id_etnia, id_ocupacion })
      logger.info("Promovente creado", { promovente })
      return promovente
    } catch (err) {
      logger.error("Error al crear promovente", { error: err.message })
      //console.log(err.message)
      throw err
    }
  }



  /**
 * @abstract Método que permite obtener un promovente de la base de datos por su id
 * @param {number} id - ID del promovente a obtener
 * @returns {object} Retorna el objeto del promovente si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerPromovente(id) {
    try {
      logger.info("Obteniendo promovente por ID", { id })

      const promovente = await Promovente.findByPk(id)
       if (!promovente) {
        logger.info("No se encontró el promovente")
        throw new Error("No se encontró el promovente")
      }

      logger.info("Promovente obtenido", { promovente })

      const promvente_obejct =  JSON.parse(JSON.stringify(promovente))
      
      logger.info("Obteniendo etnia por promovente", { id_etnia: promvente_obejct.id_etnia })
      const etnia =  await etniaDAO.obtenerEtnia(promvente_obejct.id_etnia)
      logger.info("Obteniendo escolaridad por promovente", { id_escolaridad: promvente_obejct.id_escolaridad })
      const escolaridad =  await escolaridadDAO.obtenerEscolaridadPorId(promvente_obejct.id_escolaridad)
      logger.info("Obteniendo ocupacion por promovente", { id_ocupacion: promvente_obejct.id_ocupacion })
      const ocupacion =  await ocupacionDAO.obtenerOcupacion(promvente_obejct.id_ocupacion)
     // const familiares =  await familiarDAO.obtenerFamiliarPorPromovente(promvente_obejct.id_promovente)
      delete promvente_obejct.id_etnia
      delete promvente_obejct.id_escolaridad
      delete promvente_obejct.id_ocupacion    
      promvente_obejct.etnia = etnia
      promvente_obejct.escolaridad = escolaridad
      promvente_obejct.ocupacion = ocupacion
     // promvente_obejct.familiares = familiares
       logger.info("Promovente obtenido con etnia, escolaridad y ocupacion", { promvente_obejct })
      return promvente_obejct
    } catch (err) {
      logger.error("Error al obtener promovente por ID", { error: err.message })
      throw err
    }
  }

 async obtenerPromoventeMiddlware(id) {
    try {
      logger.info("Obteniendo promovente por ID", { id })
      const promovente = await Promovente.findByPk(id)
      if (!promovente) {
        logger.info("No se encontró el promovente")
        throw new Error("No se encontró el promovente")
      }
      logger.info("Promovente obtenido", { promovente })
      return promovente
    } catch (err) {
      logger.error("Error al obtener promovente por ID", { error: err.message })
      throw err
    }
 }

  /**
 * @abstract Método que permite actualizar un promovente en la base de datos
 * @param {number} idParticipante - ID del participante a actualizar
 * @param {object} promovente - Objeto que contiene los nuevos datos del promovente
 * @returns {object} Retorna el objeto del promovente actualizado si la operación fue exitosa, de lo contrario lanza un error
 */
  async actualizarPromovente(id_promovente_actualizar, { espanol, id_escolaridad, id_etnia, id_ocupacion }) {
    try {
      logger.info("Actualizando promovente", { id_promovente_actualizar, espanol, id_escolaridad, id_etnia, id_ocupacion })
      const promoventeActualizado = await Promovente.update({  espanol, id_escolaridad, id_etnia, id_ocupacion }, { where: { id_promovente: id_promovente_actualizar }  })
      logger.info("Promovente actualizado retonando resultado", { result: promoventeActualizado[0] === 1 })
       return promoventeActualizado[0] ==1
    } catch (err) {     // console.log(err.message)
      logger.error("Error al actualizar promovente", { error: err.message })  
      throw err
    }
  }


}

module.exports = new PromoventeDAO()
