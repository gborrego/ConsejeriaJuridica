const controlAsesorias = require('../controles/controlAsesoria');
const asyncError = require("../utilidades/asyncError");
const CustomeError = require("../utilidades/customeError");
const ExcelJS = require('exceljs');


const logger = require('../utilidades/logger');
const { log } = require('winston');


/**
 * @abstract Servicio  que permite obtener una asesoría por filtro
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesoria de la base de datos
 *  */
const obtenerAsesoriaFiltro = asyncError(async (req, res, next) => {
 logger.info("Petición para obtener asesorías por filtro recibida") 
   
  logger.info("Filtros: "+req.query.filtros)
  const filtros = JSON.parse(req.query.filtros);

  logger.info("Llamada al metodo obtenerAsesoriasFiltro")
  
  const result = await controlAsesorias.obtenerAsesoriasFiltro(filtros);
  
  logger.info("Se verifica si el resultado es nulo o indefinido")
  if (result === null || result === undefined || result.length === 0) {
  
    logger.info("No se encontraron asesorías")
    const error = new CustomeError('No se encontraron asesorías', 404);
    return next(error);
  } else {
    logger.info("Se encontraron asesorías")
    res.status(200).json({
      asesorias: result
    });
  }
}
);



/**
 * @abstract Servicio  que permite obtener una asesoría por filtro para paginación
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesoria de la base de datos
 * */
const obtenerAsesoriasPagina = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener asesorías por página recibida") 

   logger.info("Se obtiene la página", req.query.pagina)
  const pagina = req.query.pagina;

  logger.info("Llamada al metodo obtenerAsesoriasPorPagina, para obtener las asesorías de la página")
  const result = await controlAsesorias.obtenerAsesoriasPorPagina(pagina);

  logger.info("Se verifica si el resultado contiene asesorías o si es nulo o indefinido")
  if (result === null || result === undefined || result.length === 0) {
    logger.info("No se encontraron asesorías")
    const error = new CustomeError('No se encontraron asesorías', 404);
    return next(error);
  } else {
    logger.info("Se encontraron asesorías")
    res.status(200).json({
      asesorias: result
    });
  }
}
);

const obtenerAsesoriasPaginaFiltro = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener asesorías por página recibida")


   logger.info("Se obtienen las paginas y los filtros", req.query.pagina, req.query.filtros)
  const filtros = JSON.parse(req.query.filtros);
  const pagina = req.query.pagina;

  logger.info("Llamada al metodo obtenerAsesoriasFiltroPagina, para obtener las asesorías de la página")
  const result = await controlAsesorias.obtenerAsesoriasFiltroPagina(pagina, filtros);

  logger.info("Se verifica si el resultado contiene asesorías o si es nulo o indefinido")
  if (result === null || result === undefined || result.length === 0) {

    logger.info("No se encontraron asesorías")
    const error = new CustomeError('No se encontraron asesorías', 404);
    return next(error);
  } else {
    logger.info("Se encontraron asesorías")
    res.status(200).json({
      asesorias: result
    });
  }
}
);


/**
 * @abstract Servicio  que permite obtener una asesoría por filtro para exportar a excel
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesoria de la base de datos
 * */
