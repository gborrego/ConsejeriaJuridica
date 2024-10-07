
const modeloTipoUsuario = require('../modelos/modeloTipoUsuario');
const logger = require('../utilidades/logger');
const obtenerTipoUsuarios = async () => {
    try {
        logger.info("Obteniendo los tipos de usuarios");
        const tipoUsuarios = await modeloTipoUsuario.TipoUser.findAll({
            raw: true,
            nest: true,
        });
        logger.info("Tipos de usuarios obtenidos correctamente", tipoUsuarios);
        return tipoUsuarios;
        /*
        return await modeloTipoUsuario.TipoUser.findAll({
            raw: false,
            nest: true,
        });
        */
    } catch (error) {
        //console.log("Error:", error.message);
        logger.error("Error al obtener los tipos de usuarios", error.message);
        return null;
    }
}
const obtenerTipoUsuarioById = async (id) => {  
    try {
        logger.info("Obteniendo el tipo de usuario con id:", id);
        const tipoUsuario = await modeloTipoUsuario.TipoUser.findOne({
            where: {
                id_tipouser: id
            }
        });
        logger.info("Tipo de usuario obtenido correctamente", tipoUsuario);
        return tipoUsuario;
/*
        return await modeloTipoUsuario.TipoUser.findOne({
            where: {
                id_tipouser: id
            }
        });
        */
    } catch (error) {
        logger.error("Error al obtener el tipo de usuario", error.message);
        // console.log("Error:", error.message);
        return null;
    }
}


module.exports = {
    obtenerTipoUsuarios, obtenerTipoUsuarioById
};