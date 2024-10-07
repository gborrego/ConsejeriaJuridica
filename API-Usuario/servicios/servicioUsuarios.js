const controlUsuarios = require('../controles/controlUsuario'); // Cambio de controlZonas a controlUsuarios
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");
const jwtController = require("../utilidades/jwtController");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const logger = require('../utilidades/logger');
const { log } = require('winston');

/**
 * @description Servicio que permite agregar un usuario
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @param {Object} next Objeto de siguiente
 * @returns {Object} respuesta con estatus 2002 con el usuario agregado, o error correspondiente
 * */
const agregarUsuario = asyncError(async (req, res, next) => {
  logger.info("Petición para agregar un usuario");
  const result = await controlUsuarios.agregarUsuario(req.body); // Cambio de controlZonas a controlUsuarios
  logger.info("Se verifica el resultado de la petición de agregar un usuario")
  if (result === false) {
    logger.error("Error al agregar un usuario");
    const error = new CustomeError('Error al agregar un usuario', 400);
    return next(error);
  } else {
    logger.info("Usuario agregado correctamente");
    res.status(201).json({
      usuario: result // Cambio de zona a usuario
    });
  }
});

/**
 * @description Servicio que permite obtener todos los usuarios
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @param {Object} next Objeto de siguiente
 * @returns {Object} respuesta con estatus 200 con los usuarios, o error correspondiente
 * */
const obtenerUsuarios = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener todos los usuarios");
  const result = await controlUsuarios.obtenerUsuarios(); // Cambio de controlZonas a controlUsuarios
  logger.info("Se verifica el resultado de la petición de obtener todos los usuarios")
  if (result === null || result === undefined || result.length === 0) {
    logger.error("No se encontraron usuarios");
    const error = new CustomeError('No se encontraron usuarios', 404); // Cambio de zonas a usuarios
    return next(error);
  } else {
    logger.info("Usuarios obtenidos correctamente");
    res.status(200).json({
      usuarios: result
    });
  }
});

/**
 * @description Servicio que permite actualizar un usuario por su id
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @param {Object} next Objeto de siguiente
 * @returns {Object} respuesta con estatus 200 con el usuario actualizado, o error correspondiente
 * */
const actualizarUsuario = asyncError(async (req, res, next) => {
  logger.info("Petición para actualizar un usuario");
  const result = await controlUsuarios.actualizarUsuario(req.body); // Cambio de controlZonas a controlUsuarios
  logger.info("Se verifica el resultado de la petición de actualizar un usuario")
  if (result === false) {
    logger.error("Error al actualizar el usuario o datos iguakes");
    const error = new CustomeError('Error al actualizar el usuario o datos iguakes', 400); // Cambio de zona a usuario
    return next(error);
  } else {
    logger.info("Usuario actualizado correctamente");
    res.status(200).json({
      usuario: req.body // Cambio de zona a usuario
    });
  }
});

/**
 * @description Servicio que permite obtener un usuario por su id
 * @param {Object} req Objeto de petición
 * @param {Object} res Objeto de respuesta
 * @param {Object} next Objeto de siguiente
 * @returns {Object} respuesta con estatus 200 con el usuario encontrado, o error correspondiente
 * */
const obtenerUsuarioPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener un usuario por su id");
  const result = await controlUsuarios.obtenerUsuarioPorId(req.params.id); // Cambio de controlZonas a controlUsuarios
  logger.info("Se verifica el resultado de la petición de obtener un usuario por su id")
  if (result === null || result === undefined) {
    logger.error("Error al obtener el usuario");
    const error = new CustomeError('Error al obtener el usuario', 404); // Cambio de zona a usuario
    return next(error);
  } else {
    logger.info("Usuario obtenido correctamente");
    res.status(200).json({
      usuario: result // Cambio de zona a usuario
    });
  }
});

