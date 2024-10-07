const controlAsesorias = require('../controles/controlAsesoria.js');

const controlGeneros = require('../controles/controlGenero.js');

async function existeAsesoria(req, res, next) {
  const { id } = req.params;
  const asesoria = await controlAsesorias.obtenerAsesoriaPorId(id);
  if (!asesoria) {
    return res.status(404).json({ message: "La asesoría no existe." });
  }
  next();
}
const { HOSTGRPCCODIGOSPOSTALES, HOSTTOKENUSUARIOS } = require("../configuracion/default.js");

// Variable para cargar el módulo de gRPC
const grpc = require('@grpc/grpc-js');
// Variable para cargar el módulo de proto-loader
const { packageDefinition2 } = require("../clienteCodigosPostales/cliente.js")

// Variable para cargar el módulo de gRPC
const grpc3 = require('@grpc/grpc-js');
// Variable para cargar el módulo de proto-loader
const { packageDefinition3 } = require("../clienteUsuarios/cliente.js")
const controlMunicipioDistrito = require('../controles/controlMunicipioDistro.js');
const controlDistrito = require('../controles/controlDistritosJudiciales.js');
const controlRecibidos = require('../controles/controlCatalogoRequisito.js');
const controlTipoJuicio = require('../controles/controlTipoJuicio.js');
const controlEmpleado = require('../controles/controlEmpleados.js');
const controlEstadoCivil = require('../controles/controlEstadoCivil.js');
const controlMotivos = require('../controles/controlMotivo.js');
const controlDefensor = require('../controles/controlDefensor.js');
const controlPersonas = require('../controles/controlPersonas.js');
const controlDomicilios = require('../controles/controlDomicilio.js');

const logger = require('../utilidades/logger');


async function validarPeticionPaginacion(req, res, next) {
 logger.info("Middleware para validar la paginación")
  if (Object.keys(req.query).length > 1) {
    return res.status(400).json({ message: "Sólo se permite el parámetro página." });
  }

  const { pagina } = req.query;
  if (!pagina) {
    return res.status(400).json({ message: "La página es requerida." });
  }
 
   logger.info("Fin del middleware para validar la paginación")
  next();
}

async function validarPaginaFiltro(req, res, next) {
  logger.info("Middleware para validar la paginación y los filtros")
  const { pagina } = req.query;
  if (!pagina) {
    return res.status(400).json({ message: "La página es requerida." });
  }
  logger.info("Fin del middleware para validar la paginación y los filtros")
  next();
}


async function validarPeticionBuscarNombre(req, res, next) {
  logger.info("Middleware para validar la búsqueda por nombre")
  const { nombre, apellido_materno, apellido_paterno,pagina, total, ...extraData } = req.query;
  //Evalua que solo esten los parametros requeridos nombre, appellido materno y paterno y que no haya mas parametros

  //Alguno de los tres debe de existir
  if (!nombre && !apellido_materno && !apellido_paterno ) {
    return res.status(400).json({ message: "Al menos uno de los siguientes parámetros es requerido: nombre, apellido_materno, apellido_paterno, pagina." });
  }


  if (Object.keys(extraData).length > 0) {
    return res.status(400).json({ message: "Sólo se permiten los parámetros nombre, apellido_materno y apellido_paterno." });
  }
   logger.info("Fin del middleware para validar la búsqueda por nombre")
  next();
}



