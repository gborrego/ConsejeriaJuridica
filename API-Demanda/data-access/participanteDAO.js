const Participante = require('../models/participante')
const promventeDAO = require('../data-access/promoventeDAO')
const demandadoDAO = require('../data-access/demandadoDAO')
const domicilioDAO = require('../data-access/domicilio_participanteDAO')

const logger = require('../utilidades/logger');


class ParticipanteDAO {
  /**
 * @abstract Método que permite crear un participante en la base de datos
 * @param {object} participante - Objeto que contiene los datos del participante
 * @returns {object} Retorna el objeto del participante creado si la operación fue exitosa, de lo contrario lanza un error
 */
  async crearParticipante({ nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial   }) {
    try {
      logger.info("Creando de participante", { nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial })
      const participante = await Participante.create({ nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial })
      logger.info("Participante creado", { participante })
      return participante
    } catch (err) {     // console.log(err.message)
      logger.error("Error al crear participante", { error: err.message })
      throw err
    }
  }

  /**
 * @abstract Método que permite actualizar un participante en la base de datos
 * @param {number} id_participante - ID del participante a actualizar
 * @param {object} participante - Objeto que contiene los nuevos datos del participante
 * @returns {object} Retorna el objeto del participante actualizado si la operación fue exitosa, de lo contrario lanza un error
 */
  async actualizarParticipante(id_participante, {nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial }) {
    try {
      logger.info("Actualizando participante", { id_participante, nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial })
      const participante = await Participante.update({ nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial }, { where: { id_participante } })
      logger.info("Participante actualizado retonando resultado", { result: participante[0] === 1 })
      return participante[0] === 1 
    } catch (err) {   //   console.log(err.message)  
         logger.error("Error al actualizar participante", { error: err.message })
      throw err
    }
  }
  async obtenerParticipantesPorProcesoJudicial(id_proceso_judicial) {
    try {
      logger.info("Obteniendo participantes por proceso judicial", { id_proceso_judicial })
      const participantes = await Participante.findAll({ where: { id_proceso_judicial :id_proceso_judicial} })
     if( participantes ===null || participantes.length === 0){
        logger.info("No se encontraron participantes")
      throw new Error("No se encontraron participantes")
      }

      const participantes_obejct =  JSON.parse(JSON.stringify(participantes))
      for (let i = 0; i < participantes_obejct.length; i++) {
        try {
          logger.info("Obteniendo promovente por participante", { id_participante: participantes_obejct[i].id_participante })
          const promovente = await promventeDAO.obtenerPromovente(participantes_obejct[i].id_participante)
          participantes_obejct[i].promovente = promovente
        } catch (err) {
          logger.error("Error al obtener promovente por participante", { error: err.message })
        }
        try {
          logger.info("Obteniendo demandado por participante", { id_participante: participantes_obejct[i].id_participante })  
          const demandado = await demandadoDAO.obtenerDemandado(participantes_obejct[i].id_participante)
          participantes_obejct[i].demandado = demandado
        } catch (err) {
           logger.error("Error al obtener demandado por participante", { error: err.message })
        }
         
        logger.info("Obteniendo domicilio por participante", { id_participante: participantes_obejct[i].id_participante })
        const domicilio = await domicilioDAO.obtenerDomicilioParticipantePorParticipante(participantes_obejct[i].id_participante)
        participantes_obejct[i].domicilio = domicilio
      }
      logger.info("Participantes obtenidos", { participantes_obejct })
      return participantes_obejct
    } catch (err) {
      logger.error("Error al obtener participantes por proceso judicial", { error: err.message })
      throw err
    }
  }


}

module.exports = new ParticipanteDAO()
