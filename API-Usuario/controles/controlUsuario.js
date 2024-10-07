const modelUsuario = require("../modelos/modeloUsuario");
const bcrypt = require('bcrypt');
const controlDetallePermisos = require("../controles/controlDetallePermisoUsuario.js");
const controlPermisos = require("../controles/controlPermisos.js");
const logger = require('../utilidades/logger');

/**
 * @description Función que permite obtener todos los usuarios
 * @returns {Array} Array con todos los usuarios registrados en la base de datos, si no hay usuarios retorna un null
 * */
const obtenerUsuarios = async () => {
  try {
    logger.info("Obteniendo los usuarios");
    const usuarios_pre = await modelUsuario.Usuario.findAll({
      attributes: {
        exclude: ['id_tipouser',
          'password'
        ],
      },
      raw: false,
      nest: true,
      include: [
        { model: modelUsuario.TipoUser },

      ]
    });
    logger.info("Usuarios obtenidos correctamente", usuarios_pre);
    const usuarios = JSON.parse(JSON.stringify(usuarios_pre));
    logger.info("Se verifican los usuarios, si hay usuarios se obtienen los permisos");
    if (usuarios !== null && usuarios !== undefined && usuarios.length > 0) {
       logger.info("Se obtienen los permisos de los usuarios");
      for (let i = 0; i < usuarios.length; i++) {
        const permisos = await controlDetallePermisos.obtenerPermisosUsuario(usuarios[i].id_usuario);
        usuarios[i].permisos = await obtenerPermisosUsuaris(permisos);
      }
      logger.info("Se retornan los usuarios con sus permisos", usuarios);
      return usuarios;
    }
    logger.info("No hay usuarios registrados");
    return null;
  } catch (error) {
   // console.log("Error:", error.message);
    logger.error("Error al obtener los usuarios", error.message); 
   return null;
  }
};

/**
 * @description Función que permite obtener un usuario por su id
 * @param {Number} id Id del usuario a buscar
 * @returns {Object} Objeto con el usuario encontrado, si no hay usuarios retorna un null
 * */
const obtenerUsuarioPorId = async (id) => {
  try {
   logger.info("Obteniendo el usuario por id");
    const uusuario_pre = await modelUsuario.Usuario.findByPk(id, {
      attributes: {
        exclude: ['id_tipouser',
          'password'
        ],
      },
      raw: true,
      nest: true,
      include: [
        { model: modelUsuario.TipoUser },

      ]
    });
    logger.info("Usuario obtenido correctamente", uusuario_pre);
    const usuario = JSON.parse(JSON.stringify(uusuario_pre));
    logger.info("Se verifica si el usuario es diferente de null o undefined");
    if (usuario !== null && usuario !== undefined) {
      //logger.info("Se obtienen los permisos del usuario");
      const permisos = await controlDetallePermisos.obtenerPermisosUsuario(usuario.id_usuario);
      usuario.permisos = await obtenerPermisosUsuaris(permisos);
      logger.info("Se retorna el usuario con sus permisos", usuario);
      return usuario;
    }
    return null;
  } catch (error) {
    //console.log("Error:", error.message);
    logger.error("Error al obtener el usuario por id", error.message);
    return null;
  }
};

/**
 * @description Función que permite obtener un usuario por su correo y contraseña
 * @param {String} correo Correo del usuario a buscar
 * @param {String} password Contraseña del usuario a buscar
 * @returns {Object} Objeto con el usuario encontrado, o null si la constraseña no es válida o no se encuentra el usuario 
 *  */

