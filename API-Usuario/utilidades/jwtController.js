const secreto = 'osos-carinosos';
const jwt = require('jsonwebtoken');
const controlDetallePermisoUsuario = require('../controles/controlDetallePermisoUsuario');
const controlUsuario = require('../controles/controlUsuario');


async function obtenerPermisosUsuaris(permisos) {
  let permisosUsuario = [];
  for (let i = 0; i < permisos.length; i++) {
    permisosUsuario.push(permisos[i].permiso.nombre_permiso);
  }
  return permisosUsuario;
}
/**
 *  @description Función que genera un token
 * @param {Object} payload Objeto con la información del usuario
 * @returns {String} token
 */
//Establece una duracion de 8 horas para el token  
const generateToken = async (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secreto, { expiresIn: '8h' }, (err, token) => {
      if (err) {
        reject();
      } else {
        resolve(token);
      }
    });
  });
}; 


/**
 * @description Función que verifica un token
 * @param {String} token Token a verificar
 * @returns {Promise<Object>} Promise que resuelve con el payload de los permisos
 */
const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secreto, async (err, decoded) => {
      if (err) {
        return reject(err);  // Es recomendable pasar el error para tener más información
      } else {
        try {
           const usuario = await controlUsuario.obtenerUsuarioCorreoPasswordEncriptada(decoded.correo, decoded.password);
          if (!usuario) {
            reject({ message: 'No se encontro el usuario del token' });
          }
          const permisos_pre = await controlDetallePermisoUsuario.obtenerPermisosUsuario(usuario.id_usuario);
          const permisos = await obtenerPermisosUsuaris(permisos_pre);
          if (permisos.length === 0) {
            reject({ message: 'No tiene permisos' });
          }else{
            resolve({permisos:permisos, id_distrito_judicial:usuario.id_distrito_judicial, id_usuario:usuario.id_usuario, id_tipouser:usuario.id_tipouser, id_empleado:usuario.id_empleado});
          }
        } catch (error) {
          reject(error);  // Rechaza la promesa en caso de errores en las llamadas asíncronas
        }
      }
    });
  });
};



//Module exports
module.exports = {
  generateToken,
  verifyToken
};