//Falta relacion de defensor y asesoria y actualizar controles
const modeloAsesoria = require('../modelos/modeloAsesoria');
const modeloDistritoJudicial = require('../modelos/modeloDistritoJudicial');
const logger = require('../utilidades/logger');

/** Operaciones Basica */
const controlPersonas = require('./controlPersonas');
const controlZonas = require('./controlZona');
const controlEstadoCivil = require('./controlEstadoCivil');
const controlMotivo = require('./controlMotivo');
const controlCatalogoRequisito = require('./controlCatalogoRequisito');
const controlDomicilios = require('./controlDomicilio');
const controlAsesorados = require('./controlAsesorados');
//const controlTurnos = require('./controlTurno');
const controlDetalleAsesoria = require('./controlDetalleAsesoria');
const controlAsesor = require('./controlAsesor');
const controlDefensor = require('./controlDefensor');
const controlEmpleado = require('./controlEmpleados');
const { Op, literal } = require("sequelize");
const Sequelize = require('sequelize');
const controlDistritoJudicial = require('./controlDistritosJudiciales');
const controlMunicipios = require('./controlMunicipioDistro');
const controlTurno = require('./controlTurno');

/**
 * @abstract Función que permite obtener asesorias por filtro
 * @returns asesorias
 */
const obtenerAsesoriasFiltro = async (filtros) => {
  try {
    logger.info("Se obtienen las asesorias por filtro", filtros)

    logger.info("Se obtiene el whereClause")
    const whereClause = await obtenerWhereClause(filtros);

    logger.info("Se obtienen las asesorias por filtro")
    const asesorias_pre = await modeloAsesoria.Asesoria.findAll({
      raw: false,
      nest: true,
      attributes: {
        exclude: ['id_asesorado',
          //'id_turno',
          'id_tipo_juicio']
      },
      include: [{
        model: modeloAsesoria.Asesorado,
      },
      {
        model: modeloAsesoria.DetalleAsesoriaCatalogo,
      },
      {
        model: modeloAsesoria.Turno,
      },
      {
        model: modeloAsesoria.DistritoJudicial
      },
      {
        model: modeloAsesoria.Empleado
      },

      // {
      //    model: modeloAsesoria.Empleado,
      //    include: [{
      //      model: modeloAsesoria.DistritoJudicial,
      //  }]
      //  },
      {
        model: modeloAsesoria.TipoJuicio,
      }
      ],
      where: whereClause,
    });

    logger.info("Se forman las asesorias, se recorre el arreglo de asesorias y se manda a llamar la funcion formarAsesoria")
    const asesorias = [];
    for (const asesoria_pre of asesorias_pre) {
      asesorias.push(await formarAseoria(asesoria_pre));
    }

    logger.info("Se retornan las asesorias")
    return asesorias;
  } catch (error) {
    console.log("Error Asesorias:", error.message); 
    logger.error("Error al consultar las asesorías:", error.message);
    throw new Error(`Error al consultar las asesorías: ${error.message}`);
  }
};




/**
 *  @abstract Función que permite obtener todos los asesorias 
 * @returns asesorias
 */
const obtenerAsesorias = async () => {
  try {
    logger.info("Se obtienen las asesorias")
    const asesorias_pre = await modeloAsesoria.Asesoria.findAll({
      raw: false,
      nest: true,
      attributes: {
        exclude: ['id_asesorado',
          //'id_turno', 
          'id_tipo_juicio']
      },
      include: [
        modeloAsesoria.Asesorado,
        modeloAsesoria.DetalleAsesoriaCatalogo,
        modeloAsesoria.Turno,
        modeloAsesoria.DistritoJudicial,
        modeloAsesoria.Empleado,
        modeloAsesoria.TipoJuicio
      ]
    });

    logger.info("Se forman las asesorias, se recorre el arreglo de asesorias y se manda a llamar la funcion formarAsesoria")
    const asesorias = [];

    for (const asesoria_pre of asesorias_pre) {
      const asesoria_obj = await formarAseoria(asesoria_pre);
      asesorias.push(asesoria_obj);
    }
    logger.info("Se validan las asesorias, si hay asesorias se retornan, si no hay asesorias se retorna null")
    if (asesorias.length > 0) {
      logger.info("Se retornan las asesorias", asesorias)
      return asesorias;
    }
    else {
      logger.info("No hay asesorias")
      return null;
    }
  } catch (error) {
    // console.log("Error Asesorias:", error.message);
    logger.error("Error Asesorias:", error.message);
    return null;
  }
};

