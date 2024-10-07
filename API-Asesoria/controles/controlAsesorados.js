const modeloAsesorado = require('../modelos/modeloAsesorado');
const logger = require('../utilidades/logger');

/**
 *   @abstract Función que permite obtener todos los asesorados
 * @returns asesorados
 */
const obtenerAsesorados = async () => {
  try {
    logger.info("Se obtienen los asesorados")
    const result= await modeloAsesorado.Asesorado.findAll({
      raw: true,
      nest: true,

      attributes: {
        exclude: ['id_asesorado', 'id_motivo', "id_estado_civil"]
      },
      include: [modeloAsesorado.Motivo, modeloAsesorado.EstadoCivil]

    });
    logger.info("Se retornan los asesorados")
    return result;
  } catch (error) {
   //  console.log("Error asesorados:", error.message);
    logger.error("Error de asesorados:", error.message); 
   return null;
  }
};

/**
 * @abstract Función que permite obtener un asesorado por su id
 * @param {*} id id del asesorado
 *  @returns asesorado
 * */
const obtenerAsesoradoPorId = async (id) => {
  try {
    logger.info("Se obtiene el asesorado por su id", id)
    const result = await modeloAsesorado.Asesorado.findByPk(id, {
      raw: true,
      nest: true
      ,
      attributes: {
        exclude: ['id_asesorado', 'id_motivo', "id_estado_civil"]
      },
      include: [modeloAsesorado.Motivo, modeloAsesorado.EstadoCivil]

    });
    logger.info("Se retorna el asesorado", result)
    return result;
  } catch (error) {
    logger.error("Error asesorados:", error.message);
  //  console.log("Error asesorados:", error.message);
    return null;
  }
};

/** 
 * @abstract Función que permite agregar un asesorado
 * @param {*} asesorado asesorado a agregar
 * @returns asesoriado si se agrega correctamente, false si no  agregar
 * */
const agregarAsesorado = async (asesorado) => {
  try {
    logger.info("Se agrega el asesorado", asesorado)
    const rwsult= (await modeloAsesorado.Asesorado.create(asesorado, { raw: true, nest: true })).dataValues;
    logger.info("Se retorna el asesorado", rwsult)
    return rwsult;
  } catch (error) {
  //   console.log("Error asesorados:", error.message);
     logger.error("Error de asesorados:", error.message);  
  return false;
  }
};



/**
 *   @abstract Función que permite actualizar un asesorado
 * @param {*} asesorado asesorado a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 */
const actualizarAsesorado = async (asesorado) => {
  try {
    logger.info("Se actualiza el asesorado", asesorado)
    const result=   await modeloAsesorado.Asesorado.update(asesorado, { where: { id_asesorado: asesorado.id_asesorado } });
    logger.info("Se retorna el asesorado", result)
    return result[0] === 1;
  } catch (error) {
   // console.log("Error asesorados:", error.message);
    logger.error("Error de asesorados:", error.message);
   return false;
  }
};

// Exportar los módulos
module.exports = {
  obtenerAsesorados,
  obtenerAsesoradoPorId,
  agregarAsesorado,
  actualizarAsesorado,
};