const sequelize = require('../utilidades/conexion');
const obtenerUsuarioCorreoPassword = async (correo, password) => {
  try {
    logger.info("Obteniendo el usuario por correo y contraseña");
    try{
      await sequelize.authenticate();
      logger.info("Conexión establecida correctamente");
    }
    catch(error){
      console.log("Error:", error.message);
      logger.error(error.message);
    }
    const usuario = await modelUsuario.Usuario.findOne({
      attributes: {
      },
      raw: true,
      nest: true,
      where: {
        correo: correo
      },
      include: [
        { model: modelUsuario.TipoUser },

      ],
    });
    logger.info("Usuario obtenido correctamente", usuario);
    logger.info("Se verifica si el usuario es diferente de null o undefined");
    if (!usuario) {
      return null;
    }
    logger.info("Se verifica si la contraseña es válida");
    const esContraseñaValida = await bcrypt.compare(password, usuario.password);
    if (esContraseñaValida) {
      //Obtener Permisos 
      logger.info("La contraseña es válida");
      logger.info("Se obtienen los permisos del usuario");
      const permisos = await controlDetallePermisos.obtenerPermisosUsuario(usuario.id_usuario);
      usuario.permisos = await obtenerPermisosUsuaris(permisos);
      return usuario;
    } else {
      logger.error("La contraseña no es válida");
      return null;
    }
  } catch (error) {
    console.log("Error:", error.message);
    return null;
  }
};

async function obtenerPermisosUsuaris(permisos) {
  let permisosUsuario = [];
  for (let i = 0; i < permisos.length; i++) {
    permisosUsuario.push(permisos[i].permiso.nombre_permiso);
  }
  return permisosUsuario;
}

/**
 * @description Función que permite obtener un usuario por su correo
 * @param {String} correo Correo del usuario a buscar
 * @returns {Object} Objeto con el usuario encontrado, o null si no se encuentra el usuario
 * */
const obtenerUsuarioCorreo = async (correo, password) => {
  try {
     logger.info("Obteniendo el usuario por correo");
    const usuario = await modelUsuario.Usuario.findOne({
      attributes: {
        exclude: ['id_tipouser'],
      },
      raw: true,
      nest: true,
      where: {
        correo: correo
      },
      include: [
        { model: modelUsuario.TipoUser },
      ],
    });
    logger.info("Usuario obtenido correctamente", usuario);
    if (!usuario) {
      logger.error("No se encontró el usuario");
      return null;
    } else {
      logger.info("Se obtienen los permisos del usuario");
      const permisos = await controlDetallePermisos.obtenerPermisosUsuario(usuario.id_usuario);
      usuario.permisos = await obtenerPermisosUsuaris(permisos);
      logger.info("Se retorna el usuario con sus permisos", usuario);
      return usuario;
    }
  } catch (error) {
  //  console.log("Error:", error.message);
    logger.error("Error al obtener el usuario por correo", error.message); 
  return null;
  }
};


/**
 * 
 *  @description Función que permite agregar un usuario
 * @param {Object} usuario Objeto con la información del usuario a agregar
 * @returns {Boolean} el usuario si este se agrega correctamente, false si no se agrega
 */
const agregarUsuario = async (usuario) => {
  try {
    logger.info("Agregando el usuario");
    logger.info("Se encripta la contraseña del usuario");
    const hashedPassword = await bcrypt.hash(usuario.password, 10);
    delete usuario.password;
    usuario.password = hashedPassword;
    logger.info("Se obtienen los id de los permisos del usuario");
    let permisosID = await controlPermisos.obtenerIDPermisos(usuario.permisos);
    logger.info("Se crea el usuario");
    const usuarioCreado = (await modelUsuario.Usuario.create(usuario, { raw: true, nest: true })).dataValues;
    logger.info("Usuario creado correctamente", usuarioCreado);
    logger.info("Se verifican si hay permisos para agregar");
    if (permisosID !== null && permisosID !== undefined && permisosID.length > 0) {
      logger.info("Se agregan los permisos al usuario");
      for (let i = 0; i < permisosID.length; i++) {
        const detallePermisoUsuario = {
          id_usuario: usuarioCreado.id_usuario,
          id_permiso: permisosID[i]
        };
        await controlDetallePermisos.crearDetallePermisoUsuario(detallePermisoUsuario);
      }
    }
    logger.info("Se retorna el usuario creado", usuarioCreado);
    return usuarioCreado;
  } catch (error) {
    console.log("Error:", error.message);
    return false;
  }
};