const formarAseoria = async (asesoria_pre) => {

  try {
    logger.info("Se crea un json de la asesoria mas adecuado para el front")


    const asesoria_obj = JSON.parse(JSON.stringify(asesoria_pre));
    delete asesoria_obj.id_empleado;

    logger.info("Se valida si la asesoria tiene detalle_asesorias_catalogos, si tiene se recorre el arreglo y se manda a llamar la funcion obtenerCatalogoRequisitoPorId")
    if (asesoria_obj.detalle_asesorias_catalogos.length > 0) {
      const recibidos = [];
      for (const detalle of asesoria_obj.detalle_asesorias_catalogos) {
        const id_catalogo = detalle.id_catalogo;
        const catalogo = await controlCatalogoRequisito.obtenerCatalogoRequisitoPorId(id_catalogo);
        recibidos.push(catalogo);
      }
      delete asesoria_obj.detalle_asesorias_catalogos;
      asesoria_obj.recibidos = recibidos;
      //  console.log("Paso recibidos");
    }

    logger.info("Se valida si la asesoria tiene turno, si tiene se manda a llamar la funcion obtenerTurnoPorId")
    if (asesoria_obj.turno !== null) {
      const defensor = await controlDefensor.obtenerDefensorPorId(asesoria_obj.turno.id_defensor);
      asesoria_obj.turno.defensor = defensor;
      delete asesoria_obj.turno.id_defensor;
      delete asesoria_obj.turno.id_asesoria;
      //  console.log("Paso turno");
    }

    logger.info("Se valida si la asesoria tiene empleado, si tiene se manda a llamar a la funcion de obtener asesor por id, o obtener defensor por id")
    // Add other data processing steps similar to obtenerAsesoriaPorIdAsesorado here
    const tipo_empleado = asesoria_obj.empleado.tipo_empleado;
    if (tipo_empleado === "asesor") {
      const id_empleado = asesoria_obj.empleado.id_empleado;
      const asesor = await controlAsesor.obtenerAsesorPorId(id_empleado);
      asesoria_obj.asesor = asesor;
      delete asesoria_obj.empleado;
      //    console.log("Paso asesor");
    } else if (tipo_empleado === "defensor") {
      const id_empleado = asesoria_obj.empleado.id_empleado;
      const defensor = await controlDefensor.obtenerDefensorPorId(id_empleado);
      asesoria_obj.defensor = defensor;
      delete asesoria_obj.empleado;
      //  console.log("Paso defensor");
    }

    logger.info("Se valida si la asesoria cuenta con persona, si tiene se manda a llamar la funcion obtenerPersonaPorId")
    const persona = await controlPersonas.obtenerPersonaPorId(asesoria_obj.asesorado.id_asesorado);
    asesoria_obj.persona = persona;

    logger.info("Se valida la existencia de un motivo, si existe se manda a llamar la funcion obtenerMotivoPorId")
    if (asesoria_obj.asesorado.id_motivo !== null) {
      const motivo = await controlMotivo.obtenerMotivoPorId(asesoria_obj.asesorado.id_motivo);
      delete asesoria_obj.asesorado.id_motivo;
      asesoria_obj.asesorado.motivo = motivo;
      // console.log("Paso motivo");
    }

    logger.info("Se valida la existencia de un estado civil, si existe se manda a llamar la funcion obtenerEstadoCivilPorId")
    const estado_civil = await controlEstadoCivil.obtenerEstadoCivilPorId(asesoria_obj.asesorado.id_estado_civil);
    delete asesoria_obj.asesorado.id_estado_civil;
    asesoria_obj.asesorado.estado_civil = estado_civil;

    logger.info("Se añaden los datos de la asesoria")
    const datos_asesoria = {};
    datos_asesoria.id_asesoria = asesoria_obj.id_asesoria;
    datos_asesoria.resumen_asesoria = asesoria_obj.resumen_asesoria;
    datos_asesoria.conclusion_asesoria = asesoria_obj.conclusion_asesoria;
    datos_asesoria.estatus_requisitos = asesoria_obj.estatus_requisitos;
    datos_asesoria.fecha_registro = asesoria_obj.fecha_registro;
    datos_asesoria.usuario = asesoria_obj.usuario;
    datos_asesoria.id_usuario = asesoria_obj.id_usuario;
    // datos_asesoria.id_distrito_judicial = asesoria_obj.id_distrito_judicial;
    //  datos_asesoria.id_municipio_distrito = asesoria_obj.id_municipio_distrito;
    datos_asesoria.estatus_asesoria = asesoria_obj.estatus_asesoria;
    //  console.log("Paso datos_asesoria");
    logger.info("Se valida si la asesoria cuenta con distrito judicial, si tiene se manda a llamar la funcion obtenerDistritoJudicial")
    const distrito_judicial = await controlDistritoJudicial.obtenerDistritoJudicial(asesoria_obj.id_distrito_judicial);
    asesoria_obj.distrito_judicial = distrito_judicial;
    //  console.log("Paso distrito_judicial");
    logger.info("Se valida si la asesoria cuenta con municipio, si tiene se manda a llamar la funcion obtenerMunicipioPorId")
    const municipio = await controlMunicipios.obtenerMunicipioPorId(asesoria_obj.id_municipio_distrito);
    asesoria_obj.municipio = municipio;
    //  console.log("Paso municipio");
    logger.info("Se crea un json de la asesoria ")
    asesoria_obj.datos_asesoria = datos_asesoria;

    delete asesoria_obj.id_asesoria;
    delete asesoria_obj.resumen_asesoria;
    delete asesoria_obj.conclusion_asesoria;
    delete asesoria_obj.estatus_requisitos;
    delete asesoria_obj.fecha_registro;
    delete asesoria_obj.usuario;

    delete asesoria_obj.id_usuario;
    delete asesoria_obj.id_distrito_judicial;
    delete asesoria_obj.id_municipio_distrito;
    delete asesoria_obj.estatus_asesoria;

    // console.log("Paso final");
    logger.info("Se retorna la asesoria")
    return asesoria_obj;
  } catch (error) {
    //  console.log("Error Asesorias fin 2:", error.message);
    logger.error("Error Asesorias fin 2:", error.message);
    return null;
  }


};


