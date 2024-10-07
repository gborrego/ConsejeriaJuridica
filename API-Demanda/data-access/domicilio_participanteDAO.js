

const DomicilioParticipante = require('../models/domicilio_participante')
const logger = require('../utilidades/logger');

class DomicilioParticipanteDAO {
   /**
    * @abstract Método que permite crear un domicilio de un participante en la base de datos
    * @param {object} domicilioParticipante - Objeto que contiene los datos del domicilio de un participante
    * @returns {object} Retorna el objeto del domicilio de un participante creado si la operación fue exitosa, de lo contrario lanza un error
    * */

    async crearDomicilioParticipante({ calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante }) {
        try {
            logger.info("Creando de domicilio de participante", { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante })
            const domicilioParticipante = await DomicilioParticipante.create({ calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante })
            logger.info("Domicilio de participante creado", { domicilioParticipante })
            return domicilioParticipante
        } catch (err) {     
            // console.log(err.message)
            logger.error("Error al crear domicilio de participante", { error: err.message })
            throw err
        }
    }
  

   /**
    * @abstract Método que permite obtener un domicilio de un participante de la base de datos por el id del participante
    * @param {number} id_participante - ID del participante a obtener su domicilio
    * @returns {object} Retorna el objeto del domicilio de un participante si la operación fue exitosa, de lo contrario lanza un error
    * */

    async obtenerDomicilioParticipantePorParticipante(id_participante) {
        try {

            logger.info("Obteniendo domicilio de participante", { id_participante })
            const domicilioParticipante = await DomicilioParticipante.findOne({ where: { id_participante: id_participante } })

            if (!domicilioParticipante) {
                logger.info("No se encontró el domicilio de participante")
                throw new Error("No se encontró el domicilio de participante")
            }

            logger.info("Domicilio de participante obtenido", { domicilioParticipante })
            return domicilioParticipante
        } catch (err) {
            logger.error("Error al obtener domicilio de participante", { error: err.message })
            throw err
        }
    }
  
    /**
     * @abstract Método que permite actualizar un domicilio de un participante en la base de datos
     * @param {number} id_domicilio - ID del domicilio de un participante a actualizar
     * @param {object} descripcion - Objeto que contiene los nuevos datos del domicilio de un participante
     *  
     * @returns {object} Retorna el objeto del domicilio de un participante actualizado si la operación fue exitosa, de lo contrario lanza un error
     * */


    async actualizarDomicilioParticipante(id_domicilio, { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante }) {
        try {
            logger.info("Actualizando domicilio de participante", { id_domicilio, calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante })
            const domicilioParticipanteActualizado = await DomicilioParticipante.update({ calle_domicilio, 
                numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante }, { where: { id_domicilio : id_domicilio }   } )
            logger.info("Domicilio de participante actualizado retonando resultado",{result:domicilioParticipanteActualizado [0] === 1})
                return domicilioParticipanteActualizado [0] === 1
        } catch (err) {
            logger.error("Error al actualizar domicilio de participante", { error: err.message })
         //   console.log(err.message)
            throw err
        }
    }

 


}

module.exports = new DomicilioParticipanteDAO()