const obtenerAsesoriaFiltroExcel = asyncError(async (req, res, next) => {
   logger.info("Petición para obtener asesorías por filtro para exportar a excel recibida")  


  logger.info("Filtros: "+req.query.filtros)
  const filtros = req.query.filtros;


  let result = {};

  logger.info("Se verifica si los filtros son nulos o indefinidos esto con el fin de obtener las asesorias con filtros o sin filtros")
  if (filtros === null || filtros === undefined || filtros === '') {
    try {
      logger.info("Llamada al metodo obtenerAsesorias, para obtener las asesorías")
      const resultA = await controlAsesorias.obtenerAsesorias();

      logger.info("Se verifica si el resultado es nulo o indefinido")
      if (resultA.length === 0) {
        result = null;
      } else {
        result = resultA;
      }
    } catch (error) {
      logger.info("Error al obtener las asesorías sin filtros")
     // console.log('error', error);
      result = null;
    }

  } else {

    try {
      logger.info("Llamada al metodo obtenerAsesoriasFiltro, para obtener las asesorías con filtros")
      const resultB = await controlAsesorias.obtenerAsesoriasFiltro(JSON.parse(req.query.filtros));
       
      logger.info("Se verifica si el resultado es nulo o indefinido")
      if (resultB.length === 0) {
        result = null;
      }
      else {
        result = resultB;
      }
    } catch (error) {
      logger.info("Error al obtener las asesorías con filtros")
     // console.log('error', error);
      result = null;
    }
  }
  if (result === null) {
    const error = new CustomeError('No se encontraron asesorías', 404);
    return next(error);
  }


  const verificadorCampos = req.query.campos;


  logger.info("Se verifica si los campos son nulos o indefinidos esto con el fin de obtener las asesorias con determinados campos o con todos los campos")
  if (verificadorCampos === null || verificadorCampos === undefined || verificadorCampos === '' || verificadorCampos === 'null') {
   try{

     logger.info("Se obtienen la asesorías con todos los campos") 
    const campos = ['nombre-asesorado', 'nombre-usuario', 'nombre-empleado', 'genero', 'colonia', 'trabaja', 'ingreso_mensual', 'motivo', 'estado_civil', 'telefono', 'numero_hijos', 'fecha_registro', 'tipo_juicio', 'conclusion', 'documentos-recibidos', 'resumen'];

    const asesoriasFiltradas = JSON.parse(JSON.stringify(result));
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Asesorías');

    // Mapear los encabezados según los campos solicitados
    const encabezados = [];
    const encabezadosMappings = {
      'nombre-asesorado': 'Nombre de Asesorado',
      'nombre-usuario': 'Nombre de Usuario',
      'nombre-empleado': 'Nombre Empleado', // Ajusta según sea necesario
      'genero': 'Género',
      'colonia': 'Colonia',
      'trabaja': 'Trabaja',
      'ingreso_mensual': 'Ingreso Mensual',
      'motivo': 'Motivo',
      'estado_civil': 'Estado Civil',
      'telefono': 'Teléfono',
      'numero_hijos': 'Número de Hijos',
      'fecha_registro': 'Fecha de Registro',
      'tipo_juicio': 'Tipo de Juicio',
      'conclusion': 'Conclusión',
      'documentos-recibidos': 'Documentos Recibidos',
      //     'usuario-cumple-requisitos': 'Usuario Cumple Requisitos',
      //     'hora-atencion': 'Hora de Atención',
      //    'fecha-atencion': 'Fecha de Atención',
      //      'usuario-turnado': 'Usuario Turnado',
      //    'responsable-turno': 'Responsable de Turno',
      'resumen': 'Reumen de Hechos',
    };

    campos.forEach((campo) => {
      if (encabezadosMappings[campo]) {
        encabezados.push(encabezadosMappings[campo]);
      }
    });

    // Agregar encabezados al libro de Excel
    sheet.addRow(encabezados);
    // Agregar datos al libro de Excel
    logger.info("Se agregan las asesorías al libro de excel")
    asesoriasFiltradas.forEach((asesoria) => {
      const asesorado = asesoria.asesorado;
      const turno = asesoria.turno;
      const tipos_juicio = asesoria.tipos_juicio;
      const recibidos = asesoria.recibidos;


      const asesor = asesoria.hasOwnProperty('asesor') ? asesoria.asesor : null;
      const defensor = asesoria.hasOwnProperty('defensor') ? asesoria.defensor : null;



      const persona = asesoria.persona;
      const distrito_judicial = asesoria.distrito_judicial;
      const municipio = asesoria.municipio;
      const datosAsesoria = asesoria.datos_asesoria;


      const filaDatos = [];

      // Mapear los datos según los campos solicitados
      campos.forEach((campo) => {
        switch (campo) {
          case 'nombre-asesorado':
            filaDatos.push(persona.nombre + ' ' + persona.apellido_paterno + ' ' + persona.apellido_materno);
            break;
          case 'nombre-usuario':
            filaDatos.push(datosAsesoria.usuario ? datosAsesoria.usuario : '');
            break;
          case 'nombre-empleado':
            const key = 'defensor';

            if (key in asesoria && asesoria[key] !== null) {
              filaDatos.push(defensor.nombre_defensor);
            } else {
              // Puedes manejar el caso cuando la clave no existe o es nula según tus necesidades
              filaDatos.push(asesor.nombre_asesor);
            }
            /*
                 if (asesoria.defensor !== null) {
                   filaDatos.push(defensor.nombre_defensor);
                 }
                 else if (asesoria.asesor !== null) {
                   filaDatos.push(asesor.nombre_asesor);
                 }
                   */
            break;
          case 'genero':
            filaDatos.push(persona.genero.descripcion_genero);
            break;
          case 'colonia':
            // Verifica si hay un número exterior antes de concatenar


            let direccion = persona.domicilio.calle_domicilio;

            if (persona.domicilio.numero_exterior_domicilio) {
              direccion += ' ' + persona.domicilio.numero_exterior_domicilio;
            }

            if (persona.domicilio.numero_interior_domicilio) {
              direccion += ' ' + persona.domicilio.numero_interior_domicilio;
            }

            filaDatos.push(direccion);
            break;
          case 'trabaja':
            filaDatos.push(asesorado.estatus_trabajo ? 'Sí' : 'No');
            break;
          case 'ingreso_mensual':
            if (asesorado && asesorado.ingreso_mensual) {
              filaDatos.push(asesorado.ingreso_mensual);
            } else {
              filaDatos.push('N/A');
            }
            break;
          case 'motivo':
            if (asesorado && asesorado.motivo && asesorado.motivo.descripcion_motivo) {
              filaDatos.push(asesorado.motivo.descripcion_motivo);
            } else {
              filaDatos.push('N/A');
            }
            break;
          case 'estado_civil':
            filaDatos.push(asesorado.estado_civil.estado_civil);
            break;
          case 'telefono':
            filaDatos.push(persona.telefono);
            break;
          case 'numero_hijos':
            filaDatos.push(asesorado.numero_hijos);
            break;
          case 'fecha_registro':
            filaDatos.push(datosAsesoria.fecha_registro);
            break;
          case 'tipo_juicio':
            filaDatos.push(tipos_juicio.tipo_juicio);
            break;
          case 'conclusion':
            filaDatos.push(datosAsesoria.conclusion_asesoria);
            break;
          case 'documentos-recibidos':
            let descripcionConcatenada = '';

            // Check if recibidos is defined and is an array
            if (recibidos && Array.isArray(recibidos) && recibidos.length > 0) {
              for (let i = 0; i < recibidos.length; i++) {
                descripcionConcatenada += recibidos[i].descripcion_catalogo;

                // Add a comma if not the last element
                if (i < recibidos.length - 1) {
                  descripcionConcatenada += ', ';
                }
              }
            } else {
              // Handle the case when recibidos is undefined, not an array, or empty
              descripcionConcatenada = 'No hay descripciones disponibles';
            }

            filaDatos.push(descripcionConcatenada);
            break;
          /*
                case 'usuario-cumple-requisitos':
                  filaDatos.push(datosAsesoria.estatus_requisitos ? 'Sí' : 'No');
                  break;
                case 'hora-atencion':
                  filaDatos.push(turno.hora_turno ? turno.hora_turno : 'N/A');
                  break;
                case 'fecha-atencion':
                  filaDatos.push(turno.fecha_turno ? turno.fecha_turno : 'N/A');
                  break;
                case 'usuario-turnado':
                  filaDatos.push(datosAsesoria.usuario ? datosAsesoria.usuario : '');
                  break;
                case 'responsable-turno':
                  filaDatos.push(datosAsesoria.usuario ? datosAsesoria.usuario : '');
                  break;
      
                */
          case 'resumen':
            filaDatos.push(datosAsesoria.resumen_asesoria ? datosAsesoria.resumen_asesoria : '');
            break;
        }
      });
      sheet.addRow(filaDatos);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=asesorias.xlsx');

    await workbook.xlsx.write(res);
    res.end();


  } catch (error) {
   // console.log('error', error);
    logger.info("Error al obtener las asesorías con todos los campos")   
   const error2 = new CustomeError('Error al obtener las asesorías', 404);
    return next(error2);
  }




  } else {

   logger.info("Se obtienen los campos, para obtener las asesorías con determinados campos")
    const campos = JSON.parse(verificadorCampos);
    const asesoriasFiltradas = JSON.parse(JSON.stringify(result));
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Asesorías');

    // Mapear los encabezados según los campos solicitados
    const encabezados = [];
    const encabezadosMappings = {
      'nombre-asesorado': 'Nombre de Asesorado',
      'nombre-usuario': 'Nombre de Usuario',
      'nombre-empleado': 'Nombre Empleado', // Ajusta según sea necesario
      'genero': 'Género',
      'colonia': 'Colonia',
      'trabaja': 'Trabaja',
      'ingreso_mensual': 'Ingreso Mensual',
      'motivo': 'Motivo',
      'estado_civil': 'Estado Civil',
      'telefono': 'Teléfono',
      'numero_hijos': 'Número de Hijos',
      'fecha_registro': 'Fecha de Registro',
      'tipo_juicio': 'Tipo de Juicio',
      'conclusion': 'Conclusión',
      'documentos-recibidos': 'Documentos Recibidos',
      //     'usuario-cumple-requisitos': 'Usuario Cumple Requisitos',
      //     'hora-atencion': 'Hora de Atención',
      //    'fecha-atencion': 'Fecha de Atención',
      //      'usuario-turnado': 'Usuario Turnado',
      //    'responsable-turno': 'Responsable de Turno',
      'resumen': 'Reumen de Hechos',
    };

    campos.forEach((campo) => {
      if (encabezadosMappings[campo]) {
        encabezados.push(encabezadosMappings[campo]);
      }
    });

    // Agregar encabezados al libro de Excel
    sheet.addRow(encabezados);
    // Agregar datos al libro de Excel
    logger.info("Se agregan las asesorías al libro de excel")
    asesoriasFiltradas.forEach((asesoria) => {
      const asesorado = asesoria.asesorado;
      const turno = asesoria.turno;
      const tipos_juicio = asesoria.tipos_juicio;
      const recibidos = asesoria.recibidos;


      const asesor = asesoria.hasOwnProperty('asesor') ? asesoria.asesor : null;
      const defensor = asesoria.hasOwnProperty('defensor') ? asesoria.defensor : null;



      const persona = asesoria.persona;
      const distrito_judicial = asesoria.distrito_judicial;
      const municipio = asesoria.municipio;
      const datosAsesoria = asesoria.datos_asesoria;


      const filaDatos = [];

      // Mapear los datos según los campos solicitados
      campos.forEach((campo) => {
        switch (campo) {
          case 'nombre-asesorado':
            filaDatos.push(persona.nombre + ' ' + persona.apellido_paterno + ' ' + persona.apellido_materno);
            break;
          case 'nombre-usuario':
            filaDatos.push(datosAsesoria.usuario ? datosAsesoria.usuario : '');
            break;
          case 'nombre-empleado':
            /*  const key = 'defensor';

          if (key in asesoria && asesoria[key] !== null) {
            filaDatos.push(asesoria[key].nombre_defensor);
          } else {
            // Puedes manejar el caso cuando la clave no existe o es nula según tus necesidades
            filaDatos.push(asesoria.asesor.nombre_asesor);
          }
       */
            if (defensor !== null) {
              filaDatos.push(defensor.nombre_defensor);
            }
            else if (asesoria.asesor !== null) {
              filaDatos.push(asesor.nombre_asesor);
            }

            break;
          case 'genero':
            filaDatos.push(persona.genero.descripcion_genero);
            break;
          case 'colonia':
            // Verifica si hay un número exterior antes de concatenar
            let direccion = persona.domicilio.calle_domicilio;

            if (persona.domicilio.numero_exterior_domicilio) {
              direccion += ' ' + persona.domicilio.numero_exterior_domicilio;
            }

            if (persona.domicilio.numero_interior_domicilio) {
              direccion += ' ' + persona.domicilio.numero_interior_domicilio;
            }

            filaDatos.push(direccion);
            break;
          case 'trabaja':
            filaDatos.push(asesorado.estatus_trabajo ? 'Sí' : 'No');
            break;
          case 'ingreso_mensual':
            if (asesorado && asesorado.ingreso_mensual) {
              filaDatos.push(asesorado.ingreso_mensual);
            } else {
              filaDatos.push('N/A');
            }
            break;
          case 'motivo':
            if (asesorado && asesorado.motivo && asesorado.motivo.descripcion_motivo) {
              filaDatos.push(asesorado.motivo.descripcion_motivo);
            } else {
              filaDatos.push('N/A');
            }
            break;
          case 'estado_civil':
            filaDatos.push(asesorado.estado_civil.estado_civil);
            break;
          case 'telefono':
            filaDatos.push(persona.telefono);
            break;
          case 'numero_hijos':
            filaDatos.push(asesorado.numero_hijos);
            break;
          case 'fecha_registro':
            filaDatos.push(datosAsesoria.fecha_registro);
            break;
          case 'tipo_juicio':
            filaDatos.push(tipos_juicio.tipo_juicio);
            break;
          case 'conclusion':
            filaDatos.push(datosAsesoria.conclusion_asesoria);
            break;
          case 'documentos-recibidos':
            let descripcionConcatenada = '';

            // Check if recibidos is defined and is an array
            if (recibidos && Array.isArray(recibidos) && recibidos.length > 0) {
              for (let i = 0; i < recibidos.length; i++) {
                descripcionConcatenada += recibidos[i].descripcion_catalogo;

                // Add a comma if not the last element
                if (i < recibidos.length - 1) {
                  descripcionConcatenada += ', ';
                }
              }
            } else {
              // Handle the case when recibidos is undefined, not an array, or empty
              descripcionConcatenada = 'No hay descripciones disponibles';
            }

            filaDatos.push(descripcionConcatenada);
            break;
          /*
                case 'usuario-cumple-requisitos':
                  filaDatos.push(datosAsesoria.estatus_requisitos ? 'Sí' : 'No');
                  break;
                case 'hora-atencion':
                  filaDatos.push(turno.hora_turno ? turno.hora_turno : 'N/A');
                  break;
                case 'fecha-atencion':
                  filaDatos.push(turno.fecha_turno ? turno.fecha_turno : 'N/A');
                  break;
                case 'usuario-turnado':
                  filaDatos.push(datosAsesoria.usuario ? datosAsesoria.usuario : '');
                  break;
                case 'responsable-turno':
                  filaDatos.push(datosAsesoria.usuario ? datosAsesoria.usuario : '');
                  break;
      
                */
          case 'resumen':
            filaDatos.push(datosAsesoria.resumen_asesoria ? datosAsesoria.resumen_asesoria : '');
            break;
        }
      });
      sheet.addRow(filaDatos);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=asesorias.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
});



/**
 * @abstract Servicio  que permite agregar una asesoría
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 *  @returns {Object} asesoria agregada a la base de datos
 */

const agregarAsesoria = asyncError(async (req, res, next) => {
  logger.info("Petición para agregar asesoría recibida")
  
  logger.info("Llamada al metodo agregarAsesoria")
  const result = await controlAsesorias.agregarAsesoria(req.body);

  logger.info("Se verifica si el resultado es falso")
  if (result === false) {
    logger.info("Error al agregar una asesoría")
    const error = new CustomeError('Error al agregar una asesoría', 400);
    return next(error);
  } else {
    logger.info("Asesoría agregada correctamente")
    res.status(201).json({
      asesoria: result
    });
  }
});





/**
 *  
 * @abstract Servicio  que permite actualizar una asesoría
 *  @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesoria actualizada en la base de datos
 */

const actualizarAsesoria = asyncError(async (req, res, next) => {
   logger.info("Petición para actualizar asesoría recibida")
  
  const result = await controlAsesorias.actualizarAsesoria(req.body);
  logger.info("Se verifica si el resultado es falso") 
  if (result === false) {
    logger.info("Error al actualizar la asesoría")
    const error = new CustomeError('Error al actualizar la asesoría', 400);
    return next(error);
  } else {
    logger.info("Asesoría actualizada correctamente")
    res.status(200).json({
      asesoria: req.body
    });
  }
});

/**
 * @abstract Servicio  que permite obtener una asesoría por su id
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesoria de la base de datos
 */

const obtenerAsesoriaPorId = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener asesoría por id recibida")

  logger.info("Llamada al metodo obtenerAsesoriaPorId")
  const result = await controlAsesorias.obtenerAsesoriaPorId(req.params.id);
  
  logger.info("Se verifica si el resultado es nulo o indefinido")
  if (result === null || result === undefined) {
    logger.info("Error al obtener la asesoría")
    const error = new CustomeError('Error al obtener la asesoría', 404);
    return next(error);
  } else {
    logger.info("Asesoría obtenida correctamente", result)
    res.status(200).json({
      asesoria: result
    });
  }


});

/**
 * @abstract Servicio  que permite obtener una asesoría por   nombre de la persona  asesorada
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Next
 * @returns {Object} asesoria   de la base de datos   por nombre de la persona asesorada
 */

const obtenerAsesoriaNombre = asyncError(async (req, res, next) => {

  logger.info("Petición para obtener asesoría por nombre de la persona asesorada recibida")

  logger.info("Se obtienen los parametros de la petición", req.query.nombre, req.query.apellido_paterno, req.query.apellido_materno)  

  const { nombre, apellido_materno, apellido_paterno,pagina,total } = req.query;

  logger.info("Se verifica si el total es verdadero o falso, con el fin de obtener todas las asesorías o solo el total")
  if(total !==undefined && total !==null && total === 'true'){
     
    logger.info("Llamada al metodo obtenerAsesoriasNombre para asi obtener el total de asesorías")
    const result = await controlAsesorias.obtenerAsesoriasNombre(nombre, apellido_paterno, apellido_materno,null, total); 

    logger.info("Se verifica si el resultado es nulo o indefinido")
    if (result === null || result === undefined ) {
      logger.info("Error al obtener las asesorías")
      const error = new CustomeError('Error al obtener las asesorías', 404);
      return next(error);
    } else {
      logger.info("Asesorías obtenidas correctamente",result)
      res.status(200).json({ 
        totalAsesorias: result
      });
    }
  }else {

    logger.info("Llamada al metodo obtenerAsesoriasNombre para asi obtener las asesorías")
    const result = await controlAsesorias.obtenerAsesoriasNombre(nombre, apellido_paterno, apellido_materno,pagina, null); 

    logger.info("Se verifica si el resultado es nulo o indefinido")
    if (result === null || result === undefined || result.length === 0) {
      logger.info("No se encontraron asesorías")
      const error = new CustomeError('Error al obtener las asesorías', 404);
      return next(error);
    } else {
      logger.info("Asesorías obtenidas correctamente")
      res.status(200).json({
        asesorias: result
      });
    }
  }

});

/**
 * @abstract Servicio  que permite obtener todas las asesorías
 */
const obtenerAsesoriaTotal = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener todas las asesorías recibida") 
   
  logger.info("Llamada al metodo obtenerAsesorias")
  const result = await controlAsesorias.obtenerTotalAsesoriasSistema();

  logger.info("Se verifica si el resultado es nulo o indefinido")
  if (result === null || result === undefined) {
    logger.info("Error al obtener las asesorías")
    const error = new CustomeError('Error al obtener las asesorías', 404);
    return next(error);
  } else {
    logger.info("Asesorías obtenidas correctamente")
    res.status(200).json({
      totalAsesorias: result
    });
  }
});

/**
 * @abstract Servicio  que permite obtener todas las asesorías
 */
const obtenerAsesoriaFiltroTotal = asyncError(async (req, res, next) => {
  logger.info("Petición para obtener asesorías por filtro recibida")

  logger.info("Filtros: "+req.query.filtros)
  const filtros = JSON.parse(req.query.filtros);

  logger.info("Llamada al metodo obtenerTotalAsesorias")
  const result = await controlAsesorias.obtenerTotalAsesorias(filtros);

  logger.info("Se verifica si el resultado es nulo o indefinido")
  if (result === null || result === undefined) {

    logger.info("Error al obtener las asesorías")
    const error = new CustomeError('Error al obtener las asesorías', 404);
    return next(error);
  } else {
    logger.info("Asesorías obtenidas correctamente")
    res.status(200).json({
      totalAsesoriasFiltro: result
    });
  }
});
//Module exports
module.exports = {
  agregarAsesoria,
  actualizarAsesoria,
  obtenerAsesoriaPorId,
  obtenerAsesoriaNombre,
  obtenerAsesoriaFiltro,
  obtenerAsesoriaFiltroExcel
  , obtenerAsesoriasPagina
  ,
  obtenerAsesoriaTotal,
  obtenerAsesoriaFiltroTotal,
  obtenerAsesoriasPaginaFiltro
};