/**
 * @abstract Función que permite obtener un asesoria por su id
 *  @param {*} id id del asesoria
 * @returns asesoria
 *  
 *  */
const obtenerAsesoriaPorId = async (id) => {
  try {
    logger.info("Se obtiene la asesoria por su id", id)
    const asesorias_pre = await modeloAsesoria.Asesoria.findByPk(id, {
      raw: false,
      nest: true,
      attributes: {
        exclude: ['id_asesorado',
          // 'id_turno',
          'id_tipo_juicio']
      },
      include: [
        modeloAsesoria.Asesorado,
        modeloAsesoria.DetalleAsesoriaCatalogo,
        modeloAsesoria.Turno,
        modeloAsesoria.DistritoJudicial,
        modeloAsesoria.Empleado,
        modeloAsesoria.TipoJuicio
      ]
    });
    logger.info("Se obtiene la asesoria en su forma adecuada para el front")
    return await formarAseoria(asesorias_pre);
  } catch (error) {
    //  console.log("Error Asesorias:", error.message);
    logger.error("Error Asesorias:", error.message);
    return null;
  }
};


/**
 * @abstract Función que permite obtener un asesoria por id del asesorado
 * @param {*} id_asesorado id del asesorado
 *  @returns asesoria
 * */
const obtenerAsesoriaPorIdAsesorado = async (id_asesorado) => {

  try {
    logger.info("Se obtiene la asesoria por id del asesorado", id_asesorado)
    const asesoria_pre = await modeloAsesoria.Asesoria.findOne({
      where: { id_asesorado: id_asesorado },
      raw: false,
      nest: true,
      attributes: {
        exclude: ['id_asesorado',
          // 'id_turno',
          'id_tipo_juicio']
      },
      include: [
        modeloAsesoria.Asesorado,
        modeloAsesoria.DetalleAsesoriaCatalogo,
        modeloAsesoria.Turno,
        modeloAsesoria.DistritoJudicial,
        modeloAsesoria.Empleado,
        modeloAsesoria.TipoJuicio
      ],

    });
    logger.info("Se obtiene la asesoria en su forma adecuada para el front")
    return await formarAseoria(asesoria_pre);
  } catch (error) {
    // console.log("Error Asesorias aqui:", error.message);
    logger.error("Error Asesorias aqui:", error.message);
    return null;
  }
};



/**
 * @abstract Función que permite agregar un asesoria
 * @param {*} asesoria asesoria a agregar
 * @returns asesoria si se agrega correctamente, false si no  agregar
 * */
const agregarAsesoria = async (asesoria_pre) => {
  try {

    logger.info("Se crea un json de la asesoria,y objeto para asesorado, datos_asesoria, empleado, persona, recibidos, tipojuicio")
    const asesoria_str = JSON.stringify(asesoria_pre);
    const asesoria_obj = JSON.parse(asesoria_str);

    const asesorado = asesoria_obj.asesorado;
    const datos_asesoria = asesoria_obj.datos_asesoria;
    const empleado = asesoria_obj.empleado;
    const persona = asesoria_obj.persona;
    const recibidos = asesoria_obj.recibidos;
    const tipojuicio = asesoria_obj.tipos_juicio;

    logger.info("Se crea el domicilio de la persona, se agrega la persona, se agrega el asesorado, se agrega la asesoria")
    const domicilio_pre = await controlDomicilios.agregarDomicilio(persona.domicilio);
    const domicilio_str = JSON.stringify(domicilio_pre);
    const domicilio_obj = JSON.parse(domicilio_str);
    delete persona.domicilio;
    persona.id_domicilio = domicilio_obj.id_domicilio;
    persona.id_genero = persona.genero.id_genero;
    delete persona.genero;
    const persona_pre = await controlPersonas.agregarPersona(persona);


    //Asesorado
    asesorado.id_estado_civil = asesorado.estado_civil.id_estado_civil;
    delete asesorado.estado_civil;
    asesorado.id_asesorado = persona_pre.id_persona;
    if (asesorado.motivo !== null) {
      asesorado.id_motivo = asesorado.motivo.id_motivo;
      delete asesorado.motivo;

    }
    const asesorado_pre = await controlAsesorados.agregarAsesorado(asesorado)


    datos_asesoria.id_asesorado = asesorado_pre.id_asesorado;
    datos_asesoria.id_empleado = empleado.id_empleado;

    datos_asesoria.id_tipo_juicio = tipojuicio.id_tipo_juicio;

    const asesoria_cre = (await modeloAsesoria.Asesoria.create(datos_asesoria, { raw: true, nest: true })).dataValues;
    const asesoria_str2 = JSON.stringify(asesoria_cre);
    const asesoria_obj2 = JSON.parse(asesoria_str2);

    logger.info("Se verifica si hay recibidos, si hay se recorre el arreglo y se manda a llamar la funcion agregarDetalleAsesoriaCatalogo")
    if (recibidos.length > 0) {
      for (const elemento of recibidos) {
        elemento.id_asesoria = asesoria_obj2.id_asesoria;
        await controlDetalleAsesoria.agregarDetalleAsesoriaCatalogo(elemento);
      }
    }
    logger.info("Se llama a la funcion de obtenerAsesoriaPorIdAsesorado, con el fin de obtener la asesoria")
    return await obtenerAsesoriaPorIdAsesorado(asesoria_obj2.id_asesorado);
  } catch (error) {
    // console.log("Error Asesorias:", error.message);
    logger.error("Error Asesorias:", error.message);
    return false;
  }
};