/**
 * @description Función que permite actualizar un usuario
 * @param {Object} usuario Objeto con la información del usuario a actualizar
 * @returns {Boolean} true si el usuario se actualiza correctamente, false si no se actualiza
 */

const actualizarUsuario = async (usuario) => {
  try {
    logger.info("Actualizando el usuario");
    const result = await modelUsuario.Usuario.update(usuario, { where: { id_usuario: usuario.id_usuario } });
    logger.info("Usuario actualizado correctamente", result);
    logger.info("Se obtienen los permisos del usuario")
    const permisosID = await controlDetallePermisos.obtenerPermisosUsuario(usuario.id_usuario);
    let permisos = await obtenerPermisosUsuaris(permisosID);
    let permisosPeticion = usuario.permisos;

    logger.info("Se verifican los permisos a eliminar y agregar");
    let permisosEliminar = permisos.filter(x => !permisosPeticion.includes(x));
    let permisosAgregar = permisosPeticion.filter(x => !permisos.includes(x));

    let verifiicarCambiosPermisos = false;

    logger.info("Se eliminan los permisos del usuario");
    if (permisosEliminar !== null && permisosEliminar !== undefined && permisosEliminar.length > 0) {
      verifiicarCambiosPermisos = true;
      for (let i = 0; i < permisosEliminar.length; i++) {
        const id_permiso = await controlPermisos.obtenerIDPermiso(permisosEliminar[i]);
        await controlDetallePermisos.eliminarDetallePermisoUsuario(usuario.id_usuario, id_permiso);
      }
    }
    logger.info("Se agregan los permisos al usuario");
    if (permisosAgregar !== null && permisosAgregar !== undefined && permisosAgregar.length > 0) {
      verifiicarCambiosPermisos = true;
      for (let i = 0; i < permisosAgregar.length; i++) {
        const id_permiso = await controlPermisos.obtenerIDPermiso(permisosAgregar[i]);
        const detallePermisoUsuario = {
          id_usuario: usuario.id_usuario,
          id_permiso: id_permiso
        };
        await controlDetallePermisos.crearDetallePermisoUsuario(detallePermisoUsuario);
      }
    }
    logger.info("Se verifican los cambios en los permisos o si se actualizó el usuario");
    if (verifiicarCambiosPermisos) {
      logger.info("Se verifica si hubo cambios en los permisos");
      return true;
    }
    logger.info("Se verifica si se actualizó el usuario");
    return result[0] === 1;
  } catch (error) {
    //console.log("Error:", error.message);
    logger.error("Error al actualizar el usuario", error.message);
    return false;
  }
};


const obtenerUsuarioByIDAndNameGrpc = async (id_usuario, usuario) => {
  try {
    logger.info("Obteniendo el usuario por id y nombre");
    const usuario_pre = await modelUsuario.Usuario.findOne({
      raw: false,
      nest: true,
      where: {
        id_usuario: id_usuario,
      },
    });
    logger.info("Usuario obtenido correctamente", usuario_pre);
     
    logger.info("Se verifica si el usuario es diferente de null o undefined");
    if (!usuario_pre) {
      logger.error("No se encontró el usuario");  
      return null;
    }

    const nombre = usuario_pre.nombre;
    
    logger.info("Se crea una expresión regular para verificar si el nombre del usuario es igual al nombre de la petición");
    const nombreCompletoRegex = new RegExp(
      `${nombre}`
    );
    
    logger.info("Se verifica si el nombre del usuario es igual al nombre de la petición");
    if (!nombreCompletoRegex.test(usuario)) {
      logger.error("El nombre del usuario no es igual al nombre de la petición");
      return null;
    } else {
      logger.info("Se obtienen los permisos del usuario");
      return usuario;
    }
  }
  catch (error) {
    //  console.log("Error:", error.message);
    logger.error("Error al obtener el usuario por id y nombre", error.message);
    return null;
  }


};