/**
 * @description Servicio que permite obtener un usuario por su correo y contraseña
 * @param {Object} req Objeto de petición donde se obtienen los datos de correo y contraseña
 * @param {Object} res Objeto de respuesta
 * @param {Object} next Objeto de siguiente
 *  @returns {Object} respuesta con estatus 200 con el usuario encontrado, o error correspondiente
 * */
const obtenerUsuarioCorreoPassword = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener un usuario por su correo y contraseña");
  logger.info("Se manda a llamar la función obtenerUsuarioCorreoPassword, en base al correo y contraseña obtenidos en la petición")
  const result = await controlUsuarios.obtenerUsuarioCorreoPassword
    (req.query.correo, req.query.password);

  const usuarioStr = JSON.stringify(result);
  const usuarioObj = JSON.parse(usuarioStr);
  logger.info("Se verifica el resultado de la petición de obtener un usuario por su correo y contraseña")
  if (usuarioObj === null) {
    logger.error("No existe un usuario con ese correo");
    const error = new CustomeError('La contraseña es incorrecta.', 404); // Cambio de zona a usuario
    return next(error);
  } else if (usuarioObj.estatus_general === 'INACTIVO') {
    logger.error("El usuario esta desabilitado");
    const error = new CustomeError('El usuario esta desabilitado.', 404); // Cambio de zona a usuario
    return next(error);
  } else if (usuarioObj.estatus_general === 'ACTIVO') {
    logger.info("Usuario obtenido correctamente");
    logger.info("Se verifica si el usuario tiene permisos")
    if (usuarioObj.permisos.length === 0) {
      logger.error("El usuario no tiene permisos");
      const error = new CustomeError('El usuario no tiene permisos.', 404); // Cambio de zona a usuario
      return next(error);
    } else {
      logger.info("El usuario tiene permisos, se genera un token")
      const payload = JSON.parse(JSON.stringify(usuarioObj));
      delete payload.tipo_user;
      const token = await jwtController.generateToken(payload);
      res.status(200).json({
        token: token,
        //   role: usuarioObj.tipo_user.tipo_usuario,
        name: usuarioObj.nombre,
        id_distrito_judicial: usuarioObj.id_distrito_judicial,
        id_tipouser: usuarioObj.id_tipouser,
        //   estatus_general: usuarioObj.estatus_general,
        id_empleado: usuarioObj.id_empleado,
        id_usuario: usuarioObj.id_usuario,
        permisos: usuarioObj.permisos
      });
    }
  }
});


/**
 *   
 * @description Función que permite generar una contraseña aleatoria
 * @returns {String} Contraseña generada
 */
function generarContraseñaAzar() {
  logger.info("Generando una contraseña aleatoria");
  const longitud = 10;
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contraseñaGenerada = '';

  for (let i = 0; i < longitud; i++) {
    const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    contraseñaGenerada += caracterAleatorio;
  }
  logger.info("Contraseña generada correctamente ", contraseñaGenerada);
  return contraseñaGenerada;
}

/**
 * @description Función que permite enviar una contraseña por correo
 * @param {String} destinatario Correo del destinatario
 * @param {String} contraseñaGenerada Contraseña generada
 * @returns {Boolean} true si se envió el correo, false si no se envió
 * */
async function enviarContraseñaPorCorreo(destinatario, contraseñaGenerada) {
  logger.info("Enviando la contraseña por correo");
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'consejeria.juridica.1966@gmail.com',
      pass: 'gjxj gdmo sgaj cuax',
    },
  });

  logger.info("Se manda a llamar la función sendMail, en base a las opciones del correo");
  const opcionesCorreo = {
    from: 'consejeria.juridica.1966@gmail.com',
    to: destinatario,
    subject: 'Recuperación de contraseña',
    text: `Tu nueva contraseña es: ${contraseñaGenerada}`,
  };

  let intentos = 0;
  const maxIntentos = 3;

  while (intentos < maxIntentos) {
    try {
      logger.info(`Intento ${intentos + 1}: Se verifica si se envió el correo`);
      await transporter.sendMail(opcionesCorreo);
      return true;
    } catch (error) {
      logger.error(`Error al enviar el correo en el intento ${intentos + 1}: ${error.message}`);
      intentos++;
    }
  }

  logger.error("No se pudo enviar el correo después de 3 intentos");
  return false;
}