/**
 * @abstract Función que permite actualizar un asesoria
 * @param {*} asesoria asesoria a actualizar
 * @returns true si se actualiza correctamente, false si no se actualiza
 * */
const actualizarAsesoria = async (asesoria_pre) => {
  //Falta verificar
  try {

    /*
    {
        "turno": {
            "fecha_turno": "2024-05-20",
            "hora_turno": "12:12",
            "id_defensor": "10",
            "id_asesoria": 31
        },
        "distrito_judicial": {
            "id_distrito_judicial": 1,
            "nombre_distrito_judicial": "Distrito Judicial de Alamos",
            "municipio_distrito": {
                "id_municipio_distrito": 60,
                "nombre_municipio": "Álamos",
                "id_distrito_judicial": 1
            },
            "zona": {
                "id_zona": 3,
                "nombre_zona": "SUR"
            }
        },
        "tipos_juicio": {
            "id_tipo_juicio": 1,
            "tipo_juicio": "Divorcio Incausado",
            "estatus_general": "ACTIVO"
        },
        "persona": {
            "id_persona": 31,
            "nombre": "Martha",
            "apellido_materno": "Gonzalez",
            "apellido_paterno": "Lopez",
            "edad": 20,
            "telefono": "6442138093",
            "domicilio": {
                "id_domicilio": 31,
                "calle_domicilio": "13 de octubre",
                "numero_exterior_domicilio": "1130",
                "numero_interior_domicilio": "",
                "id_colonia": "197"
            },
            "genero": {
                "id_genero": 2,
                "descripcion_genero": "Femenino",
                "estatus_general": "ACTIVO"
            }
        },
        "municipio": {
            "id_municipio_distrito": 60,
            "nombre_municipio": "Álamos",
            "id_distrito_judicial": 1
        },
        "datos_asesoria": {
            "id_asesoria": 31,
            "resumen_asesoria": "En resumen la asesoria trato de como resolver el divorcio en cuestion por inconformidad de la pareja",
            "conclusion_asesoria": "Al final se pudo llegar a un acuerdo que era lo mejor se repartieron los vienes en cantidades equitativas",
            "estatus_requisitos": true,
            "fecha_registro": "2023-12-16",
            "usuario": "DPS Usuario Nueve",
            "id_usuario": 9,
            "estatus_asesoria": "TURNADA",
            "id_empleado": 17
        }
    }
    */
    logger.info("Se crea un json de la asesoria,y objeto para asesorado, datos_asesoria, empleado, persona, recibidos, tipojuicio")
    const asesoria_str = JSON.stringify(asesoria_pre);
    const asesoria_obj = JSON.parse(asesoria_str);

    const persona = asesoria_obj.persona;
    const domicilio = persona.domicilio;
    const datos_asesoria = asesoria_obj.datos_asesoria;
    const turno = asesoria_obj.turno;
    const municipio = asesoria_obj.municipio;
    const distrito_judicial = asesoria_obj.distrito_judicial;
    const tipos_juicio = asesoria_obj.tipos_juicio;
    //Primero actualiza el domicilio

    logger.info("Se actualiza el domicilio de la persona")
    const domicilio_actualizado = await controlDomicilios.actualizarDomicilio(domicilio);
    persona.id_domicilio = domicilio_actualizado.id_domicilio;
    persona.id_genero = persona.genero.id_genero;
    delete persona.genero;
    delete persona.domicilio;
    logger.info("Se actualiza la persona")
    const persona_actualizada = await controlPersonas.actualizarPersona(persona);

    datos_asesoria.id_asesorado = persona_actualizada.id_persona;
    datos_asesoria.id_tipo_juicio = tipos_juicio.id_tipo_juicio;
    datos_asesoria.id_distrito_judicial = distrito_judicial.id_distrito_judicial;
    datos_asesoria.id_municipio_distrito = municipio.id_municipio_distrito;

    logger.info("Se actualiza la asesoria")
    const asesoria_actualizada = (await modeloAsesoria.Asesoria.update(datos_asesoria, { where: { id_asesoria: datos_asesoria.id_asesoria } }));
    logger.info("Se crea el turno correspondiente a la asesoria")
    const turno_agregado = await controlTurno.agregarTurno(turno);
    logger.info("Se manda a llamar a la funcion de obtenerAsesoriaPorIdAsesorado, con el fin de obtener la asesoria")
    return await obtenerAsesoriaPorId(datos_asesoria.id_asesoria);
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    //console.log("Error Asesorias:", error.message);
    return false;
  }
};



