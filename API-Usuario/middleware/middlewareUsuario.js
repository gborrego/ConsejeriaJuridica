
const controlUsuario = require('../controles/controlUsuario');
const logger = require('../utilidades/logger');

const { HOSTGRPCASESORIAS } = require("../configuracion/default.js");

// Variable para cargar el módulo de gRPC
const grpc = require('@grpc/grpc-js');
// Variable para cargar el módulo de proto-loader
const { packageDefinition2 } = require("../clienteAsesorias/cliente.js")

// Variable para cargar el módulo de gRPC
const grpc3 = require('@grpc/grpc-js');

const controlTipoUsuario = require('../controles/controlTipoUsuario');


async function existeUsuario(req, res, next) {
  logger.info("Middleware para validar la existencia de un usuario");
  try {
    const { id } = req.params
    const usuario = await controlUsuario.obtenerUsuarioPorId(id);
    if (usuario) {
      logger.info("Usuario encontrado");
      next();
    } else {
      logger.info("Usuario no encontrado");
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    logger.error("Error en el middleware para validar la existencia de un usuario");
    res.status(500).json({ error: error.message });
  }

}

async function validarJSONUsuarioPOST(req, res, next) {
 logger.info("Middleware para validar el JSON del usuario en el POST");
  const { nombre, correo, password, id_distrito_judicial,
    id_empleado, estatus_general, id_tipouser, permisos, ...extraData } = req.body;

  if (Object.keys(extraData).length > 0) {
    //OSea que el mensaje diga que la peticion no debe de tener datos adicionales
    return res.status(400).json({ message: "La petición no debe de tener datos adicionales" });
  }
  if (!nombre || !correo || !password || !estatus_general || !id_tipouser) {
    return res.status(400).json({ message: "Faltan datos o el nombre no existe,  o el correo no existe, o el password no existe, o el estatus_general no existe, o el id_tipouser no existe" });
  }
  //Ahora has que bueno que si el nombre, paterno  y materno contengan 
  var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  if (!nombrePattern2.test(nombre)) {
    return res.status(400).json({ message: "El nombre no es válido , solo se aceptan letras" });
  }



  var correoPattern2 = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!correoPattern2.test(correo)) {
    return res.status(400).json({ message: "El correo no es válido" });
  }

  //ahora el correo no debe de superar los 200
  if (correo.length > 200) {
    return res.status(400).json({ message: "El correo no debe de superar los 200 caracteres" });
  }

  //ahora el password no debe de superar los 45
  if (password.length > 65) {
    return res.status(400).json({ message: "El password no debe de superar los 65 caracteres" });
  }

  // Nombre, paterno y materno no deben de superar los 100 caracteres
  if (nombre.length > 100) {
    return res.status(400).json({ message: "El nombre no debe de superar los 100 caracteres" });
  }




  if (id_tipouser !== undefined) {
    if (isNaN(id_tipouser)) {
      return res.status(400).json({ message: "El id de tipo de usuario debe de ser un número" });
    }
  }

  //el estatus_general solo puede ser ACTIVO o INACTIVO

  if (estatus_general !== "ACTIVO") {
    return res.status(400).json({ message: "El estatus general solo puede ser ACTIVO" });
  }

  const tipoUsuario = await controlTipoUsuario.obtenerTipoUsuarioById(id_tipouser);
  if (!tipoUsuario) {
    return res.status(400).json({ message: "El tipo de usuario no es válido" });
  }


  const permisos_lista = ["ALL_SA", "AD_USUARIOS_SA", "AD_EMPLEADOS_SA",
    "AD_JUICIOS_SA", "AD_GENEROS_SA",
    "AD_ESTADOSCIVILES_SA", "AD_MOTIVOS_SA", "AD_CATALOGOREQUISITOS_SA", "CONSULTA_ASESORIA_SA",
    "REGISTRO_ASESORIA_SA", "TURNAR_ASESORIA_SA", "ALL_SD", "AD_ESCOLARIDAD_SD",
    "AD_ETNIA_SD", "AD_JUZGADO_SD", "AD_OCUPACION_SD",
    "CONSULTA_PROCESO_JUDICIAL_SD", "SEGUIMIENTO_PROCESO_JUDICIAL_SD",
    "REGISTRO_PROCESO_JUDICIAL_SD"];


  //Verifica que al menos la variable permisos sea un arreglo
  if (!Array.isArray(permisos)) {
    return res.status(400).json({ message: "El campo de permisos debe de ser un arreglo" });
  }

  if (permisos.length !== 0) {
    for (let i = 0; i < permisos.length; i++) {
      if (typeof permisos[i] !== "string") {
        return res.status(400).json({ message: "El campo de permisos solo debe de contener strings" });
      }
    }


    //Verifica que el campo de permisos solo contenga strings y que sean de la lista de permisos
    for (let i = 0; i < permisos.length; i++) {
      if (!permisos_lista.includes(permisos[i])) {
        return res.status(400).json({ message: "El campo de permisos solo debe de contener los permisos válidos" });
      }
    }

    //Ahora Verifica que por ejemplo si el permiso es ALL_SA, no se pueda agregar otro permiso con terminacion SA, y de igual manera
    //has la misma verificacion con ALL_SD y terminacion SD
    for (let i = 0; i < permisos.length; i++) {
      if (permisos[i] === "ALL_SA") {
        for (let j = 0; j < permisos.length; j++) {
          if (permisos[j].endsWith("SA") && permisos[j] !== "ALL_SA") {
            return res.status(400).json({ message: "No se puede agregar otro permiso con terminación SA si ya se tiene el permiso ALL_SA" });
          }
        }
      }

      if (permisos[i] === "ALL_SD") {
        for (let j = 0; j < permisos.length; j++) {
          if (permisos[j].endsWith("SD") && permisos[j] !== "ALL_SD") {
            return res.status(400).json({ message: "No se puede agregar otro permiso con terminación SD si ya se tiene el permiso ALL_SD" });
          }
        }
      }
    }



  }




  if (tipoUsuario.id_tipouser === 1 && id_distrito_judicial !== undefined) {

    //Evaluar que id de distrito, empleado y tipo de usuario sean numeros
    //con try catch
    if (id_distrito_judicial !== undefined) {
      if (isNaN(id_distrito_judicial)) {
        return res.status(400).json({ message: "El id de distrito debe de ser un número" });
      }
    }

    try {
      let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
      const validador = new asesoria_client.DistritoService(HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
      const auxiliar = [];

      const validarDistritoPromise = new Promise((resolve, reject) => {
        validador.validarDistrito({ id_distrito_judicial: id_distrito_judicial }, function (err, response) {
          if (err) {
            reject(err);
          } else {
            if (response.message === "Distrito inválido") {
              auxiliar.push(response.message);
            }
            resolve();
          }
        });
      });
      await validarDistritoPromise;
      if (auxiliar.length > 0) {
        return res.status(400).json({ message: "El distrito no es válido" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Error al validar el distrito, o no es valido" });
    }
  }

  if ((tipoUsuario.id_tipouser === 2 || tipoUsuario.id_tipouser === 3) && id_distrito_judicial !== undefined) {

    if (id_distrito_judicial !== undefined) {
      if (isNaN(id_distrito_judicial)) {
        return res.status(400).json({ message: "El id de distrito debe de ser un número" });
      }
    }

    if (id_empleado !== undefined) {
      if (isNaN(id_empleado)) {
        return res.status(400).json({ message: "El id de empleado debe de ser un número" });
      }
    }

    try {
      let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
      const validador = new asesoria_client.EmpleadoService(HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
      const auxiliar = [];

      const validarEmpleadoPromise = new Promise((resolve, reject) => {
        validador.validarEmpleado({ id_empleado: id_empleado, id_distrito_judicial: id_distrito_judicial, id_tipouser: id_tipouser }, function (err, response) {
          if (err) {
            reject(err);
          } else {
            if (response.message === "Empleado inválido") {
              auxiliar.push(response.message);
            }
            resolve();
          }
        });
      });
      await validarEmpleadoPromise;
      if (auxiliar.length > 0) {
        return res.status(400).json({ message: "El empleado no es válido o dato no coinciden con respecto al empleado" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error al validar el empleado, o no es valido  o dato no coinciden con respecto al empleado" });
    }

  }

  if (tipoUsuario.id_tipouser > 3 && id_distrito_judicial !== undefined) {

    if (id_distrito_judicial !== undefined) {
      if (isNaN(id_distrito_judicial)) {
        return res.status(400).json({ message: "El id de distrito debe de ser un número" });
      }
    }


    try {
      let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
      const validador = new asesoria_client.DistritoService(HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
      const auxiliar = [];

      const validarDistritoPromise = new Promise((resolve, reject) => {
        validador.validarDistrito({ id_distrito_judicial: id_distrito_judicial }, function (err, response) {
          if (err) {
            reject(err);
          } else {
            if (response.message === "Distrito inválido") {
              auxiliar.push(response.message);
            }
            resolve();
          }
        });
      });
      await validarDistritoPromise;
      if (auxiliar.length > 0) {
        return res.status(400).json({ message: "El distrito no es válido" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Error al validar el distrito, o no es valido" });
    }
  }

  //Verificar que al menos se haya seleccionado el tipo de usuario y en caso de ser 1,2,3 verificar que se haya seleccionado el distrito judicial o el empleado respectivamente
  if (tipoUsuario.id_tipouser === 1 && id_distrito_judicial === undefined) {
    return res.status(400).json({ message: "Debe de seleccionar un distrito judicial" });
  }

  if ((tipoUsuario.id_tipouser === 2 || tipoUsuario.id_tipouser === 3) && id_empleado === undefined && id_distrito_judicial === undefined) {
    return res.status(400).json({ message: "Debe de seleccionar un empleado, y un distrito judicial" });
  }

  if (tipoUsuario.id_tipouser > 3 && id_distrito_judicial === undefined) {
    return res.status(400).json({ message: "Debe de seleccionar un distrito judicial" });
  }

 // return res.status(200).json({ message: "Fin del Middleware" });
   logger.info("Fin del middleware para validar el JSON del usuario en el POST");
   next();
}

async function validarJSONUsuarioPUT(req, res, next) {
  logger.info("Middleware para validar el JSON del usuario en el PUT");
  // id_usuario 
  const { id_usuario, nombre,
    correo, id_distrito_judicial, id_empleado, estatus_general, id_tipouser, permisos, ...extraData } = req.body;

  if (Object.keys(extraData).length > 0) {
    //OSea que el mensaje diga que la peticion no debe de tener datos adicionales
    return res.status(400).json({ message: "La petición no debe de tener datos adicionales" });
  }

  if (!id_usuario || !nombre || !correo || !estatus_general || !id_tipouser) {
    return res.status(400).json({ message: "Faltan datos o el id de usuario no existe, o el nombre no existe, o el correo no existe, o el estatus_general no existe, o el id_tipouser no existe" });
  }

  //Ahora has que bueno que si el nombre, paterno  y materno contengan
  var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  if (!nombrePattern2.test(nombre)) {
    return res.status(400).json({ message: "El nombre no es válido , solo se aceptan letras" });
  }


  var correoPattern2 = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!correoPattern2.test(correo)) {
    return res.status(400).json({ message: "El correo no es válido" });
  }

  //ahora el correo no debe de superar los 200
  if (correo.length > 200) {
    return res.status(400).json({ message: "El correo no debe de superar los 200 caracteres" });
  }


  // Nombre, paterno y materno no deben de superar los 100 caracteres
  if (nombre.length > 100) {
    return res.status(400).json({ message: "El nombre no debe de superar los 100 caracteres" });
  }


  //Evaluar que id de distrito, empleado y tipo de usuario sean numeros 
  //con try catch
  if (id_tipouser === 1) {
    if (id_distrito_judicial === undefined) {
      return res.status(400).json({ message: "El distrito judicial no puede ser nulo" });
    }
    if (isNaN(id_distrito_judicial)) {
      return res.status(400).json({ message: "El id de distrito debe de ser un número" });
    }
    if (id_empleado !== undefined) {
      return res.status(400).json({ message: "No esta permitido el campo de empleado" });
    }
  }
  if (id_tipouser === 2 || id_tipouser === 3) {
    if (id_empleado === undefined) {
      return res.status(400).json({ message: "El empleado no puede ser nulo" });
    }
    if (isNaN(id_empleado)) {
      return res.status(400).json({ message: "El id de empleado debe de ser un número" });
    }
    if (id_distrito_judicial === undefined) {
      return res.status(400).json({ message: "El distrito judicial no puede ser nulo" });
    }
    if (isNaN(id_distrito_judicial)) {
      return res.status(400).json({ message: "El id de distrito debe de ser un número" });
    }
  }
  if (id_tipouser > 3) {
    if (id_distrito_judicial === undefined) {
      return res.status(400).json({ message: "El distrito judicial no puede ser nulo" });
    }
    if (isNaN(id_distrito_judicial)) {
      return res.status(400).json({ message: "El id de distrito debe de ser un número" });
    }
    if (id_empleado !== undefined) {
      return res.status(400).json({ message: "No esta permitido el campo de empleado" });
    }
  }


  if (isNaN(id_usuario)) {
    return res.status(400).json({ message: "El id de usuario debe de ser un número" });
  }

  //Validar que el estatus_general solo puede ser ACTIVO o INACTIVO
  if (estatus_general !== "ACTIVO" && estatus_general !== "INACTIVO") {
    return res.status(400).json({ message: "El estatus general solo puede ser ACTIVO o INACTIVO" });
  }

  const tipoUsuario = await controlTipoUsuario.obtenerTipoUsuarioById(id_tipouser);
  if (!tipoUsuario) {
    return res.status(400).json({ message: "El tipo de usuario no es válido" });
  }

  const permisos_lista = ["ALL_SA", "AD_USUARIOS_SA", "AD_EMPLEADOS_SA",
    "AD_JUICIOS_SA", "AD_GENEROS_SA",
    "AD_ESTADOSCIVILES_SA", "AD_MOTIVOS_SA", "AD_CATALOGOREQUISITOS_SA", "CONSULTA_ASESORIA_SA",
    "REGISTRO_ASESORIA_SA", "TURNAR_ASESORIA_SA", "ALL_SD", "AD_ESCOLARIDAD_SD",
    "AD_ETNIA_SD", "AD_JUZGADO_SD", "AD_OCUPACION_SD",
    "CONSULTA_PROCESO_JUDICIAL_SD", "SEGUIMIENTO_PROCESO_JUDICIAL_SD",
    "REGISTRO_PROCESO_JUDICIAL_SD"];

  if (permisos === undefined) {
    return res.status(400).json({ message: "El campo de permisos no puede ser nulo" });
  }

  //Verifica que al menos la variable permisos sea un arreglo
  if (!Array.isArray(permisos)) {
    return res.status(400).json({ message: "El campo de permisos debe de ser un arreglo" });
  }

  //Verifica que el campo de permisos solo contenga strings y que sean de la lista de permisos
  for (let i = 0; i < permisos.length; i++) {
    if (typeof permisos[i] !== "string") {
      return res.status(400).json({ message: "El campo de permisos solo debe de contener strings" });
    }

    if (!permisos_lista.includes(permisos[i])) {
      return res.status(400).json({ message: "El campo de permisos solo debe de contener los permisos válidos" });
    }
  }

  try {
    const usuario = await controlUsuario.obtenerUsuarioPorId(id_usuario);
    const usuario_obj = JSON.parse(JSON.stringify(usuario));

    if (usuario_obj.tipo_user.id_tipouser !== id_tipouser) {
      return res.status(400).json({ message: "No se puede cambiar el tipo de usuario" });
    }

    if (id_tipouser === 2 || id_tipouser === 3) {
      if (usuario_obj.id_empleado !== id_empleado) {
        return res.status(400).json({ message: "No se puede cambiar el empleado" });
      }
      if (usuario_obj.id_distrito_judicial !== id_distrito_judicial) {
        return res.status(400).json({ message: "No se puede cambiar el distrito judicial del empleado" });
      }
    }

    if (id_tipouser === 1 || id_tipouser > 3) {
      if (usuario_obj.id_distrito_judicial !== id_distrito_judicial) {
        return res.status(400).json({ message: "No se puede cambiar el distrito judicial" });
      }
    }

  } catch (error) {
    return res.status(400).json({ message: "Error al obtener el usuario" });
  }
  logger.info("Fin del middleware para validar el JSON del usuario en el PUT");
  next();
}

module.exports = {
  existeUsuario,
  validarJSONUsuarioPOST,
  validarJSONUsuarioPUT
}