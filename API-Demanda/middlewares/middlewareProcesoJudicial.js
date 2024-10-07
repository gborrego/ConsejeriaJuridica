const procesoJudicialDAO = require('../data-access/proceso_judicialDAO.js');
const logger = require('../utilidades/logger');

async function existeProcesoJudicial(req, res, next) {
  logger.info("Middleware para validar la existencia de un proceso judicial")
  try {
    const { id } = req.params
    const procesoJudicial = await procesoJudicialDAO.obtenerProcesoJudicialMiddleware(id)
    if (!procesoJudicial) {
      return res.status(404).json({
        message: 'No existe un proceso judicial con ese id'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el proceso judicial'
    })
  }

  logger.info("Fin del middleware para validar la existencia de un proceso judicial")

  next()
}



async function validarJSONProcesoJudicialPOST(req, res, next) {
  //Haz las mismas validaciones con respect a put
  logger.info("Middleware para validar el JSON de un proceso judicial")

/*
{
    "turno": {
        "id_turno": 3,
        "fecha_turno": "2024-06-24",
        "hora_turno": "23:23:00",
        "estatus_general": "NO_SEGUIMIENTO",
        "asesoria": {
            "asesorado": {
                "id_asesorado": 4,
                "estatus_trabajo": true,
                "id_motivo": null,
                "numero_hijos": 2,
                "ingreso_mensual": 9999,
                "estado_civil": {
                    "id_estado_civil": 1,
                    "estado_civil": "Soltero(a)",
                    "estatus_general": "ACTIVO"
                }
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
                "id_tipo_juicio": 10,
                "tipo_juicio": "Nulidad de Acta de Nacimiento",
                "estatus_general": "ACTIVO"
            },
            "recibidos": [
                {
                    "id_catalogo": 2,
                    "descripcion_catalogo": "Carta compromiso",
                    "estatus_general": "ACTIVO"
                },
                {
                    "id_catalogo": 3,
                    "descripcion_catalogo": "Citatorio",
                    "estatus_general": "ACTIVO"
                }
            ],
            "defensor": {
                "id_defensor": 3,
                "nombre_defensor": "Jenifer Saucedo Cervantes",
                "empleado": {
                    "id_empleado": 3,
                    "tipo_empleado": "defensor",
                    "id_distrito_judicial": 1,
                    "estatus_general": "ACTIVO"
                }
            },
            "persona": {
                "id_persona": 4,
                "nombre": "Marco",
                "apellido_materno": "Diaz",
                "apellido_paterno": "Antonio",
                "edad": 33,
                "telefono": "6442138094",
                "domicilio": {
                    "id_domicilio": 4,
                    "calle_domicilio": "Alberto Vargas ",
                    "numero_exterior_domicilio": "2901",
                    "numero_interior_domicilio": "",
                    "id_colonia": 4844
                },
                "genero": {
                    "id_genero": 1,
                    "descripcion_genero": "Masculino",
                    "estatus_general": "ACTIVO"
                }
            },
            "municipio": {
                "id_municipio_distrito": 60,
                "nombre_municipio": "Álamos",
                "id_distrito_judicial": 1
            },
            "datos_asesoria": {
                "id_asesoria": 4,
                "resumen_asesoria": "En el Distrito Judicial de Álamos, municipio de Álamos, Jenifer Saucedo Cervantes actúa como defensora en un juicio de nulidad de acta de nacimiento. El caso involucra a Pedro López, quien descubrió que su acta de nacimiento contiene errores significativos en su nombre y fecha de nacimiento, lo que ha causado problemas legales y administrativos en su vida cotidiana.",
                "conclusion_asesoria": "Jenifer Saucedo Cervantes, como defensora en este juicio trabajará para demostrar que los errores en el acta de Pedro López son significativos y que la nulidad es necesaria para evitar futuros problemas legales y administrativos. ",
                "estatus_requisitos": false,
                "fecha_registro": "2024-06-24",
                "usuario": "DPS Usuario Uno",
                "id_usuario": 1,
                "estatus_asesoria": "TURNADA"
            }
        },
        "defensor": {
            "id_defensor": 3,
            "nombre_defensor": "Jenifer Saucedo Cervantes",
            "empleado": {
                "id_empleado": 3,
                "tipo_empleado": "defensor",
                "id_distrito_judicial": 1,
                "estatus_general": "ACTIVO"
            }
        }
    },
    "promovente": {
        "nombre": "Marco",
        "apellido_paterno": "Antonio",
        "apellido_materno": "Diaz",
        "edad": "33",
        "telefono": "6442138094",
        "id_genero": "1",
        "id_etnia": "2",
        "id_escolaridad": "4",
        "id_ocupacion": "3",
        "español": true,
        "sexo": "Masculino",
        "etnia": "Mayo",
        "escolaridad": "Preparatoria",
        "ocupacion": "Empleado/a",
        "domicilio": {
            "calle_domicilio": "Alberto Vargas ",
            "numero_exterior_domicilio": "2901",
            "numero_interior_domicilio": "",
            "id_colonia": "4844",
            "cp": "85020",
            "estado": "Sonora",
            "municipio": "Cajeme",
            "ciudad": "Ciudad Obregón",
            "colonia": "Amanecer 1"
        }
    },
    "demandado": {
        "nombre": "sdfdsf",
        "apellido_paterno": "sdfdsfdsf",
        "apellido_materno": "dsfsdf",
        "edad": "23",
        "telefono": "3333333333",
        "id_genero": "1",
        "sexo": "Masculino",
        "domicilio": {
            "calle_domicilio": "dsfsdfdsf",
            "numero_exterior_domicilio": "3443",
            "numero_interior_domicilio": "",
            "id_colonia": "93593",
            "cp": "85020",
            "estado": "Sonora",
            "municipio": "Cajeme",
            "ciudad": "Ciudad Obregón",
            "colonia": "Manlio Fabio Beltrones"
        }
    },
    "proceso": {
        "fecha_inicio": "2024-06-28",
        "fecha_estatus": null,
        "estatus_proceso": "EN_TRAMITE",
        "id_juzgado": "1",
        "juzgado": "Primero Familiar",
        "numero_expediente": "rrrrrggggg",
        "control_interno": "aaaaabbbbb",
        "id_defensor": 3,
        "defensor": "Jenifer Saucedo Cervantes",
        "id_distrito_judicial": "1",
        "id_municipio_distrito": "60",
        "id_tipo_juicio": "10",
        "tipo_juicio": "Nulidad de Acta de Nacimiento",
        "municipio": "Álamos",
        "distrito_judicial": "Distrito Judicial de Alamos",
        "pruebas": [
            {
                "descripcion_prueba": "aaaaaaaaaaaaa"
            }
        ],
        "familiares": [
            {
                "nombre": "aaaa",
                "nacionalidad": "aaaaaa",
                "parentesco": "aaaaaaaa",
                "perteneceComunidadLGBT": true,
                "adultaMayor": true,
                "saludPrecaria": true,
                "pobrezaExtrema": true
            }
        ],
        "observaciones": [
            {
                "observacion": "sssss"
            }
        ],
        "resoluciones": [
            {
                "resolucion": "sssssssss",
                "fecha_resolucion": "2024-06-27"
            }
        ],
        "estadosProcesales": [
            {
                "descripcion_estado_procesal": "aaa",
                "fecha_estado_procesal": "2024-06-27"
            }
        ]
    }
}
 */

  const { promovente, demandado, proceso, turno, ...extraData } = req.body
  if (Object.keys(extraData).length !== 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
    });
  }

  if (!promovente || !demandado || !proceso || !turno) {
    return res.status(400).json({
      message: 'Faltan datos en el cuerpo de la petición, o el promovente o el turno o el demandado o el proceso esta vacio.'
    })
  }



  try {
    let codigo_client = grpc.loadPackageDefinition(packageDefinition).codigoService;
    const validador = new codigo_client.CodigoService(process.env.HOSTGRPCCODIGOSPOSTALES, grpc.credentials.createInsecure());
    const auxiliar = [];

    const validarCodigoPromise = new Promise((resolve, reject) => {
      validador.validarCodigo({ id_colonia: promovente.domicilio.id_colonia }, function (err, response) {
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
  try {
    let codigo_client = grpc.loadPackageDefinition(packageDefinition).codigoService;
    const validador = new codigo_client.CodigoService(process.env.HOSTGRPCCODIGOSPOSTALES, grpc.credentials.createInsecure());
    const auxiliar = [];

    const validarCodigoPromise = new Promise((resolve, reject) => {
      validador.validarCodigo({ id_colonia: demandado.domicilio.id_colonia }, function (err, response) {
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
  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.GeneroService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarGeneroPromise = new Promise((resolve, reject) => {
      validador.validarGenero({ id_genero: promovente.id_genero }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Genero inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    }
    );
    await validarGeneroPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El genero no es válido" });
    }

  } catch (error) {
    return res.status(400).json({ message: "Error al validar el genero, o no es valido" });
  }

  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.GeneroService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarGeneroPromise = new Promise((resolve, reject) => {
      validador.validarGenero({ id_genero: demandado.id_genero }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Genero inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    }
    );
    await validarGeneroPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El genero no es válido" });
    }

  }
  catch (error) {
    return res.status(400).json({ message: "Error al validar el genero, o no es valido" });
  }



  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.DistritoService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarDistritoPromise = new Promise((resolve, reject) => {
      validador.validarDistrito({ id_distrito_judicial: proceso.id_distrito_judicial }, function (err, response) {
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
  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.TipoJuicioService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarTipoJuicioPromise = new Promise((resolve, reject) => {
      validador.validarTipoJuicio({ id_tipo_juicio: proceso.id_tipo_juicio }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Tipo Juicio inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    });
    await validarTipoJuicioPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El tipo juicio no es válido" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error al validar el tipo juicio, o no es valido" });
  }

  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.MunicipioDistritoService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarMunicipioPromise = new Promise((resolve, reject) => {
      validador.validarMunicipio({ id_municipio_distrito: proceso.id_municipio_distrito }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Municipio inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    });
    await validarMunicipioPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El municipio no es válido" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error al validar el municipio, o no es valido" });
  }


  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.DefensorService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarDefensorPromise = new Promise((resolve, reject) => {
      validador.validarDefensor({ id_defensor: proceso.id_defensor }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Defensor inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    });
    await validarDefensorPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El defensor no es válido" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error al validar el defensor, o no es valido" });
  }
  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.TurnoService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarTurnoPromise = new Promise((resolve, reject) => {
      validador.validarTurno({ id_turno: turno.id_turno }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Turno inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    });
    await validarTurnoPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El turno no es válido" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error al validar el turno, o no es valido" });
  }





  if (!promovente.nombre || typeof promovente.nombre !== 'string' || promovente.nombre.length > 50) {
    return res.status(400).json({
      message: 'El nombre del promovente es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica el promovente datos como el apellido_paterno primeramente y tamaños y tipo d edatos
  if (!promovente.apellido_paterno || typeof promovente.apellido_paterno !== 'string' || promovente.apellido_paterno.length > 50) {
    return res.status(400).json({
      message: 'El apellido paterno del promovente es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica el promovente datos como el apellido_materno primeramente y tamaños y tipo d edatos
  if (!promovente.apellido_materno || typeof promovente.apellido_materno !== 'string' || promovente.apellido_materno.length > 50) {
    return res.status(400).json({
      message: 'El apellido materno del promovente es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Te falto revisar que solo sean letras;
  // Expresión regular para validar que solo se ingresen letras y espacios en blanco
  var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  // Verifica que el nombre solo contenga letras y espacios en blanco
  if (!nombrePattern2.test(promovente.nombre)) {
    return res.status(400).json({
      message: 'El nombre del promovente solo puede contener letras y espacios en blanco.'
    })

  }


  if (!nombrePattern2.test(promovente.apellido_paterno)) {
    return res.status(400).json({
      message: 'El apellido paterno del promovente solo puede contener letras y espacios en blanco.'
    })
  }

  if (!nombrePattern2.test(promovente.apellido_materno)) {
    return res.status(400).json({
      message: 'El apellido materno del promovente solo puede contener letras y espacios en blanco.'
    })
  }

  //Verifica que el telefono siempre sea de 10 caracteros y todo entero
  if (!promovente.telefono || isNaN(promovente.telefono) || promovente.telefono.length !== 10) {
    return res.status(400).json({
      message: 'El telefono del promovente es requerido, debe ser de tipo entero y tener 10 caracteres.'
    })

  }

  //verifica que español sea un booleano true or false only
  if (typeof promovente.español !== 'boolean') {
    return res.status(400).json({
      message: 'El campo español del promovente es requerido y debe ser de tipo booleano.'
    })
  }
  //verifica la edad del promovente numero entero y no mayor a 200
  if (!promovente.edad || isNaN(promovente.edad) || promovente.edad > 200) {
    return res.status(400).json({
      message: 'La edad del promovente es requerida, debe ser de tipo entero y no debe exceder los 200 años.'
    })
  }


  //Ahora valida la existencia del domicilio del promovente

  if (!promovente.domicilio) {
    return res.status(400).json({
      message: 'El domicilio del promovente es requerido.'
    })
  }

  //Valida los datos del domicilio del promovente
  //Verifica que la calle_domicilio sea un string y no exceda los 75 caracteres
  if (!promovente.domicilio.calle_domicilio || typeof promovente.domicilio.calle_domicilio !== 'string' || promovente.domicilio.calle_domicilio.length > 75) {
    return res.status(400).json({
      message: 'La calle del domicilio del promovente es requerida, debe ser de tipo string y no debe exceder los 75 caracteres.'
    })
  }

  //Verifica que el numero_exterior_domicilio sea un string y no exceda los 25 caracteres
  if (!promovente.domicilio.numero_exterior_domicilio || typeof promovente.domicilio.numero_exterior_domicilio !== 'string' || promovente.domicilio.numero_exterior_domicilio.length > 25) {
    return res.status(400).json({
      message: 'El número exterior del domicilio del promovente es requerido, debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el numero_interior_domicilio sea un string y no exceda los 25 caracteres
  //Solo en caso de que el numero_interior_domicilio no sea nulo
  if (promovente.domicilio.numero_interior_domicilio && (typeof promovente.domicilio.numero_interior_domicilio !== 'string' || promovente.domicilio.numero_interior_domicilio.length > 25)) {
    return res.status(400).json({
      message: 'El número interior del domicilio del promovente debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el id_colonia sea un entero
  if (!promovente.domicilio.id_colonia || isNaN(promovente.domicilio.id_colonia)) {
    return res.status(400).json({
      message: 'El id de la colonia del domicilio del promovente es requerido y debe ser de tipo entero.'
    })
  }
  //verificsr la existencia de etnia, escolaridad y ocupacion
  if (!promovente.id_etnia || isNaN(promovente.id_etnia)) {
    return res.status(400).json({
      message: 'El id de la etnia del promovente es requerido y debe ser de tipo entero.'
    })
  }

  if (!promovente.id_escolaridad || isNaN(promovente.id_escolaridad)) {
    return res.status(400).json({
      message: 'El id de la escolaridad del promovente es requerido y debe ser de tipo entero.'
    })
  }

  if (!promovente.id_ocupacion || isNaN(promovente.id_ocupacion)) {
    return res.status(400).json({
      message: 'El id de la ocupación del promovente es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const etniaDB = await etniaDAO.obtenerEtnia(promovente.id_etnia)
    if (!etniaDB) {
      return res.status(404).json({
        message: 'No existe una etnia con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la etnia.'
    })
  }

  try {
    const escolaridadDB = await escolaridadDAO.obtenerEscolaridadPorId(promovente.id_escolaridad)
    if (!escolaridadDB) {
      return res.status(404).json({
        message: 'No existe una escolaridad con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la escolaridad.'
    })
  }

  try {

    const ocupacionDB = await ocupacionDAO.obtenerOcupacion(promovente.id_ocupacion)
    if (!ocupacionDB) {
      return res.status(404).json({
        message: 'No existe una ocupación con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la ocupación.'
    })
  }



  //Verifica que el nombre del demandado sea un string y no exceda los 50 caracteres
  if (!demandado.nombre || typeof demandado.nombre !== 'string' || demandado.nombre.length > 50) {
    return res.status(400).json({
      message: 'El nombre del demandado es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica que el apellido_paterno del demandado sea un string y no exceda los 50 caracteres
  if (!demandado.apellido_paterno || typeof demandado.apellido_paterno !== 'string' || demandado.apellido_paterno.length > 50) {
    return res.status(400).json({
      message: 'El apellido paterno del demandado es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica que el apellido_materno del demandado sea un string y no exceda los 50 caracteres
  if (!demandado.apellido_materno || typeof demandado.apellido_materno !== 'string' || demandado.apellido_materno.length > 50) {
    return res.status(400).json({
      message: 'El apellido materno del demandado es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica que el nombre solo contenga letras y espacios en blanco
  if (!nombrePattern2.test(demandado.nombre)) {
    return res.status(400).json({
      message: 'El nombre del demandado solo puede contener letras y espacios en blanco.'
    })

  }

  if (!nombrePattern2.test(demandado.apellido_paterno)) {
    return res.status(400).json({
      message: 'El apellido paterno del demandado solo puede contener letras y espacios en blanco.'
    })
  }

  if (!nombrePattern2.test(demandado.apellido_materno)) {
    return res.status(400).json({
      message: 'El apellido materno del demandado solo puede contener letras y espacios en blanco.'
    })
  }


  //Verifica que el telefono del demandado sea un entero y tenga 10 caracteres
  if (!demandado.telefono || isNaN(demandado.telefono) || demandado.telefono.length !== 10) {
    return res.status(400).json({
      message: 'El telefono del demandado es requerido, debe ser de tipo entero y tener 10 caracteres.'
    })

  }

  //Verifica la edad del demandado sea un entero y no exceda los 200 años
  if (!demandado.edad || isNaN(demandado.edad) || demandado.edad > 200) {
    return res.status(400).json({
      message: 'La edad del demandado es requerida, debe ser de tipo entero y no debe exceder los 200 años.'
    })
  }

  //Ahora valida la existencia del domicilio del demandado
  if (!demandado.domicilio) {
    return res.status(400).json({
      message: 'El domicilio del demandado es requerido.'
    })
  }

  

  //Valida los datos del domicilio del demandado
  //Verifica que la calle_domicilio sea un string y no exceda los 75 caracteres
  if (!demandado.domicilio.calle_domicilio || typeof demandado.domicilio.calle_domicilio !== 'string' || demandado.domicilio.calle_domicilio.length > 75) {
    return res.status(400).json({
      message: 'La calle del domicilio del demandado es requerida, debe ser de tipo string y no debe exceder los 75 caracteres.'
    })
  }

  //Verifica que el numero_exterior_domicilio sea un string y no exceda los 25 caracteres
  if (!demandado.domicilio.numero_exterior_domicilio || typeof demandado.domicilio.numero_exterior_domicilio !== 'string' || demandado.domicilio.numero_exterior_domicilio.length > 25) {
    return res.status(400).json({
      message: 'El número exterior del domicilio del demandado es requerido, debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el numero_interior_domicilio sea un string y no exceda los 25 caracteres
  //Solo en caso de que el numero_interior_domicilio no sea nulo

  if (demandado.domicilio.numero_interior_domicilio && (typeof demandado.domicilio.numero_interior_domicilio !== 'string' || demandado.domicilio.numero_interior_domicilio.length > 25)) {
    return res.status(400).json({
      message: 'El número interior del domicilio del demandado debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el id_colonia sea un entero
  if (!demandado.domicilio.id_colonia || isNaN(demandado.domicilio.id_colonia)) {
    return res.status(400).json({
      message: 'El id de la colonia del domicilio del demandado es requerido y debe ser de tipo entero.'
    })
  }

  //Ahora verificar lo relacionado en el proceso

  //Verifica que la fecha_inicio del proceso sea una fecha válida
  if (!proceso.fecha_inicio || isNaN(Date.parse(proceso.fecha_inicio))) {
    return res.status(400).json({
      message: 'La fecha de inicio del proceso es requerida y debe ser una fecha válida.'
    })
  }

  //Verifica que el control_interno del proceso sea un string y no exceda los 20 caracteres
  if (!proceso.control_interno || typeof proceso.control_interno !== 'string' || proceso.control_interno.length > 20) {
    return res.status(400).json({
      message: 'El control interno del proceso es requerido, debe ser de tipo string y no debe exceder los 20 caracteres.'
    })
  }

  //Verifica que el numero_expediente del proceso sea un string y no exceda los 20 caracteres
  if (!proceso.numero_expediente || typeof proceso.numero_expediente !== 'string' || proceso.numero_expediente.length > 20) {
    return res.status(400).json({
      message: 'El número de expediente del proceso es requerido, debe ser de tipo string y no debe exceder los 20 caracteres.'
    })
  }

  //Verifica que el estatus_proceso del proceso sea un string y solo acepte los valores permitidos
  if (!proceso.estatus_proceso || (proceso.estatus_proceso !== 'EN_TRAMITE' && proceso.estatus_proceso !== 'BAJA' && proceso.estatus_proceso !== 'CONCLUIDO')) {
    return res.status(400).json({
      message: 'El estatus del proceso es requerido y solo puede ser EN_TRAMITE, BAJA o CONCLUIDO.'
    })
  }


  //Verifica que el id_juzgado del proceso sea un entero
  if (!proceso.id_juzgado || isNaN(proceso.id_juzgado)) {
    return res.status(400).json({
      message: 'El id del juzgado es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const juzgadoDB = await juzgadoDAO.obtenerJuzgado(proceso.id_juzgado)
    if (!juzgadoDB) {
      return res.status(404).json({
        message: 'No existe un juzgado con ese id.'
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el juzgado.'
    })
  }


  //Verifica que el id_distrito_judicial del proceso sea un entero
  if (!proceso.id_distrito_judicial || isNaN(proceso.id_distrito_judicial)) {
    return res.status(400).json({
      message: 'El id del distrito judicial es requerido y debe ser de tipo entero.'
    })
  }

  //Verifica que el id_municipio_distrito del proceso sea un entero
  if (!proceso.id_municipio_distrito || isNaN(proceso.id_municipio_distrito)) {
    return res.status(400).json({
      message: 'El id del municipio del distrito judicial es requerido y debe ser de tipo entero.'
    })
  }

  //Verifica que el id_tipo_juicio del proceso sea un entero
  if (!proceso.id_tipo_juicio || isNaN(proceso.id_tipo_juicio)) {
    return res.status(400).json({
      message: 'El id del tipo de juicio es requerido y debe ser de tipo entero.'
    })
  }

  //En caso de que la fecha estatus no sea nula verifica que sea una fecha valida
  if (proceso.fecha_estatus && isNaN(Date.parse(proceso.fecha_estatus))) {
    return res.status(400).json({
      message: 'La fecha de estatus del proceso debe ser una fecha válida.'
    })
  }

  //Ahora valida las pruebas, familiares, observaciones,estadosProcesales y resoluciones 
  //tengan esa estructura y que como maximo sean 5 elementos en cada uno
  //pueden estar vacias inlcuso osea si es diferente de null, 0 o undefined que valide el tamaño

  if (proceso.pruebas && proceso.pruebas.length > 5) {
    return res.status(400).json({
      message: 'Las pruebas del proceso no deben exceder los 5 elementos.'
    })
  }

  if (proceso.familiares && proceso.familiares.length > 5) {
    return res.status(400).json({
      message: 'Los familiares del proceso no deben exceder los 5 elementos.'
    })
  }

  if (proceso.observaciones && proceso.observaciones.length > 5) {
    return res.status(400).json({
      message: 'Las observaciones del proceso no deben exceder los 5 elementos.'
    })
  }

  if (proceso.estadosProcesales && proceso.estadosProcesales.length > 5) {
    return res.status(400).json({
      message: 'Los estados procesales del proceso no deben exceder los 5 elementos.'
    })
  }

  if (proceso.resoluciones && proceso.resoluciones.length > 5) {
    return res.status(400).json({
      message: 'Las resoluciones del proceso no deben exceder los 5 elementos.'
    })
  }

  //Ahora valida que cada prueba tenga la estructura correcta
  if (proceso.pruebas) {
    for (let i = 0; i < proceso.pruebas.length; i++) {
      if (!proceso.pruebas[i].descripcion_prueba || typeof proceso.pruebas[i].descripcion_prueba !== 'string' || proceso.pruebas[i].descripcion_prueba.length > 200) {
        return res.status(400).json({
          message: 'La descripción de la prueba es requerida, debe ser de tipo string y no debe exceder los 200 caracteres.'
        })
      }


    }
  }


  //Ahora valida que cada familiar tenga la estructura correcta
  if (proceso.familiares) {
    for (let i = 0; i < proceso.familiares.length; i++) {
      if (!proceso.familiares[i].nombre || typeof proceso.familiares[i].nombre !== 'string' || proceso.familiares[i].nombre.length > 100) {
        return res.status(400).json({
          message: 'El nombre del familiar es requerido, debe ser de tipo string y no debe exceder los 100 caracteres.'
        })
      }

      if (!proceso.familiares[i].parentesco || typeof proceso.familiares[i].parentesco !== 'string' || proceso.familiares[i].parentesco.length > 100) {
        return res.status(400).json({
          message: 'El parentesco del familiar es requerido, debe ser de tipo string y no debe exceder los 100 caracteres.'
        })
      }

      //parentesco te falto ese campo

      if(!proceso.familiares[i].parentesco || typeof proceso.familiares[i].parentesco !== 'string' || proceso.familiares[i].parentesco.length > 100){
        return res.status(400).json({
          message: 'El parentesco del familiar es requerido, debe ser de tipo string y no debe exceder los 100 caracteres.'
        })
      } 

      //Valida los boleanos
      /*
                "perteneceComunidadLGBT": true,
                "adultaMayor": true,
                "saludPrecaria": true,
                "pobrezaExtrema": true

      */


      if (typeof proceso.familiares[i].perteneceComunidadLGBT !== 'boolean') {
        return res.status(400).json({
          message: 'El campo perteneceComunidadLGBT del familiar es requerido y debe ser de tipo booleano.'
        })
      }

      if (typeof proceso.familiares[i].adultaMayor !== 'boolean') {
        return res.status(400).json({
          message: 'El campo adultaMayor del familiar es requerido y debe ser de tipo booleano.'
        })
      }

      if (typeof proceso.familiares[i].saludPrecaria !== 'boolean') {
        return res.status(400).json({
          message: 'El campo saludPrecaria del familiar es requerido y debe ser de tipo booleano.'
        })
      }

      if (typeof proceso.familiares[i].pobrezaExtrema !== 'boolean') {
        return res.status(400).json({
          message: 'El campo pobrezaExtrema del familiar es requerido y debe ser de tipo booleano.'
        })
      }

      

    }
  }


  //Ahora valida que cada observacion tenga la estructura correcta
  if (proceso.observaciones) {
    for (let i = 0; i < proceso.observaciones.length; i++) {
      if (!proceso.observaciones[i].observacion || typeof proceso.observaciones[i].observacion !== 'string' || proceso.observaciones[i].observacion.length > 200) {
        return res.status(400).json({
          message: 'La descripción de la observación es requerida, debe ser de tipo string y no debe exceder los 200 caracteres.'
        })
      }
    }
  }

  //Ahora valida que cada estado procesal tenga la estructura correcta

  if (proceso.estadosProcesales) {
    for (let i = 0; i < proceso.estadosProcesales.length; i++) {
      if (!proceso.estadosProcesales[i].descripcion_estado_procesal || typeof proceso.estadosProcesales[i].descripcion_estado_procesal !== 'string' || proceso.estadosProcesales[i].descripcion_estado_procesal.length > 200) {
        return res.status(400).json({
          message: 'La descripción del estado procesal es requerida, debe ser de tipo string y no debe exceder los 200 caracteres.'
        })
      }

      if (!proceso.estadosProcesales[i].fecha_estado_procesal || isNaN(Date.parse(proceso.estadosProcesales[i].fecha_estado_procesal))) {
        return res.status(400).json({
          message: 'La fecha del estado procesal es requerida y debe ser una fecha válida.'
        })
      }
    }
  }

  //Ahora valida que cada resolucion tenga la estructura correcta

  if (proceso.resoluciones) {
    for (let i = 0; i < proceso.resoluciones.length; i++) {
      if (!proceso.resoluciones[i].resolucion || typeof proceso.resoluciones[i].resolucion !== 'string' || proceso.resoluciones[i].resolucion.length > 200) {
        return res.status(400).json({
          message: 'La descripción de la resolución es requerida, debe ser de tipo string y no debe exceder los 200 caracteres.'
        })
      }

      if (!proceso.resoluciones[i].fecha_resolucion || isNaN(Date.parse(proceso.resoluciones[i].fecha_resolucion))) {
        return res.status(400).json({
          message: 'La fecha de la resolución es requerida y debe ser una fecha válida.'
        })
      }
    }
  }




  logger.info("FIN  Middleware para validar el JSON de un proceso judicial")
  next()
   
}


async function validarJSONProcesoJudicialPUT(req, res, next) {

  logger.info("Middleware para validar el JSON de un proceso judicial")
  const { promovente, demandado, proceso, ...extraData } = req.body
  if (Object.keys(extraData).length !== 0) {
    return res.status(400).json({
      message: 'Hay datos adicionales en el cuerpo de la petición que no son permitidos.'
    });
  }

  if (!promovente || !demandado || !proceso) {
    return res.status(400).json({
      message: 'Faltan datos en el cuerpo de la petición, o el promovente o el demandado o el proceso esta vacio.'
    })
  }



  //Verifica el promovente datos como el nombre primeramente y tamaños y tipo d edatos
  //ID de promovente debe de ser entero haslo con isNan
  if (!promovente.id_promovente || isNaN(promovente.id_promovente)) {
    return res.status(400).json({
      message: 'El id del promovente es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const promoventeDB = await promoventeDAO.obtenerPromoventeMiddlware(promovente.id_promovente)
    if (!promoventeDB) {
      return res.status(404).json({
        message: 'No existe un promovente con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el promovente.'
    })
  }


  if (!promovente.nombre || typeof promovente.nombre !== 'string' || promovente.nombre.length > 50) {
    return res.status(400).json({
      message: 'El nombre del promovente es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica el promovente datos como el apellido_paterno primeramente y tamaños y tipo d edatos
  if (!promovente.apellido_paterno || typeof promovente.apellido_paterno !== 'string' || promovente.apellido_paterno.length > 50) {
    return res.status(400).json({
      message: 'El apellido paterno del promovente es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica el promovente datos como el apellido_materno primeramente y tamaños y tipo d edatos
  if (!promovente.apellido_materno || typeof promovente.apellido_materno !== 'string' || promovente.apellido_materno.length > 50) {
    return res.status(400).json({
      message: 'El apellido materno del promovente es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Te falto revisar que solo sean letras;
  // Expresión regular para validar que solo se ingresen letras y espacios en blanco
  var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  // Verifica que el nombre solo contenga letras y espacios en blanco
  if (!nombrePattern2.test(promovente.nombre)) {
    return res.status(400).json({
      message: 'El nombre del promovente solo puede contener letras y espacios en blanco.'
    })

  }


  if (!nombrePattern2.test(promovente.apellido_paterno)) {
    return res.status(400).json({
      message: 'El apellido paterno del promovente solo puede contener letras y espacios en blanco.'
    })
  }

  if (!nombrePattern2.test(promovente.apellido_materno)) {
    return res.status(400).json({
      message: 'El apellido materno del promovente solo puede contener letras y espacios en blanco.'
    })
  }

  //Verifica que el telefono siempre sea de 10 caracteros y todo entero
  if (!promovente.telefono || isNaN(promovente.telefono) || promovente.telefono.length !== 10) {
    return res.status(400).json({
      message: 'El telefono del promovente es requerido, debe ser de tipo entero y tener 10 caracteres.'
    })

  }

  //verifica que español sea un booleano true or false only
  if (typeof promovente.español !== 'boolean') {
    return res.status(400).json({
      message: 'El campo español del promovente es requerido y debe ser de tipo booleano.'
    })
  }
  //verifica la edad del promovente numero entero y no mayor a 200
  if (!promovente.edad || isNaN(promovente.edad) || promovente.edad > 200) {
    return res.status(400).json({
      message: 'La edad del promovente es requerida, debe ser de tipo entero y no debe exceder los 200 años.'
    })
  }


  //Ahora valida la existencia del domicilio del promovente

  if (!promovente.domicilio) {
    return res.status(400).json({
      message: 'El domicilio del promovente es requerido.'
    })
  }

  //Verifica que el id_domicilio sea un entero
  if (!promovente.domicilio.id_domicilio || isNaN(promovente.domicilio.id_domicilio)) {
    return res.status(400).json({
      message: 'El id del domicilio del promovente es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const domicilioDB = await domicilioDAO.obtenerDomicilioParticipantePorParticipante(promovente.id_promovente)
    if (!domicilioDB) {
      return res.status(404).json({
        message: 'No existe un domicilio con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el domicilio.'
    })
  }

  //Valida los datos del domicilio del promovente
  //Verifica que la calle_domicilio sea un string y no exceda los 75 caracteres
  if (!promovente.domicilio.calle_domicilio || typeof promovente.domicilio.calle_domicilio !== 'string' || promovente.domicilio.calle_domicilio.length > 75) {
    return res.status(400).json({
      message: 'La calle del domicilio del promovente es requerida, debe ser de tipo string y no debe exceder los 75 caracteres.'
    })
  }

  //Verifica que el numero_exterior_domicilio sea un string y no exceda los 25 caracteres
  if (!promovente.domicilio.numero_exterior_domicilio || typeof promovente.domicilio.numero_exterior_domicilio !== 'string' || promovente.domicilio.numero_exterior_domicilio.length > 25) {
    return res.status(400).json({
      message: 'El número exterior del domicilio del promovente es requerido, debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el numero_interior_domicilio sea un string y no exceda los 25 caracteres
  //Solo en caso de que el numero_interior_domicilio no sea nulo
  if (promovente.domicilio.numero_interior_domicilio && (typeof promovente.domicilio.numero_interior_domicilio !== 'string' || promovente.domicilio.numero_interior_domicilio.length > 25)) {
    return res.status(400).json({
      message: 'El número interior del domicilio del promovente debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el id_colonia sea un entero
  if (!promovente.domicilio.id_colonia || isNaN(promovente.domicilio.id_colonia)) {
    return res.status(400).json({
      message: 'El id de la colonia del domicilio del promovente es requerido y debe ser de tipo entero.'
    })
  }
  //verificsr la existencia de etnia, escolaridad y ocupacion
  if (!promovente.id_etnia || isNaN(promovente.id_etnia)) {
    return res.status(400).json({
      message: 'El id de la etnia del promovente es requerido y debe ser de tipo entero.'
    })
  }

  if (!promovente.id_escolaridad || isNaN(promovente.id_escolaridad)) {
    return res.status(400).json({
      message: 'El id de la escolaridad del promovente es requerido y debe ser de tipo entero.'
    })
  }

  if (!promovente.id_ocupacion || isNaN(promovente.id_ocupacion)) {
    return res.status(400).json({
      message: 'El id de la ocupación del promovente es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const etniaDB = await etniaDAO.obtenerEtnia(promovente.id_etnia)
    if (!etniaDB) {
      return res.status(404).json({
        message: 'No existe una etnia con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la etnia.'
    })
  }

  try {
    const escolaridadDB = await escolaridadDAO.obtenerEscolaridadPorId(promovente.id_escolaridad)
    if (!escolaridadDB) {
      return res.status(404).json({
        message: 'No existe una escolaridad con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la escolaridad.'
    })
  }

  try {

    const ocupacionDB = await ocupacionDAO.obtenerOcupacion(promovente.id_ocupacion)
    if (!ocupacionDB) {
      return res.status(404).json({
        message: 'No existe una ocupación con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la ocupación.'
    })
  }


  //Haz algo similiar para en el caso del demandado

  //Verifica el demandado datos como el nombre primeramente y tamaños y tipo d edatos
  //ID de demandado debe de ser entero haslo con isNan
  if (!demandado.id_demandado || isNaN(demandado.id_demandado)) {
    return res.status(400).json({
      message: 'El id del demandado es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const demandadoDB = await demandadoDAO.obtenerDemandado(demandado.id_demandado)
    if (!demandadoDB) {
      return res.status(404).json({
        message: 'No existe un demandado con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el demandado.'
    })
  }


  //Verifica que el nombre del demandado sea un string y no exceda los 50 caracteres
  if (!demandado.nombre || typeof demandado.nombre !== 'string' || demandado.nombre.length > 50) {
    return res.status(400).json({
      message: 'El nombre del demandado es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica que el apellido_paterno del demandado sea un string y no exceda los 50 caracteres
  if (!demandado.apellido_paterno || typeof demandado.apellido_paterno !== 'string' || demandado.apellido_paterno.length > 50) {
    return res.status(400).json({
      message: 'El apellido paterno del demandado es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica que el apellido_materno del demandado sea un string y no exceda los 50 caracteres
  if (!demandado.apellido_materno || typeof demandado.apellido_materno !== 'string' || demandado.apellido_materno.length > 50) {
    return res.status(400).json({
      message: 'El apellido materno del demandado es requerido, debe ser de tipo string y no debe exceder los 50 caracteres.'
    })
  }

  //Verifica que el nombre solo contenga letras y espacios en blanco
  if (!nombrePattern2.test(demandado.nombre)) {
    return res.status(400).json({
      message: 'El nombre del demandado solo puede contener letras y espacios en blanco.'
    })

  }

  if (!nombrePattern2.test(demandado.apellido_paterno)) {
    return res.status(400).json({
      message: 'El apellido paterno del demandado solo puede contener letras y espacios en blanco.'
    })
  }

  if (!nombrePattern2.test(demandado.apellido_materno)) {
    return res.status(400).json({
      message: 'El apellido materno del demandado solo puede contener letras y espacios en blanco.'
    })
  }


  //Verifica que el telefono del demandado sea un entero y tenga 10 caracteres
  if (!demandado.telefono || isNaN(demandado.telefono) || demandado.telefono.length !== 10) {
    return res.status(400).json({
      message: 'El telefono del demandado es requerido, debe ser de tipo entero y tener 10 caracteres.'
    })

  }

  //Verifica la edad del demandado sea un entero y no exceda los 200 años
  if (!demandado.edad || isNaN(demandado.edad) || demandado.edad > 200) {
    return res.status(400).json({
      message: 'La edad del demandado es requerida, debe ser de tipo entero y no debe exceder los 200 años.'
    })
  }

  //Ahora valida la existencia del domicilio del demandado
  if (!demandado.domicilio) {
    return res.status(400).json({
      message: 'El domicilio del demandado es requerido.'
    })
  }

  //Verifica que el id_domicilio sea un entero

  if (!demandado.domicilio.id_domicilio || isNaN(demandado.domicilio.id_domicilio)) {
    return res.status(400).json({
      message: 'El id del domicilio del demandado es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const domicilioDB = await domicilioDAO.obtenerDomicilioParticipantePorParticipante(demandado.id_demandado)
    if (!domicilioDB) {
      return res.status(404).json({
        message: 'No existe un domicilio con ese id.'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el domicilio.'
    })
  }

  //Valida los datos del domicilio del demandado
  //Verifica que la calle_domicilio sea un string y no exceda los 75 caracteres
  if (!demandado.domicilio.calle_domicilio || typeof demandado.domicilio.calle_domicilio !== 'string' || demandado.domicilio.calle_domicilio.length > 75) {
    return res.status(400).json({
      message: 'La calle del domicilio del demandado es requerida, debe ser de tipo string y no debe exceder los 75 caracteres.'
    })
  }

  //Verifica que el numero_exterior_domicilio sea un string y no exceda los 25 caracteres
  if (!demandado.domicilio.numero_exterior_domicilio || typeof demandado.domicilio.numero_exterior_domicilio !== 'string' || demandado.domicilio.numero_exterior_domicilio.length > 25) {
    return res.status(400).json({
      message: 'El número exterior del domicilio del demandado es requerido, debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el numero_interior_domicilio sea un string y no exceda los 25 caracteres
  //Solo en caso de que el numero_interior_domicilio no sea nulo

  if (demandado.domicilio.numero_interior_domicilio && (typeof demandado.domicilio.numero_interior_domicilio !== 'string' || demandado.domicilio.numero_interior_domicilio.length > 25)) {
    return res.status(400).json({
      message: 'El número interior del domicilio del demandado debe ser de tipo string y no debe exceder los 25 caracteres.'
    })
  }

  //Verifica que el id_colonia sea un entero
  if (!demandado.domicilio.id_colonia || isNaN(demandado.domicilio.id_colonia)) {
    return res.status(400).json({
      message: 'El id de la colonia del domicilio del demandado es requerido y debe ser de tipo entero.'
    })
  }

  //Ahora verificar lo relacionado en el proceso

  //Verifica que la fecha_inicio del proceso sea una fecha válida
  if (!proceso.fecha_inicio || isNaN(Date.parse(proceso.fecha_inicio))) {
    return res.status(400).json({
      message: 'La fecha de inicio del proceso es requerida y debe ser una fecha válida.'
    })
  }

  //Verifica que el control_interno del proceso sea un string y no exceda los 20 caracteres
  if (!proceso.control_interno || typeof proceso.control_interno !== 'string' || proceso.control_interno.length > 20) {
    return res.status(400).json({
      message: 'El control interno del proceso es requerido, debe ser de tipo string y no debe exceder los 20 caracteres.'
    })
  }

  //Verifica que el numero_expediente del proceso sea un string y no exceda los 20 caracteres
  if (!proceso.numero_expediente || typeof proceso.numero_expediente !== 'string' || proceso.numero_expediente.length > 20) {
    return res.status(400).json({
      message: 'El número de expediente del proceso es requerido, debe ser de tipo string y no debe exceder los 20 caracteres.'
    })
  }

  //Verifica que el estatus_proceso del proceso sea un string y solo acepte los valores permitidos
  if (!proceso.estatus_proceso || (proceso.estatus_proceso !== 'EN_TRAMITE' && proceso.estatus_proceso !== 'BAJA' && proceso.estatus_proceso !== 'CONCLUIDO')) {
    return res.status(400).json({
      message: 'El estatus del proceso es requerido y solo puede ser EN_TRAMITE, BAJA o CONCLUIDO.'
    })
  }


  //Verifica que el id_juzgado del proceso sea un entero
  if (!proceso.id_juzgado || isNaN(proceso.id_juzgado)) {
    return res.status(400).json({
      message: 'El id del juzgado es requerido y debe ser de tipo entero.'
    })
  }

  try {
    const juzgadoDB = await juzgadoDAO.obtenerJuzgado(proceso.id_juzgado)
    if (!juzgadoDB) {
      return res.status(404).json({
        message: 'No existe un juzgado con ese id.'
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el juzgado.'
    })
  }


  //Verifica que el id_distrito_judicial del proceso sea un entero
  if (!proceso.id_distrito_judicial || isNaN(proceso.id_distrito_judicial)) {
    return res.status(400).json({
      message: 'El id del distrito judicial es requerido y debe ser de tipo entero.'
    })
  }

  //Verifica que el id_municipio_distrito del proceso sea un entero
  if (!proceso.id_municipio_distrito || isNaN(proceso.id_municipio_distrito)) {
    return res.status(400).json({
      message: 'El id del municipio del distrito judicial es requerido y debe ser de tipo entero.'
    })
  }

  //Verifica que el id_tipo_juicio del proceso sea un entero
  if (!proceso.id_tipo_juicio || isNaN(proceso.id_tipo_juicio)) {
    return res.status(400).json({
      message: 'El id del tipo de juicio es requerido y debe ser de tipo entero.'
    })
  }

  //En caso de que la fecha estatus no sea nula verifica que sea una fecha valida
  if (proceso.fecha_estatus && isNaN(Date.parse(proceso.fecha_estatus))) {
    return res.status(400).json({
      message: 'La fecha de estatus del proceso debe ser una fecha válida.'
    })
  }

  //Ahora obten el proceso y verifica que los datos que sean numeros o id no sea diferentes
  // a los que se encuentran en la base de datos
  try {
    const procesoDB = await procesoJudicialDAO.obtenerProcesoJudicialMiddleware(proceso.id_proceso_judicial)
    if (!procesoDB) {
      return res.status(404).json({
        message: 'No existe un proceso judicial con ese id.'
      })
    }
    /*
     if (procesoDB.id_juzgado !== proceso.id_juzgado) {
       return res.status(400).json({
         message: 'El id del juzgado no puede ser modificado.'
       })
     }
 
     if (procesoDB.id_distrito_judicial !== proceso.id_distrito_judicial) {
       return res.status(400).json({
         message: 'El id del distrito judicial no puede ser modificado.'
       })
     }
 
     if (procesoDB.id_municipio_distrito !== proceso.id_municipio_distrito) {
       return res.status(400).json({
         message: 'El id del municipio del distrito judicial no puede ser modificado.'
       })
     }
 
     if (procesoDB.id_tipo_juicio !== proceso.id_tipo_juicio) {
 
       return res.status(400).json({
         message: 'El id del tipo de juicio no puede ser modificado.'
       })
     }
       //Resulta que estos pueden ser en string
         "proceso": {
         "fecha_inicio": "2024-06-24",
         "fecha_estatus": null,
         "id_juzgado": "1",
         "juzgado": "Primero Familiar",
         "numero_expediente": "AAAAABBBBB",
         "control_interno": "CCCCCDDDDD",
         "id_defensor": 2,
         "estatus_proceso": "EN_TRAMITE",
         "id_distrito_judicial": "1",
         "id_municipio_distrito": "60",
         "id_tipo_juicio": "2",
         "tipo_juicio": "Divorcio Voluntario",
         "municipio": "Álamos",
         "distrito_judicial": "Distrito Judicial de Alamos",
         "id_proceso_judicial": 1
     }
   */
    try {
      if (procesoDB.id_juzgado !== parseInt(proceso.id_juzgado, 10)) {
        return res.status(400).json({
          message: 'El id del juzgado no puede ser modificado.'
        })
      }

      if (procesoDB.id_distrito_judicial !== parseInt(proceso.id_distrito_judicial, 10)) {
        return res.status(400).json({
          message: 'El id del distrito judicial no puede ser modificado.'
        })
      }

      if (procesoDB.id_municipio_distrito !== parseInt(proceso.id_municipio_distrito, 10)) {
        return res.status(400).json({
          message: 'El id del municipio del distrito judicial no puede ser modificado.'
        })
      }

      if (procesoDB.id_tipo_juicio !== parseInt(proceso.id_tipo_juicio, 10)) {
        return res.status(400).json({
          message: 'El id del tipo de juicio no puede ser modificado.'
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener el proceso judicial.'
      })
    }



    if (procesoDB.id_defensor !== proceso.id_defensor) {
      return res.status(400).json({
        message: 'El id del defensor no puede ser modificado.'
      })
    }


  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el proceso judicial.'
    })
  }



  try {

    let codigo_client = grpc.loadPackageDefinition(packageDefinition).codigoService;
    const validador = new codigo_client.CodigoService(process.env.HOSTGRPCCODIGOSPOSTALES, grpc.credentials.createInsecure());
    const auxiliar = [];

    const validarCodigoPromise = new Promise((resolve, reject) => {
      validador.validarCodigo({ id_colonia: promovente.domicilio.id_colonia }, function (err, response) {
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
      console.log(auxiliar)
      return res.status(400).json({ message: "El id de colonia no existe." });
    }
  } catch (error) {
    console.log("error al validar el codigo postal", error.message)
    return res.status(400).json({ message: "El id de colonia no existe." });
  }
  try {
    let codigo_client = grpc.loadPackageDefinition(packageDefinition).codigoService;
    const validador = new codigo_client.CodigoService(process.env.HOSTGRPCCODIGOSPOSTALES, grpc.credentials.createInsecure());
    const auxiliar = [];

    const validarCodigoPromise = new Promise((resolve, reject) => {
      validador.validarCodigo({ id_colonia: demandado.domicilio.id_colonia }, function (err, response) {
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
  // haz algo similar en promovente y demandado para el genero 
  /*
service GeneroService {
  rpc validarGenero(ValidacionGeneroRequest) returns (ValidacionResponse) {}
}


message ValidacionGeneroRequest {
  string id_genero = 1;
}
  */
  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.GeneroService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarGeneroPromise = new Promise((resolve, reject) => {
      validador.validarGenero({ id_genero: promovente.id_genero }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Genero inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    }
    );
    await validarGeneroPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El genero no es válido" });
    }

  } catch (error) {
    return res.status(400).json({ message: "Error al validar el genero, o no es valido" });
  }

  try {
    let asesoria_client = grpc3.loadPackageDefinition(packageDefinition2).servicios;
    const validador = new asesoria_client.GeneroService(process.env.HOSTGRPCASESORIAS, grpc3.credentials.createInsecure());
    const auxiliar = [];

    const validarGeneroPromise = new Promise((resolve, reject) => {
      validador.validarGenero({ id_genero: demandado.id_genero }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.message === "Genero inválido") {
            auxiliar.push(response.message);
          }
          resolve();
        }
      });
    }
    );
    await validarGeneroPromise;
    if (auxiliar.length > 0) {
      return res.status(400).json({ message: "El genero no es válido" });
    }

  }
  catch (error) {
    return res.status(400).json({ message: "Error al validar el genero, o no es valido" });
  }


  //Ahora verifica que el id de http://localhost:3026/proceso-judicial/1
  //no sea diferente al id_proceso_judicial del proceso

  const { id } = req.params

  //verifica que el id sea un entero
  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: 'El id del proceso judicial es requerido y debe ser de tipo entero.'
    })
  }

  if (proceso.id_proceso_judicial !== parseInt(id, 10)) {
    return res.status(400).json({
      message: 'El id del proceso judicial no puede ser modificado.'
    })
  }


  //
  logger.info("Fin del middleware para validar el JSON de un proceso judicial")

  next()
}




const { packageDefinition2 } = require("../clienteAsesorias/cliente.js")

// Variable para cargar el módulo de gRPC
const grpc3 = require('@grpc/grpc-js');




// Variable para cargar el módulo de gRPC
const grpc = require('@grpc/grpc-js');
// Variable para cargar el módulo de proto-loader
const { packageDefinition } = require("../clienteCodigosPostales/cliente.js")




const participanteDAO = require('../data-access/participanteDAO')
const juzgadoDAO = require('../data-access/juzgadoDAO')

const etniaDAO = require('../data-access/etniaDAO')
const escolaridadDAO = require('../data-access/escolaridadDAO')
const ocupacionDAO = require('../data-access/ocupacionDAO')


const estadosProcesalesDAO = require('../data-access/estado_procesalDAO')
const observacionesDAO = require('../data-access/observacionDAO')
const resolucionesDAO = require('../data-access/resolucionDAO')
const pruebasDAO = require('../data-access/pruebaDAO')
const familiaresDAO = require('../data-access/familiarDAO')

const demandadoDAO = require('../data-access/demandadoDAO')
const promoventeDAO = require('../data-access/promoventeDAO')
const domicilioDAO = require('../data-access/domicilio_participanteDAO');
const { log } = require('winston');

module.exports = {
  existeProcesoJudicial,
  validarJSONProcesoJudicialPOST,
  validarJSONProcesoJudicialPUT
}