//Funcion que te regrese una lista de asesorias por asi decirlo si te envian el numero 1 como paramtro te regrese las primeras 10 asesorias, y se te envia el dos que te envie las otras 10 y asi sucesivamente

const obtenerAsesoriasPorPagina = async (pageNumber) => {
  try {
    // const total = await modeloAsesoria.Asesoria.count();
    logger.info("Se estable la paguna,pageSize,offset,limit")
    const page = pageNumber || 1; // Página actual, predeterminada: 1
    const pageSize = 10; // Cantidad de productos por página
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    logger.info("Se obtienen las asesorias por pagina")
    const asesorias_pre = await modeloAsesoria.Asesoria.findAll({
      raw: false,
      nest: true,
      attributes: {
        exclude: ['id_asesorado',
          //'id_turno',
          'id_tipo_juicio']
      },
      include: [
        modeloAsesoria.Asesorado,
        modeloAsesoria.DetalleAsesoriaCatalogo,
        modeloAsesoria.Turno,
        modeloAsesoria.DistritoJudicial,
        modeloAsesoria.Empleado,
        modeloAsesoria.TipoJuicio
      ],
      where: {
        id_asesoria: { [Sequelize.Op.not]: null } // Excluir registros eliminados
      },
      offset: offset,
      limit: limit
    });

    const asesorias = [];

    logger.info("Se forman las asesorias, se recorre el arreglo de asesorias y se manda a llamar la funcion formarAsesoria")
    for (const asesoria_pre of asesorias_pre) {
      asesorias.push(await formarAseoria(asesoria_pre));
    }

    logger.info("Se validan las asesorias, si hay asesorias se retornan, si no hay asesorias se retorna null")
    if (asesorias.length > 0) {
      logger.info("Se retornan las asesorias")
      return asesorias;
    }
    else {
      logger.info("No hay asesorias")
      return null;
    }
  } catch (error) {
    // console.log("Error Asesorias:", error.message);
    logger.error("Error Asesorias:", error.message);
    return null;
  }
};


const obtenerWhereClause = async (filtros) => {
  logger.info("Se obtiene el whereClause")
  const whereClause = {};

  //if (filtros.fecha_registro) {
  //  whereClause.fecha_registro = filtros.fecha_registro;
  //} else 


  logger.info("Se validan los filtros, si hay filtros se agregan al whereClause")
  logger.info("Se valida si hay fecha-inicio y fecha-final, si hay se agrega al whereClause")
  if (filtros['fecha-inicio'] !== "null" && filtros['fecha-final'] !== "null") {
    whereClause.fecha_registro = {
      [Op.between]: [filtros['fecha-inicio'], filtros['fecha-final']],
    };
  }


  logger.info("Se valida si hay id distrito judicial, si hay se agrega al whereClause")
  if (filtros.id_distrito_judicial) {
    whereClause.id_distrito_judicial = filtros.id_distrito_judicial;
  }

  logger.info("Se valida si hay fecha_registro, si hay se agrega al whereClause")
  if (filtros.fecha_registro !== "null") {
    whereClause.fecha_registro = filtros.fecha_registro;
  }

  logger.info("Se valida la existencia de id_asesor y id_defensor, si hay se agrega al whereClause")

  if (filtros.id_asesor && filtros.id_defensor) {
    whereClause[Op.or] = [
      { id_empleado: filtros.id_asesor },
      { id_empleado: filtros.id_defensor },
    ];
  } else if (filtros.id_asesor) {
    whereClause.id_empleado = filtros.id_asesor;
  } else if (filtros.id_defensor) {
    whereClause.id_empleado = filtros.id_defensor;
  }

  logger.info("Se valida la existencia de id_municipio, si hay se agrega al whereClause")
  if (filtros.id_municipio) {

    whereClause.id_municipio_distrito = filtros.id_municipio;
    // Asegúrate de que la relación entre Empleado y Municipio esté definida
    // y ajusta el nombre del modelo y la clave foránea según sea necesario
    //  whereClause['$empleado.distrito_judicial.id_municipio_distrito$'] = filtros.id_municipio;
  }

  logger.info("Se valida la existencia de id distrito judicial, si hay se agrega al whereClause")
  if (filtros.id_distrito_judicial) {
    whereClause.id_distrito_judicial = filtros.id_distrito_judicial;
  }

  logger.info("Se valida la existencia de id_zona, si hay se agrega al whereClause")
  if (filtros.id_zona) {
    // Asegúrate de que la relación entre Empleado y Zona esté definida
    // y ajusta el nombre del modelo y la clave foránea según sea necesario
    whereClause['$distrito_judicial.id_zona$'] = filtros.id_zona;
  }
  // Resto del código...
  return whereClause;

};



