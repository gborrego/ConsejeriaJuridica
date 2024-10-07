
const modeloPermiso = require('../modelos/modeloPermiso');
const logger = require('../utilidades/logger');
const obtenerPermisos = async () => {
    try {
        logger.info("Obteniendo permisos");
        const permisos =await modeloPermiso.Permiso.findAll({
            exclude: ["id_permiso"],
            raw: false,
            nest: true,
        });
        logger.info("Permisos obtenidos");
        return permisos; 
    } catch (error) {
        //console.log("Error:", error.message);
        logger.error("Error al obtener los permisos", error.message);
        return null;
    }
}

const obtenerIDPermisos =async(permisos) =>{
    try {
         logger.info("Obteniendo los permisos en base a un array de id de permisos");
         let permisosReturn = [];
         logger.info("Recorriendo el array de permisos y obteniendo permiso");    
        for (let i = 0; i < permisos.length; i++) {
            const permiso = await modeloPermiso.Permiso.findOne({
                where: {
                    nombre_permiso: permisos[i]
                }
            });
            permisosReturn.push(permiso.id_permiso);
        }
        logger.info("Permisos obtenidos");
        return permisosReturn;
    } catch (error) {
       // console.log("Error:", error.message);
         logger.error("Error al obtener los permisos", error.message);
       return null;
    }

}
const obtenerIDPermiso = async (nombre_permiso) => {
    try {
        logger.info("Obteniendo el permiso en base a su nombre");
        const permiso = await modeloPermiso.Permiso.findOne({
            where: {
                nombre_permiso
            }
        });
        logger.info("Permiso obtenido y se retorna el id del permiso");
        return permiso.id_permiso;
    } catch (error) {
       logger.error("Error al obtener el permiso", error.message);
       // console.log("Error:", error.message);
        return null;
    }
}


module.exports = {
    obtenerPermisos,
    obtenerIDPermisos, 
    obtenerIDPermiso
};