/**
 * @description Servicio que permite recuperar la contraseña de un usuario
 * @param {Object} req Objeto de petición donde se obtiene el correo del usuario
 * @param {Object} res Objeto de respuesta
 * @param {Object} next Objeto de siguiente
 * @returns {Object} respuesta con estatus 200 con el mensaje de recuperación, o error correspondiente
 * */
const recuperarContraseña = asyncError(async (req, res, next) => {

  logger.info("Petición para recuperar la contraseña de un usuario");
  logger.info("Se manda a llamar la función obtenerUsuarioCorreoPassword, en base al correo y contraseña obtenidos en la petición")
  const result = await controlUsuarios.obtenerUsuarioCorreo
    (req.query.correo, req.query.password);
  const usuarioStr = JSON.stringify(result);
  const usuarioObj = JSON.parse(usuarioStr);
  logger.info("Se verifica el resultado de la petición de obtener un usuario por su correo y contraseña")
  if (usuarioObj === null) {
    logger.error("No existe un usuario con ese correo");
    const error = new CustomeError('No existe un usuario con ese correo.', 404); // Cambio de zona a usuario
    return next(error);
  } else {
    logger.info("Usuario obtenido correctamente");
    const contraseñaGenerada = generarContraseñaAzar();
    const hashedPassword = await bcrypt.hash(contraseñaGenerada, 10);
    delete usuarioObj.password;
    usuarioObj.password = hashedPassword;
    logger.info("Se manda a llamar la función actualizarUsuario, en base al usuario obtenido y la contraseña generada")
    const result = await controlUsuarios.actualizarUsuario(usuarioObj); // Cambio de controlZonas a controlUsuarios
    logger.info("Se verifica el resultado de la petición de actualizar un usuario")
    if (result === false) {
      logger.error("Error en la actualizacion de la contraseña");
      const error = new CustomeError('Error en la actualizacion de la contraseña', 400); // Cambio de zona a usuario
      return next(error);
    } else {
      logger.info("Contraseña actualizada correctamente, se envía la contraseña por correo")
      await enviarContraseñaPorCorreo(usuarioObj.correo, contraseñaGenerada);
      logger.info("Se verifica si se envió la contraseña por correo")
      res.status(200).json({
        message: 'Se ha enviado una nueva contraseña por correo.',
      });
    }

  }



});
const obtenerUsuariosBusqueda = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener usuarios por búsqueda");
  logger.info("se obtienen los datos de la petición")
  const { correo, id_distrito_judicial, total, pagina } = req.query;
  const totalBool = total === 'true';

  try {
    logger.info("Se manda a llamar la función obtenerUsuariosBusqueda, en base al correo, id_distrito_judicial, totalBool y pagina obtenidos en la petición")
    const result = await controlUsuarios.obtenerUsuariosBusqueda(correo || null, id_distrito_judicial || null, totalBool, pagina);
    logger.info("Se verifica el resultado de la petición de obtener usuarios por búsqueda")
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return next(new CustomeError('No se encontraron usuarios', 404));
    }
    logger.info("Usuarios obtenidos correctamente, se verifica si fue el total de usuarios o los usuarios")
    const responseKey = totalBool ? 'totalUsuarios' : 'usuarios';
    logger.info("Se envía la respuesta con los usuarios obtenidos")
    res.status(200).json({ [responseKey]: result });
  } catch (error) {
    logger.error("Error al obtener los usuarios por búsqueda", error.message);
    return next(error);
  }
});


// Exportamos las funciones definidas
module.exports = {
  recuperarContraseña,
  agregarUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarioCorreoPassword,
  obtenerUsuariosBusqueda
};