//Funcion que te regrese una lista de asesorias por asi decirlo si te envian el numero 1 como paramtro te regrese las primeras 10 asesorias, y se te envia el dos que te envie las otras 10 y asi sucesivamente

const obtenerAsesoriasFiltroPagina = async (pageNumber, filtros) => {
  try {
    logger.info("Se obtiene las asesorias por filtro y pagina", filtros)

    logger.info("Se obtiene el whereClause")
    const whereClause = await obtenerWhereClause(filtros);

    logger.info("Se obtienen las asesorias por filtro y pagina")
    const asesorias_pre = await modeloAsesoria.Asesoria.findAll({
      raw: false,
      nest: true,
      attributes: {
        exclude: ['id_asesorado',
          //'id_turno',
          'id_tipo_juicio']
      },
      include: [{
        model: modeloAsesoria.Asesorado,
      },
      {
        model: modeloAsesoria.DetalleAsesoriaCatalogo,
      },
      {
        model: modeloAsesoria.Turno,
      },
      {
        model: modeloAsesoria.DistritoJudicial
      },
      {
        model: modeloAsesoria.Empleado
      },

      // {
      //    model: modeloAsesoria.Empleado,
      //    include: [{
      //      model: modeloAsesoria.DistritoJudicial,
      //  }]
      //  },
      {
        model: modeloAsesoria.TipoJuicio,
      }
      ],
      where: whereClause,
    });

    logger.info("Se estable la paguna,pageSize,offset,limit y ademas se verifica si hay asesorias de manera manual")
    const asesorias = [];
    const pageSize = 10;
    pageNumber = parseInt(pageNumber, 10);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Obtener las asesorías según la página usando slice
    logger.info("Se extraen las asesorias  con respecto a la pagina")
    const asesoriasOnPage = asesorias_pre.slice(startIndex, endIndex);

    logger.info("Se forman las asesorias, se recorre el arreglo de asesorias y se manda a llamar la funcion formarAsesoria")
    // Formar las asesorías usando async/await dentro de un bucle for
    for (const asesoria of asesoriasOnPage) {
      asesorias.push(await formarAseoria(asesoria));
    }

    logger.info("Se validan las asesorias, si hay asesorias se retornan, si no hay asesorias se retorna null")
    if (asesorias.length > 0) {
      logger.info("Se retornan las asesorias")
      return asesorias;
    } else {
      logger.info("No hay asesorias")
      return null;
    }
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    console.log("Error Asesorias:", error.message);
    throw new Error(`Error al consultar las asesorías: ${error.message}`);
  }
};


/**
 * @abstract Función que permite obtener asesorias por ids de los asesorados
 * @param {*} id_asesorado id de los asesorados
 *  @returns asesorias
 * */
const obtenerAsesoriaPorIdAsesorados = async (ids_asesorados) => {

  try {
    //Recorre el arreglo ids_asesorados y manda a llamar la funcion obtenerAsesoriaPorIdAsesorado y retorna un arreglo de asesorias con todos las asesorias de los asesorados
    const asesorias = [];
    logger.info("Se obtiene todas las asesorias con respecto a los id de los asesorados", ids_asesorados)
    logger.info("Se recorre el arreglo de ids_asesorados y se manda a llamar la funcion obtenerAsesoriaPorIdAsesorado")
    for (const id_asesorado of ids_asesorados) {
      const asesoria = await obtenerAsesoriaPorIdAsesorado(id_asesorado);
      asesorias.push(asesoria);
    }
    logger.info("Se validan las asesorias, si hay asesorias se retornan, si no hay asesorias se retorna null")
    if (asesorias.length > 0) {
      logger.info("Se retornan las asesorias")
      return asesorias;
    }
    else {
      logger.info("No hay asesorias")
      return null;
    }
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    // console.log("Error asesorias:", error.message);
    return null;
  }
};