const obtenerUsuarioCorreoPasswordEncriptada = async (correo, password) => {
  try {
     logger.info("Obteniendo el usuario por correo y contraseña encriptada");
    const usuario = await modelUsuario.Usuario.findOne({
      attributes: {
      },
      raw: true,
      nest: true,
      where: {
        correo: correo
      },
      include: [
        { model: modelUsuario.TipoUser },

      ],
    });

    logger.info("Usuario obtenido correctamente", usuario);
    logger.info("Se verifica si el usuario es diferente de null o undefined");
    if (!usuario) {
      logger.error("No se encontró el usuario");
      return null;
    }

    //$2b$10$rqM7e6nK76voSs2MZMkmJ.vvUw1F2Q6U/XlUgozRcEzVbq6bDifCi
    //$2b$10$rqM7e6nK76voSs2MZMkmJ.vvUw1F2Q6U/XlUgozRcEzVbq6bDifCi
    logger.info("Se verifica si la contraseña es válida osea si es igual a la contraseña encriptada");
    if (password === usuario.password) {
      //Obtener Permisos
      logger.info("La contraseña es válida");
      logger.info("Se obtienen los permisos del usuario");
      const permisos = await controlDetallePermisos.obtenerPermisosUsuario(usuario.id_usuario);
      usuario.permisos = await obtenerPermisosUsuaris(permisos);
      logger.info("Se retorna el usuario con sus permisos", usuario);
      return usuario;
    } else {
      logger.error("La contraseña no es válida");
      return null;
    }
  } catch (error) {
    //console.log("Error:", error.message);
    logger.error("Error al obtener el usuario por correo y contraseña encriptada", error.message);
    return null;
  }
};
const { Op, literal } = require("sequelize");
const { log } = require("winston");
const obtenerUsuariosBusqueda = async (correo, id_distrito_judicial, total, pagina) => {
  try {
     logger.info("Obteniendo los usuarios por búsqueda");

     logger.info("Se establecen limites y offset para la paginación");
    const limite = 10;
    const offset = (parseInt(pagina, 10) - 1) * limite;

    logger.info("Se crea una clausula where para la búsqueda");
    const whereClause = {};
    logger.info("Se verifica si hay correo o id_distrito_judicial para agregar a la clausula where");
    if (correo) whereClause.correo = { [Op.like]: `%${correo}%` };
    if (id_distrito_judicial) whereClause.id_distrito_judicial = id_distrito_judicial;

    logger.info("Se verifica si la variable es true con el fin de obtener el total de usuarios, caso contrario se obtienen los usuarios con la paginación")
    if (total) {
      logger.info("Se obtiene el total de usuarios");
      return await modelUsuario.Usuario.count({ where: whereClause });
    } else {
      logger.info("Se obtienen los usuarios con la paginación");
      const usuarios_pre = await modelUsuario.Usuario.findAll({
        attributes: { exclude: ['id_tipouser', 'password'] },
        raw: false,
        nest: true,
        include: [{ model: modelUsuario.TipoUser }],
        where: whereClause,
        limit: limite,
        offset: offset
      });
      
      logger.info("Usuarios obtenidos correctamente", usuarios_pre);
      const usuarios = JSON.parse(JSON.stringify(usuarios_pre));

      logger.info("Se verifica si hay usuarios para obtener los permisos");
      for (let usuario of usuarios) {
        const permisos = await controlDetallePermisos.obtenerPermisosUsuario(usuario.id_usuario);
        usuario.permisos = await obtenerPermisosUsuaris(permisos);
      }
      logger.info("Se retornan los usuarios con sus permisos", usuarios);
      return usuarios;
    }
  } catch (error) {
   // console.error("Error:", error.message);
    logger.error("Error al obtener los usuarios por búsqueda", error.message);
    return null;
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  agregarUsuario,
  obtenerUsuarioCorreoPassword,
  obtenerUsuarioCorreo,
  obtenerUsuarioByIDAndNameGrpc,
  obtenerUsuarioCorreoPasswordEncriptada,
  obtenerUsuariosBusqueda
};
