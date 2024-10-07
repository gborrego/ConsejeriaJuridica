
const modeloDetallePermisoUsuario = require('../modelos/modeloDetallePermisoUsuario');
const logger = require('../utilidades/logger');

const crearDetallePermisoUsuario = async (detallePermisoUsuario) => { 
    try {
        logger.info("Creando detalle permiso usuario");
        const result = (await modeloDetallePermisoUsuario.Detalle_Permiso_Usuario.create(detallePermisoUsuario)).dataValues;
        logger.info("Detalle permiso usuario creado y se retorna el detalle permiso usuario creado");
        return  result;
    } catch (error) {
         logger.error("Error al crear el detalle permiso usuario", error.message);
        //console.log("Error:", error.message);
        return null;
    }
}


const eliminarDetallePermisoUsuario = async (id_usuario, id_permiso) => {
    try {
        logger.info("Eliminando detalle permiso usuario en base a id de usuario y id de permiso");
    
        const result = await modeloDetallePermisoUsuario.Detalle_Permiso_Usuario.destroy({
            where: {
                id_usuario: id_usuario,
                id_permiso: id_permiso
            }
        });
    
        if (result === 0) {
            logger.warn("No se encontró ningún detalle permiso usuario para eliminar");
            return null
        }
    
        logger.info("Detalle permiso usuario eliminado");
        return { success: true, message: "Detalle permiso usuario eliminado", result: result };
    } catch (error) {
        logger.error("Error al eliminar detalle permiso usuario: ", error);
        return null
    }
}

const obtenerPermisosUsuario = async (idUsuario) => {
    try {
        logger.info("Obteniendo permisos de un usuario en base a su id");
        const result= await modeloDetallePermisoUsuario.Detalle_Permiso_Usuario.findAll({
            where: { id_usuario: idUsuario },
            include: [modeloDetallePermisoUsuario.Permiso]
           });
           
        logger.info("Permisos obtenidos", result);
           return result;
    } catch (error) {
    //    console.log("Error:", error.message);
     logger.error("Error al obtener los permisos de un usuario", error.message);  
    return null;
    }
}




module.exports = {  
    crearDetallePermisoUsuario,
    eliminarDetallePermisoUsuario,
    obtenerPermisosUsuario

}