const obtenerAsesoriasNombre = async (nombre, apellido_paterno, apellido_materno, pagina, total) => {

  try {
    logger.info("Se obtienen las asesorias por nombre, apellido paterno, apellido materno, pagina y total", nombre, apellido_paterno, apellido_materno, pagina, total)
    logger.info("Se valida si total es true, se obtiene el total de asesorias caso contrario se obtienen las asesorias por pagina")
    if (total === "true") {/*
      logger.info("Se obtiene el whereClause")
      const whereClause = {};
      
      logger.info("Se valida si hay nombre, apellido paterno, apellido materno, si hay se agrega al whereClause") 
      whereClause.estatus_asesoria = "NO_TURNADA";
      if (nombre || apellido_paterno || apellido_materno) {
        whereClause['$asesorado.persona.nombre$'] = nombre ? { [Op.like]: `%${nombre}%` } : { [Op.not]: null };
        whereClause['$asesorado.persona.apellido_paterno$'] = apellido_paterno ? { [Op.like]: `%${apellido_paterno}%` } : { [Op.not]: null };
        whereClause['$asesorado.persona.apellido_materno$'] = apellido_materno ? { [Op.like]: `%${apellido_materno}%` } : { [Op.not]: null };
      }
      logger.info("Se obtiene el total de asesorias")
      const asesoria_pre = await modeloAsesoria.Asesoria.count({
        raw: false,
        nest: true,
        attributes: {
          exclude: ['id_asesorado',
            'id_tipo_juicio']
        },
        include: [
          {
            model: modeloAsesoria.Asesorado,
            include: [{
              model: modeloAsesoria.Persona,
            }]
          }
          ,
          {
            model: modeloAsesoria.DetalleAsesoriaCatalogo,
          },
          {
            model: modeloAsesoria.Turno,
          },
          {
            model: modeloAsesoria.DistritoJudicial,
          },
          {
            model: modeloAsesoria.Empleado,
          },
          {
            model: modeloAsesoria.TipoJuicio,
          }

        ],
        where: whereClause
      });
      console.log("Asesorias:", asesoria_pre);
      logger.info("Se retornan las asesorias", asesoria_pre)
      return asesoria_pre;*/
      logger.info("Se obtiene el whereClause");
      const whereClause = {
        estatus_asesoria: "NO_TURNADA"
      };

      logger.info("Se valida si hay nombre, apellido paterno, apellido materno, si hay se agrega al whereClause");

      const personaWhereClause = {};

      if (nombre) {
        personaWhereClause.nombre = { [Op.like]: `%${nombre}%` };
      }
      if (apellido_paterno) {
        personaWhereClause.apellido_paterno = { [Op.like]: `%${apellido_paterno}%` };
      }
      if (apellido_materno) {
        personaWhereClause.apellido_materno = { [Op.like]: `%${apellido_materno}%` };
      }

      logger.info("Se obtiene el total de asesorias");
      const asesoria_pre = await modeloAsesoria.Asesoria.count({
        raw: false,
        nest: true,
        distinct: true,  // Asegura que solo cuente filas distintas
        attributes: {
          exclude: ['id_asesorado', 'id_tipo_juicio']
        },
        include: [
          {
            model: modeloAsesoria.Asesorado,
            include: [{
              model: modeloAsesoria.Persona,
              where: personaWhereClause
            }]
          },
          {
            model: modeloAsesoria.DetalleAsesoriaCatalogo,
          },
          {
            model: modeloAsesoria.Turno,
          },
          {
            model: modeloAsesoria.DistritoJudicial,
          },
          {
            model: modeloAsesoria.Empleado,
          },
          {
            model: modeloAsesoria.TipoJuicio,
          }
        ],
        where: whereClause
      });

      console.log("Asesorias:", asesoria_pre);
      logger.info("Se retornan las asesorias", asesoria_pre);
      return asesoria_pre;
    } else {

      logger.info("Se obtiene el whereClause")
      const whereClause = {};

      logger.info("Se valida si hay nombre, apellido paterno, apellido materno, si hay se agrega al whereClause")
      whereClause.estatus_asesoria = "NO_TURNADA";
      // Construir el whereClause para la tabla Persona
      if (nombre || apellido_paterno || apellido_materno) {
        whereClause['$asesorado.persona.nombre$'] = nombre ? { [Op.like]: `%${nombre}%` } : { [Op.not]: null };
        whereClause['$asesorado.persona.apellido_paterno$'] = apellido_paterno ? { [Op.like]: `%${apellido_paterno}%` } : { [Op.not]: null };
        whereClause['$asesorado.persona.apellido_materno$'] = apellido_materno ? { [Op.like]: `%${apellido_materno}%` } : { [Op.not]: null };
      }

      logger.info("Se obtienen las asesorias por pagina")
      const asesoria_pre = await modeloAsesoria.Asesoria.findAll({
        raw: false,
        nest: true,
        attributes: {
          exclude: ['id_asesorado',
            // 'id_turno',
            'id_tipo_juicio']
        },
        include: [
          {
            model: modeloAsesoria.Asesorado,
            include: [{
              model: modeloAsesoria.Persona,
            }]
          }
          ,
          {
            model: modeloAsesoria.DetalleAsesoriaCatalogo,
          },
          {
            model: modeloAsesoria.Turno,
          },
          {
            model: modeloAsesoria.DistritoJudicial,
          },
          {
            model: modeloAsesoria.Empleado,
          },
          {
            model: modeloAsesoria.TipoJuicio,
          }

        ],
        where: whereClause
      });

      logger.info("Se estable la paguna,pageSize,offset,limit y ademas se verifica si hay asesorias de manera manual")
      const asesorias = [];
      const pageSize = 10;
      pagina = parseInt(pagina, 10);
      const startIndex = (pagina - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      logger.info("Se extraen las asesorias  con respecto a la pagina")
      // Obtener las asesorías según la página usando slice
      const asesoriasOnPage = asesoria_pre.slice(startIndex, endIndex);

      logger.info("Se forman las asesorias, se recorre el arreglo de asesorias y se manda a llamar la funcion formarAsesoria")
      // Formar las asesorías usando async/await dentro de un bucle for
      for (const asesoria of asesoriasOnPage) {
        asesorias.push(await formarAseoria(asesoria));
      }

      logger.info("Se validan las asesorias, si hay asesorias se retornan, si no hay asesorias se retorna null")
      if (asesorias.length > 0) {
        logger.info("Se retornan las asesorias")
        return asesorias;
      } else {
        logger.info("No hay asesorias")
        return null;
      }
    }
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    // console.log("Error Asesorias aqui:", error.message);
    return null;
  }
};




/**
 * @abstract Función que permite obtener el total de asesorías por filtro
 * @returns total de asesorías
 */
const obtenerTotalAsesorias = async (filtros) => {
  try {

    logger.info("Se obtiene el whereClause")
    const whereClause = await obtenerWhereClause(filtros);


    logger.info("Se obtienen las asesorias por filtro")
    const asesorias_pre = await modeloAsesoria.Asesoria.findAll({
      raw: false,
      nest: true,
      attributes: {
        exclude: ['id_asesorado',
          //'id_turno',
          'id_tipo_juicio']
      },
      include: [{
        model: modeloAsesoria.Asesorado,
      },
      {
        model: modeloAsesoria.DetalleAsesoriaCatalogo,
      },
      {
        model: modeloAsesoria.Turno,
      },
      {
        model: modeloAsesoria.DistritoJudicial
      },
      {
        model: modeloAsesoria.Empleado
      },

      // {
      //    model: modeloAsesoria.Empleado,
      //    include: [{
      //      model: modeloAsesoria.DistritoJudicial,
      //  }]
      //  },
      {
        model: modeloAsesoria.TipoJuicio,
      }
      ],
      where: whereClause,
    });
    logger.info("Se retorna el total de asesorias")
    return asesorias_pre.length;
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    console.log("Error Asesorias:", error.message);
    throw new Error(`Error al consultar las asesorías: ${error.message}`);
  }
};

/**
 *  @abstract Función que permite obtener el total de asesorías en el sistema
 * @returns total de asesorías
 */
const obtenerTotalAsesoriasSistema = async () => {
  try {
    logger.info("Se obtiene el total de asesorias en el sistema")
    const totalAsesorias = await modeloAsesoria.Asesoria.count();
    logger.info("Se retorna el total de asesorias")
    return totalAsesorias;
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    //console.log("Error asesorias:", error.message);
    return null;
  }
};

const obtenerAsesoriaIDSimpleMiddleware = async (id) => {
  try {
    logger.info("Se obtiene la asesoria por su id", id)
    const asesoria = await modeloAsesoria.Asesoria.findByPk(id);
    logger.info("Se retorna la asesoria")
    return asesoria;
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    // console.log("Error asesorias:", error.message);
    return null;
  }
};

const obtenerAsesoriaIDSimpleMiddleware2WithData = async (id) => {
  try {
    logger.info("Se obtiene la asesoria por su id", id)
    const asesoria = await modeloAsesoria.Asesoria.findByPk(id, {
      raw: false,
      nest: true,
      include: [
        modeloAsesoria.Asesorado,
        modeloAsesoria.DetalleAsesoriaCatalogo,
        modeloAsesoria.Turno,
        modeloAsesoria.DistritoJudicial,
        modeloAsesoria.Empleado,
        modeloAsesoria.TipoJuicio
      ]
    });
    logger.info("Se retorna la asesoria")
    return asesoria;
  } catch (error) {
    logger.error("Error Asesorias:", error.message);
    //  console.log("Error asesorias:", error.message);
    return null;
  }
}

// Export model functions and routes  
module.exports = {
  obtenerAsesoriaPorIdAsesorados,
  obtenerAsesorias,
  obtenerAsesoriaPorId,
  obtenerAsesoriaPorIdAsesorado,
  agregarAsesoria,
  actualizarAsesoria,
  obtenerAsesoriasFiltro,
  obtenerAsesoriasPorPagina
  ,
  obtenerTotalAsesoriasSistema,
  obtenerTotalAsesorias
  ,
  obtenerAsesoriasFiltroPagina,
  obtenerAsesoriasNombre,
  obtenerAsesoriaIDSimpleMiddleware
};