async function validarPeticionDescargarExcel(req, res, next) {
  logger.info("Middleware para validar la descarga de un archivo Excel")
  const filtrosPeticion = req.query.filtros;

  //Verifca que exista el filtro 
  if (filtrosPeticion) {
    const filtros = JSON.parse(filtrosPeticion);
    const filtroKeys = Object.keys(filtros);
    if (filtroKeys.length === 0) {
      return res.status(400).json({ message: "El arreglo de filtros no debe estar vacío." });
    }
    if (filtroKeys.length > 8) {
      return res.status(400).json({ message: "El arreglo de filtros no debe tener más de 8 elementos." });
    }

    const clavesEsperadas = ['fecha-inicio', 'fecha-final', 'id_defensor', 'id_municipio', 'id_zona', 'id_asesor', 'fecha_registro', 'id_distrito_judicial'];
    const clavesInvalidas = filtroKeys.filter(key => !clavesEsperadas.includes(key));
    if (clavesInvalidas.length > 0) {
      return res.status(400).json({ message: `Las siguientes claves no son válidas: ${clavesInvalidas.join(', ')}` });
    }
  }

  const camposPeticion = req.query.campos;
  if (camposPeticion) {
    const campos = JSON.parse(camposPeticion);
    const camposPosibles = ['nombre-asesorado', 'nombre-usuario', 'nombre-empleado', 'genero', 'colonia', 'trabaja', 'ingreso_mensual', 'motivo', 'estado_civil', 'telefono', 'numero_hijos', 'fecha_registro', 'tipo_juicio', 'conclusion', 'documentos-recibidos', 'resumen'];
    //Osea la variable de campos debe de contener al menos un campo de los camposposibles, y si campos contiene un campo que no esta en campos posibles, se debe de regresar un error 
    if (campos.length === 0) {
      return res.status(400).json({ message: "El arreglo de campos no debe estar vacío." });
    }
    if (campos.length > 15) {
      return res.status(400).json({ message: "El arreglo de campos no debe tener más de 15 elementos." });
    }
    const camposInvalidos = []
    campos.forEach(campo => {
      if (!camposPosibles.includes(campo)) {
        camposInvalidos.push(campo);
      }
    });

    if (camposInvalidos.length > 0) {
      console.log('campos invalidos', camposInvalidos)
      return res.status(400).json({ message: `Los siguientes campos no son válidos: ${camposInvalidos.join(', ')}` });
    }
  }
  logger.info("Fin del middleware para validar la descarga de un archivo Excel")
  next();
}

async function validarPeticionPOST(req, res, next) {
    logger.info("Middleware para validar el JSON de la asesoría en el POST")  
  const { asesorado, persona, datos_asesoria, recibidos, tipos_juicio, empleado, ...extraData } = req.body;

  if (Object.keys(extraData).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
    }
    );
  }
  const { nombre, apellido_paterno, apellido_materno, edad, telefono, domicilio, genero, ...extraData3 } = persona;
  if (Object.keys(extraData3).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición por la parte de persona que no son permitidos.'
    }
    );
  }

  //Engloba la validacion de nombre, apellido paterno y materno, edad, que no esten vacios en un solo if
  if (!nombre) {
    return res.status(400).json({ message: "El nombre es requerido." });
  }

  if (!apellido_paterno) {
    return res.status(400).json({ message: "El apellido paterno es requerido." });
  }

  if (!apellido_materno) {
    return res.status(400).json({ message: "El apellido materno es requerido." });
  }

  if (!edad) {
    return res.status(400).json({ message: "La edad es requerida." });
  }

  if (!genero) {
    return res.status(400).json({ message: "El genero es requerido." });
  }
  // Expresión regular para validar que solo se ingresen letras y espacios en blanco
  var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  if (nombre.length > 50) {
    return res.status(400).json({ message: "El nombre no puede tener más de 50 caracteres." });
  }
  if (!nombrePattern2.test(nombre)) {
    return res.status(400).json({ message: "El nombre solo permite letras." });
  }


  if (apellido_paterno.length > 50) {
    return res.status(400).json({ message: "El apellido paterno no puede tener más de 50 caracteres." });
  }

  if (!nombrePattern2.test(apellido_paterno)) {
    return res.status(400).json({ message: "El apellido paterno solo permite letras." });
  }

  if (apellido_materno.length > 50) {
    return res.status(400).json({ message: "El apellido materno no puede tener más de 50 caracteres." });
  }

  if (!nombrePattern2.test(apellido_materno)) {
    return res.status(400).json({ message: "El apellido materno solo permite letras." });
  }

  try {
    if (!Number.isInteger(parseInt(edad))) {
      return res.status(400).json({ message: "La edad solo permite números." });
    }
    if (edad > 200) {
      return res.status(400).json({ message: "La edad no puede ser mayor a 200." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "La edad solo permite números." });
  }

  //En caso de que el telefono no este vacio, que sea un numero entero y que no supere los 10 caracteres
  if (telefono !== '') {
    if (telefono.length > 10) {
      return res.status(400).json({ message: "El teléfono no puede tener más de 10 caracteres." });
    }
    try {
      if (!Number.isInteger(parseInt(telefono))) {
        return res.status(400).json({ message: "El teléfono solo permite números." });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "El teléfono solo permite números." });
    }
  }

  //Verifica que el genero si exista
  try {
    const genero2 = await controlGeneros.obtenerGeneroPorPorIdMiddleware(genero.id_genero);
    if (!genero2) {
      return res.status(400).json({ message: "El id de género no existe, o no se encuentra activo" });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de género no existe, o no se encuentra activo" });
  }

  const { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, ...extraData2 } = persona.domicilio;

  if (Object.keys(extraData2).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'

    }
    );
  }
  //En esta primera validacion se verifica que no este vacio la calle y numero exterior , que domicilio no supere los 75 caracteres y que el numero exterior no sea mayor a 25 caracteres
  if (!calle_domicilio) {
    return res.status(400).json({ message: "La calle es requerida." });
  }
  if (!numero_exterior_domicilio) {
    return res.status(400).json({ message: "El número exterior es requerido." });
  }

  if (calle_domicilio.length > 75) {
    return res.status(400).json({ message: "La calle no puede tener más de 75 caracteres." });
  }

  if (numero_exterior_domicilio.length > 25) {
    return res.status(400).json({ message: "El número exterior no puede tener más de 25 caracteres." });
  }
  //Ahora evalua con un try catch que el numero entero exterior sea un numero entero
  try {
    if (!Number.isInteger(parseInt(numero_exterior_domicilio))) {
      return res.status(400).json({ message: "El número exterior solo permite números." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El número exterior solo permite números." });
  }

  //De igual manera en caso de que el numero interior no este vacio, que sea un numero entero y que no supere los 25 caracteres
  if (numero_interior_domicilio !== '') {
    if (numero_interior_domicilio.length > 25) {
      return res.status(400).json({ message: "El número interior no puede tener más de 25 caracteres." });
    }
    try {
      if (!Number.isInteger(parseInt(numero_interior_domicilio))) {
        return res.status(400).json({ message: "El número interior solo permite números." });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "El número interior solo permite números." });
    }
  }
  //Has lo mismo con id de colonia pero este no tiene un liminte como los anteriores
  if (id_colonia !== '') {
    try {
      if (!Number.isInteger(parseInt(id_colonia))) {
        return res.status(400).json({ message: "El id de colonia debe ser un número." });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "El id de colonia debe ser un número." });
    }
    try {
      let codigo_client = grpc.loadPackageDefinition(packageDefinition2).codigoService;
      const validador = new codigo_client.CodigoService(HOSTGRPCCODIGOSPOSTALES, grpc.credentials.createInsecure());
      const auxiliar = [];

      const validarCodigoPromise = new Promise((resolve, reject) => {
        validador.validarCodigo({ id_colonia: id_colonia }, function (err, response) {
          if (err) {
            reject(err);
          } else {
            if (response.message === "Codigo inválido") {
              auxiliar.push(response.message);
            }
            resolve();
          }
        });
      });
      await validarCodigoPromise;
      if (auxiliar.length > 0) {
        return res.status(400).json({ message: "El id de colonia no existe." });
      }
    } catch (error) {
      return res.status(400).json({ message: "El id de colonia no existe." });
    }
  }


  //Validaciones con respecto al asesorado
  const { estatus_trabajo, numero_hijos, ingreso_mensual, motivo, estado_civil, ...extraData4 } = asesorado;
  if (Object.keys(extraData4).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'

    }
    );
  }
  if (estatus_trabajo === undefined) {
    return res.status(400).json({ message: "El estatus de trabajo es requerido." });
  }

  if (!numero_hijos) {
    return res.status(400).json({ message: "El número de hijos es requerido." });
  }

  if (!estado_civil) {
    return res.status(400).json({ message: "El estado civil es requerido." });
  }

  //AL menos uno de los campos debe de existir ya sea motivo o ingreso mensual
  if (!motivo && !ingreso_mensual) {
    return res.status(400).json({ message: "El motivo o el ingreso mensual es requerido." });
  }

  if (!ingreso_mensual) {
    try {
      const motivo2 = await controlMotivos.obtenerMotivoPorPorIdMiddleware(motivo.id_motivo);
      if (!motivo2) {
        return res.status(400).json({ message: "El id de motivo no existe, o no esta activo." });
      }
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({ message: "El id de motivo no existe, o no esta activo." });
    }
  }
  else if (ingreso_mensual) {
    //10001 y 9999 esos son los unicos dos valores a aceptar osea solamente 10001 o 9999
    if (ingreso_mensual !== 10001 && ingreso_mensual !== 9999) {
      return res.status(400).json({ message: "El ingreso mensual solo puede ser 10001 o 9999." });
    }
  }

  //Evalua que el numero de hijos sea entero y que no sea mayor a 200
  try {
    if (!Number.isInteger(parseInt(numero_hijos))) {
      return res.status(400).json({ message: "El número de hijos solo permite números." });
    }
    if (numero_hijos > 200) {
      return res.status(400).json({ message: "El número de hijos no puede ser mayor a 200." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El número de hijos solo permite números." });
  }

  if (estatus_trabajo !== Boolean(estatus_trabajo)) {
    return res.status(400).json({ message: "El estatus de trabajo solo permite true o false." });
  }
  //Evaluar que exista el estadoCivil con try catch
  try {
    const estadoCivil2 = await controlEstadoCivil.obtenerEstadoCivilPorPorIdMiddleware(estado_civil.id_estado_civil);
    if (!estadoCivil2) {
      return res.status(400).json({ message: "El id de estado civil no existe, o no esta activo" });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El id de estado civil no existe, o no esta activo" });
  }

  //Valida que exista el tipo de juicio
  try {
    const tipoJuicio2 = await controlTipoJuicio.obtenerTipoJuicioPorPorIdMiddleware(tipos_juicio.id_tipo_juicio);
    if (!tipoJuicio2) {
      return res.status(400).json({ message: "El id de tipo de juicio no existe, o no esta activo" });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de tipo de juicio no existe, o no esta activo" });
  }
  //Evalua que exista el empleado y este activo
  try {
    const empleado2 = await controlEmpleado.obtenerEmpleadoPorPorIdMiddleware(empleado.id_empleado);
    if (!empleado2) {
      return res.status(400).json({ message: "El id de empleado no existe, o no esta activo" });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de empleado no existe, o no esta activo" });
  }


  //Evalua que los recibidos cumplan con los parametros requeridos asi como estan en us json pero que esten activos
  try {
    const recibidos = req.body.recibidos;
    if (recibidos.length === 0) {
      return res.status(400).json({ message: "El arreglo de documentos recibidos no debe estar vacío." });
    }
    //Recorre cada uno y verifica que todos esten activos
    for (let i = 0; i < recibidos.length; i++) {
      const recibido = recibidos[i];
      const documento = await controlRecibidos.obtenerDocumentoPorPorIdMiddleware(recibido.id_catalogo);
      if (!documento) {
        return res.status(400).json({ message: "Alguno de los documentos recibidos no existe, o no esta activo" });
      }
    }
  }
  catch (error) {
    return res.status(400).json({ message: "Alguno de los documentos recibidos se encuentra inabilitado del sistema" });
  }

  //Evaluar que el json de datos asesoria cumpla con los parametros requeridos y no tenga mas parametros
  const { resumen_asesoria, conclusion_asesoria, estatus_requisitos, fecha_registro, usuario, id_usuario, estatus_asesoria, id_distrito_judicial, id_municipio_distrito, id_empleado, ...extraData5 } = datos_asesoria;
  if (Object.keys(extraData5).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'

    }
    );
  }

  if (!resumen_asesoria) {
    return res.status(400).json({ message: "El resumen de asesoría es requerido." });
  }
  if (!conclusion_asesoria) {
    return res.status(400).json({ message: "La conclusión de asesoría es requerida." });
  }

  if (estatus_requisitos === undefined) {
    return res.status(400).json({ message: "El estatus de requisitos es requerido." });
  }

  if (!fecha_registro) {
    return res.status(400).json({ message: "La fecha de registro es requerida." });
  }

  if (!usuario) {
    return res.status(400).json({ message: "El usuario es requerido." });
  }

  if (!id_usuario) {
    return res.status(400).json({ message: "El id de usuario es requerido." });
  }

  if (!estatus_asesoria) {
    return res.status(400).json({ message: "El estatus de asesoría es requerido." });
  }

  if (!id_distrito_judicial) {
    return res.status(400).json({ message: "El id de distrito judicial es requerido." });
  }

  if (!id_municipio_distrito) {
    return res.status(400).json({ message: "El id de municipio distrito es requerido." });
  }

  if (!id_empleado) {
    return res.status(400).json({ message: "El id de empleado es requerido." });
  }
  //Evalua que el resumen de asesoria no tenga mas de 500 caracteres
  if (resumen_asesoria.length > 500) {
    return res.status(400).json({ message: "El resumen de asesoría no puede tener más de 500 caracteres." });
  }

  //Evalua que la conclusion de asesoria no tenga mas de 250 caracteres
  if (conclusion_asesoria.length > 250) {
    return res.status(400).json({ message: "La conclusión de asesoría no puede tener más de 250 caracteres." });
  }

  //Estatus de requisitos solo puede ser true o false
  if (estatus_requisitos !== Boolean(estatus_requisitos)) {
    return res.status(400).json({ message: "El estatus de requisitos solo permite true o false." });
  }


  if (isNaN(Date.parse(fecha_registro))) {
    return res.status(400).json({
      message: "La fecha de registro no es válida."
    });
  }

  // el id del json de empleado y el del datos de asesoria debe de ser el mismo
  if (empleado.id_empleado !== id_empleado) {
    return res.status(400).json({ message: "El id de empleado no coincide." });
  }
  //Valida que estatus de asesoria sea NO_TURNADA', 'TURNADA
  if (estatus_asesoria !== 'NO_TURNADA' && estatus_asesoria !== 'TURNADA') {
    return res.status(400).json({ message: "El estatus de asesoría solo puede ser NO_TURNADA o TURNADA." });
  }

  //Valida que el id de distrito judicial exista
  try {
    const distrito = await controlDistrito.obtenerDistritoPorPorIdMiddleware(id_distrito_judicial);
    if (!distrito) {
      return res.status(400).json({ message: "El id de distrito judicial no existe" });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de distrito judicial no existe" });
  }

  //Valida que el id de municipio distrito exista
  try {
    const municipio = await controlMunicipioDistrito.obtenerMunicipioDistritoPorPorIdMiddleware(id_municipio_distrito);
    if (!municipio) {
      return res.status(400).json({ message: "El id de municipio distrito no existe" });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de municipio distrito no existe" });
  }

  //y el usuario no debe de superar los 135 caracteres
  try {
    if (!Number.isInteger(parseInt(id_usuario))) {
      return res.status(400).json({ message: "El id de usuario debe ser un número." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El id de usuario debe ser un número." });
  }

  if (usuario.length > 100) {
    return res.status(400).json({ message: "El usuario no puede tener más de 100 caracteres." });
  }


  try {
    let usuario_client = grpc3.loadPackageDefinition(packageDefinition3).servicios;
    const validador = new usuario_client.UsuarioService(HOSTTOKENUSUARIOS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarUsuarioPromise = new Promise((resolve, reject) => {
      validador.validarUsuario({ id_usuario: id_usuario, usuario: usuario }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Usuario inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    });
    await validarUsuarioPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El usuario no coincide." });
    }
  } catch (error) {
    console.log(error.message)
    return res.status(400).json({ message: "El usuario no coincide." });
  }
   logger.info("Fin del middleware para validar el JSON de la asesoría en el POST")

  next();

}



async function validarPeticionPUT(req, res, next) {
    logger.info("Middleware para validar el JSON de la asesoría en el PUT")
  const { turno, distrito_judicial, tipos_juicio, persona, municipio, datos_asesoria, ...extraData } = req.body;

  if (Object.keys(extraData).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
    }
    );
  }

  const { fecha_turno, hora_turno, id_defensor, id_asesoria, estatus_general, ...extraData2 } = turno;
  if (Object.keys(extraData2).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
    }
    );
  }

  if (!fecha_turno) {
    return res.status(400).json({ message: "La fecha de turno es requerida." });
  }

  if (!hora_turno) {
    return res.status(400).json({ message: "La hora de turno es requerida." });
  }

  if (!id_defensor) {
    return res.status(400).json({ message: "El id de defensor es requerido." });
  }

  if (!id_asesoria) {
    return res.status(400).json({ message: "El id de asesoría es requerido." });
  }

  if (!estatus_general) {
    return res.status(400).json({ message: "El estatus general es requerido." });
  }

  if (estatus_general !== 'NO_SEGUIMIENTO') {
    return res.status(400).json({ message: "El estatus general solo puede ser NO_SEGUIMIENTO ." });
  }

  if (isNaN(Date.parse(fecha_turno))) {
    return res.status(400).json({
      message: "La fecha de turno no es válida."
    });
  }
  //Validacion en formato de 24 horas
  var horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!horaRegex.test(hora_turno)) {
    return res.status(400).json({ message: 'La hora del turno no es válida formato de 24 horas, por favor ingrese un valor válido.' });
  }


  try {
    if (!Number.isInteger(parseInt(id_defensor))) {
      return res.status(400).json({ message: "El id de defensor debe ser un número." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El id de defensor debe ser un número." });
  }

  try {
    if (!Number.isInteger(parseInt(id_asesoria))) {
      return res.status(400).json({ message: "El id de asesoría debe ser un número." });
    }

  }
  catch (error) {
    return res.status(400).json({ message: "El id de asesoría debe ser un número." });
  }

  //Consulta haber si existe el id de asesoria y el id de defensor
  try {
    const asesoria = await controlAsesorias.obtenerAsesoriaIDSimpleMiddleware(id_asesoria);
    if (!asesoria) {
      return res.status(400).json({ message: "El id de asesoría no existe." });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de asesoría no existe." });
  }

  try {
    const defensor = await controlEmpleado.obtenerEmpleadoPorPorIdMiddleware(id_defensor);
    if (!defensor) {
      return res.status(400).json({ message: "El id de defensor no existe, o no esta activo en el sistema." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El id de defensor no existe, o no esta activo en el sistema." });
  }
  try {




    const asesoria_obtenida = await controlAsesorias.obtenerAsesoriaIDSimpleMiddleware(id_asesoria);
    const asesoria_object = JSON.parse(JSON.stringify(asesoria_obtenida.dataValues));

    if (asesoria_object.id_tipo_juicio !== tipos_juicio.id_tipo_juicio) {
      return res.status(400).json({ message: "El id de tipo de juicio no coincide." });
    }
    if (asesoria_object.id_municipio_distrito !== municipio.id_municipio_distrito) {
      return res.status(400).json({ message: "El id de municipio distrito no coincide." });
    }
    if (asesoria_object.id_distrito_judicial !== distrito_judicial.id_distrito_judicial) {
      return res.status(400).json({ message: "El id de distrito judicial no coincide." });
    }
    if (asesoria_object.id_usuario !== datos_asesoria.id_usuario) {
      return res.status(400).json({ message: "El id de usuario no coincide." });
    }

    /*if (asesoria_object.usuario !== datos_asesoria.usuario) {
      return res.status(400).json({ message: "El usuario no coincide." });
    } 
*/
    if (asesoria_object.fecha_registro !== datos_asesoria.fecha_registro) {
      return res.status(400).json({ message: "La fecha de registro no coincide." });
    }
    //Verifica el estatus de requisitos que sean iguales
    if (asesoria_object.estatus_requisitos !== datos_asesoria.estatus_requisitos) {
      return res.status(400).json({ message: "El estatus de requisitos no coincide." });
    }

    //EL estatus de asesoria solo puede ser NO_TURNADA o TURNADA
    if (datos_asesoria.estatus_asesoria !== 'TURNADA') {
      return res.status(400).json({ message: "El estatus de asesoría solo puede ser TURNADA." });
    }

    //El id de asesoriado es igual al de persona asi que no debe de ser diferente
    if (asesoria_object.id_asesorado !== persona.id_persona) {
      return res.status(400).json({ message: "El id de asesorado no coincide." });
    }

    if (asesoria_object.conclusion_asesoria !== datos_asesoria.conclusion_asesoria) {
      return res.status(400).json({ message: "La conclusión de asesoría no coincide." });
    }
    //El nuevo resumen no debe de estar vacio y no debe de superar los 500 caracteres
    if (!datos_asesoria.resumen_asesoria) {
      return res.status(400).json({ message: "El resumen de asesoría es requerido." });
    }
    if (datos_asesoria.resumen_asesoria.length > 500) {
      return res.status(400).json({ message: "El resumen de asesoría no puede tener más de 500 caracteres." });
    }
    //Verifica que el id 
  }
  catch (error) {
  }



  //Hacer validaciones con respecto a los datos de la persona  incluye el id
  const { nombre, apellido_materno, apellido_paterno, edad, telefono, domicilio, genero, id_persona, ...extraData5 } = persona;
  if (Object.keys(extraData5).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición por la parte de persona que no son permitidos.'
    }
    );
  }
  //Verifica que la persona exista;
  try {
    const persona2 = await controlPersonas.obtenerPersonaPorPorIdMiddleware(id_persona);
    if (!persona2) {
      return res.status(400).json({ message: "El id de persona no existe." });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de persona no existe." });
  }


  if (!nombre) {
    return res.status(400).json({ message: "El nombre es requerido." });
  }

  if (!apellido_paterno) {
    return res.status(400).json({ message: "El apellido paterno es requerido." });
  }

  if (!apellido_materno) {
    return res.status(400).json({ message: "El apellido materno es requerido." });
  }

  if (!edad) {
    return res.status(400).json({ message: "La edad es requerida." });
  }





  //Valida que la edad sea un numero entero y que no sea mayor a 200 en try cat
  try {
    if (!Number.isInteger(parseInt(edad))) {
      return res.status(400).json({ message: "La edad solo permite números." });
    }
    if (edad > 200) {
      return res.status(400).json({ message: "La edad no puede ser mayor a 200." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "La edad solo permite números." });
  }
  // Expresión regular para validar que solo se ingresen letras y espacios en blanco
  var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  if (nombre.length > 50) {
    return res.status(400).json({ message: "El nombre no puede tener más de 50 caracteres." });
  }
  if (!nombrePattern2.test(nombre)) {
    return res.status(400).json({ message: "El nombre solo permite letras." });
  }


  if (apellido_paterno.length > 50) {
    return res.status(400).json({ message: "El apellido paterno no puede tener más de 50 caracteres." });
  }

  if (!nombrePattern2.test(apellido_paterno)) {
    return res.status(400).json({ message: "El apellido paterno solo permite letras." });
  }

  if (apellido_materno.length > 50) {
    return res.status(400).json({ message: "El apellido materno no puede tener más de 50 caracteres." });
  }

  if (!nombrePattern2.test(apellido_materno)) {
    return res.status(400).json({ message: "El apellido materno solo permite letras." });
  }


  //Verifica que el genero si exista
  try {
    const genero2 = await controlGeneros.obtenerGeneroPorPorIdMiddleware(genero.id_genero);
    if (!genero2) {
      return res.status(400).json({ message: "El id de género no existe, o no se encuentra activo" });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de género no existe, o no se encuentra activo" });
  }

  //Si el telefono no esta verifica que sea puro enteros y que la longitud no sea mayor a 10
  try {
    if (telefono !== '') {
      if (telefono.length > 10) {
        return res.status(400).json({ message: "El teléfono no puede tener más de 10 caracteres." });
      }
      if (!Number.isInteger(parseInt(telefono))) {
        return res.status(400).json({ message: "El teléfono solo permite números." });
      }
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El teléfono solo permite números." });
  }

  const { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_domicilio, ...extraData8 } = persona.domicilio;

  if (Object.keys(extraData8).length > 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'

    }
    );
  }

  //OBtener domicilio para ver si existe 
  try {
    const domicilio2 = await controlDomicilios.obtenerDomicilioPorIdMiddleware(id_domicilio);
    if (!domicilio2) {
      return res.status(400).json({ message: "El id de domicilio no existe." });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de domicilio no existe." });
  }


  //En esta primera validacion se verifica que no este vacio la calle y numero exterior , que domicilio no supere los 75 caracteres y que el numero exterior no sea mayor a 25 caracteres
  if (!calle_domicilio) {
    return res.status(400).json({ message: "La calle es requerida." });
  }
  if (!numero_exterior_domicilio) {
    return res.status(400).json({ message: "El número exterior es requerido." });
  }

  if (calle_domicilio.length > 75) {
    return res.status(400).json({ message: "La calle no puede tener más de 75 caracteres." });
  }

  if (numero_exterior_domicilio.length > 25) {
    return res.status(400).json({ message: "El número exterior no puede tener más de 25 caracteres." });
  }
  //Ahora evalua con un try catch que el numero entero exterior sea un numero entero
  try {
    if (!Number.isInteger(parseInt(numero_exterior_domicilio))) {
      return res.status(400).json({ message: "El número exterior solo permite números." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El número exterior solo permite números." });
  }

  //De igual manera en caso de que el numero interior no este vacio, que sea un numero entero y que no supere los 25 caracteres
  if (numero_interior_domicilio !== '') {
    if (numero_interior_domicilio.length > 25) {
      return res.status(400).json({ message: "El número interior no puede tener más de 25 caracteres." });
    }
    try {
      if (!Number.isInteger(parseInt(numero_interior_domicilio))) {
        return res.status(400).json({ message: "El número interior solo permite números." });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "El número interior solo permite números." });
    }
  }

  try {
    if (!Number.isInteger(parseInt(id_colonia))) {
      return res.status(400).json({ message: "El id de colonia debe ser un número." });
    }
  }
  catch (error) {
    return res.status(400).json({ message: "El id de colonia debe ser un número." });
  }
  try {
    let codigo_client = grpc.loadPackageDefinition(packageDefinition2).codigoService;
    const validador = new codigo_client.CodigoService(HOSTGRPCCODIGOSPOSTALES, grpc.credentials.createInsecure());
    const auxiliar = [];

    const validarCodigoPromise = new Promise((resolve, reject) => {
      validador.validarCodigo({ id_colonia: id_colonia }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Codigo inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    });
    await validarCodigoPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El id de colonia no existe." });
    }
  } catch (error) {
    return res.status(400).json({ message: "El id de colonia no existe." });
  }
  logger.info("Fin del middleware para validar el JSON de la asesoría en el PUT")
  next();
}


async function validarFiltros(req, res, next) {

  logger.info("Middleware para validar los filtros de la petición")
  const filtrosPeticion = req.query.filtros;

  //Verifca que exista el filtro 
  if (!filtrosPeticion) {
    return res.status(400).json({ message: "El filtro es requerido." });
  }

  const filtros = JSON.parse(filtrosPeticion);
  const filtroKeys = Object.keys(filtros);
  if (filtroKeys.length === 0) {
    return res.status(400).json({ message: "El arreglo de filtros no debe estar vacío." });
  }
  if (filtroKeys.length > 8) {
    return res.status(400).json({ message: "El arreglo de filtros no debe tener más de 8 elementos." });
  }

  const clavesEsperadas = ['fecha-inicio', 'fecha-final', 'id_defensor', 'id_municipio', 'id_zona', 'id_asesor', 'fecha_registro', 'id_distrito_judicial'];
  const clavesInvalidas = filtroKeys.filter(key => !clavesEsperadas.includes(key));
  if (clavesInvalidas.length > 0) {
    return res.status(400).json({ message: `Las siguientes claves no son válidas: ${clavesInvalidas.join(', ')}` });
  }


  //Verifica que no exitan mas dar

   logger.info("Fin del middleware para validar los filtros de la petición")
  next();
}



module.exports = {
  existeAsesoria,
  validarPaginaFiltro,
  validarPeticionPaginacion,
  validarPeticionBuscarNombre,
  validarPeticionDescargarExcel,
  validarPeticionPOST,
  validarFiltros,
  validarPeticionPUT,
};

