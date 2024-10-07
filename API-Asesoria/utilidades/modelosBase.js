const sequelize = require("./conexion");

const { DataTypes } = require("sequelize");


//Modelos con funciones que aceptan cambios; 
/**
 * @typedef {Object} TipoJuicio 
 * @property {number} id_tipo_juicio
 *  @property {string} tipo_juicio
 * */
const TipoJuicio = sequelize.define(
  "tipos_juicios",
  {
    id_tipo_juicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    tipo_juicio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100],
      },
    }
    ,
    estatus_general: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['ACTIVO', 'INACTIVO']], // Validar que solo acepte estos valores
      },
    }

  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


/**
 * @typedef {Object} EstadoCivil
 * @property {number} id_estado_civil
 * @property {string} estado_civil
  */
const EstadoCivil = sequelize.define(
  "estados_civiles",
  {
    id_estado_civil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    estado_civil: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
    estatus_general: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['ACTIVO', 'INACTIVO']], // Validar que solo acepte estos valores
      },
    }

  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


/**
 * @typedef {Object} Genero
 * @property {number} id_genero
 * @property {string} descripcion_genero
 * */
const Genero = sequelize.define(
  "generos",
  {
    id_genero: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    descripcion_genero: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 25],
      },
    }, estatus_general: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['ACTIVO', 'INACTIVO']], // Validar que solo acepte estos valores
      },
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "genero",
      plural: "generos",
    },
  }
);

/**
 * @typedef {Object} Motivo
 * @property {number} id_motivo
 * @property {string} descripcion_motivo
 * */
const Motivo = sequelize.define(
  "motivos",
  {
    id_motivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    descripcion_motivo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 75],
      },
    }, estatus_general: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['ACTIVO', 'INACTIVO']], // Validar que solo acepte estos valores
      },
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "motivo",
      plural: "motivos",
    },
  }
);



/**
 * @typedef {Object} CatalogoRequisito
 * @property {number} id_catalogo
 * @property {string} descripcion_catalogo
 * */
const CatalogoRequisito = sequelize.define(
  "catalogo_requisitos",
  {
    id_catalogo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    descripcion_catalogo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 75],
      },
    }, estatus_general: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['ACTIVO', 'INACTIVO']], // Validar que solo acepte estos valores
      },
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);



/**
 * @typedef {Object} Empleado
 * @property {number} id_empleado
 * @property {string} tipo_empleado
 * */

const Empleado = sequelize.define(
  "empleados",
  {
    id_empleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    tipo_empleado: {
      type: DataTypes.STRING(100),
      allowNull: false, // Don't allow null
    }, id_distrito_judicial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_distrito_judicial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estatus_general: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['ACTIVO', 'INACTIVO']], // Validar que solo acepte estos valores
      },
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "empleado",
      plural: "empleados",
    },
  }
);
/**
 * @typedef {Object} Asesor
 * @property {number} id_asesor
 * @property {string} nombre_asesor
 * @property {number} id_zona
 * */
const Asesor = sequelize.define(
  "asesores",
  {
    id_asesor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    nombre_asesor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100],
      },
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "asesor",
      plural: "asesores",
    },
  }
);

/**
 * @typedef {Object} Defensor
 * @property {number} id_defensor
 * @property {string} nombre_defensor
 * */

const Defensor = sequelize.define(
  "defensores",
  {
    id_defensor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    nombre_defensor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100],
      },
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "defensor",
      plural: "defensores",
    },
  }
);




//Modelo el cul es la base para el sistema de demanda

/**
 * @typedef {Object} Turno
 * @property {number} id_turno
 * @property {Date} fecha_turno
 * @property {Time} hora_turno
 * */
const Turno = sequelize.define(
  "turnos",
  {
    id_turno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    fecha_turno: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    hora_turno: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    id_asesoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, id_defensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },    estatus_general: {
      type: DataTypes.ENUM('EN_SEGUIMIENTO', 'NO_SEGUIMIENTO'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['EN_SEGUIMIENTO', 'NO_SEGUIMIENTO']], // Validar que solo acepte estos valores
      }, 
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "turno",
      plural: "turnos",
    },
  }
);


//Modelos clave del sistema

/**
 * @typedef {Object} Zona
 * @property {number} id_zona
 * @property {string} nombre_zona
 *  */
const Zona = sequelize.define(
  "zonas",
  {
    id_zona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    nombre_zona: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "zona",
      plural: "zonas",
    },
  }
);



/**
 * @typedef {Object} Persona
 * @property {number} id_persona
 *  @property {string} nombre
 * @property {string} apellido_materno
 * @property {string} apellido_paterno
 * @property {number} edad
 * @property {string} telefono
 * @property {number} id_domicilio
 * @property {number} id_genero
 * */
const Persona = sequelize.define(
  "personas",
  {
    id_persona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
    apellido_materno: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
    apellido_paterno: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 15],
      },
      defaultValue: null,
    },
    id_domicilio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    id_genero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "persona",
      plural: "personas",
    },
  }
);

/**
 * @typedef {Object} DetalleAsesoriaCatalogo
 * @property {number} id_detalle
 * @property {number} id_asesoria
 * @property {number} id_catalogo
 * */

const DetalleAsesoriaCatalogo = sequelize.define(
  "detalle_asesorias_catalogos",
  {
    id_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_asesoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_catalogo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "detalle_asesoria_catalogo",
      plural: "detalle_asesorias_catalogos",
    },
  }
);

/**
 * @typedef {Object} Asesorado
 * @property {number} id_asesorado
 * @property {boolean} estatus_trabajo
 * @property {number} id_motivo
 * @property {number} id_estado_civil
 * @property {number} numero_hijos
 * @property {number} ingreso_mensual
 * */
const Asesorado = sequelize.define(
  "asesorados",
  {
    id_asesorado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    estatus_trabajo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id_motivo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    id_estado_civil: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numero_hijos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    ingreso_mensual: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "asesorado",
      plural: "asesorados",
    },
  }
);




/**
 * @typedef {Object} Domicilio
 * @property {number} id_domicilio
 * @property {string} calle_domicilio
 * @property {string} numero_exterior_domicilio
 * @property {string} numero_interior_domicilio
 * @property {number} id_colonia
 * */
const Domicilio = sequelize.define(
  "domicilios",
  {
    id_domicilio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    calle_domicilio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 75],
      },
    },
    numero_exterior_domicilio: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 25],
      },
      defaultValue: null,
    },
    numero_interior_domicilio: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 25],
      },
      defaultValue: null,
    },
    id_colonia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "domicilio",
      plural: "domicilios",
    },
  }
);

/**
 * @typedef {Object} MunicipioDistro
 * @property {number} id_municipio_distrito
 * @property {string} nombre_municipio
 * @property {number} id_distrito_judicial
 * */
const MunicipioDistro = sequelize.define(
  "municipios_distritos",
  {
    // Define the "municipios" table
    id_municipio_distrito: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre_municipio: {
      type: DataTypes.STRING(100),
      allowNull: false, // Don't allow null
    },
    id_distrito_judicial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Don't include timestamps
    freezeTableName: true, // Use the same table name
    tableName: "municipios_distritos", // Use the same table name
    underscored: true, // Use snake_case not camelCase
    name: {
      singular: "municipio_distrito",
      plural: "municipios_distritos",
    },
  }
);

/**
 *  @typedef {Object} DistritoJudicial
 * @property {number} id_distrito_judicial
 * @property {string} nombre_distrito_judicial
 * @property {number} id_zona
 * @property {number} id_municipio_distrito
 * */
const DistritoJudicial = sequelize.define(
  "distritos_judiciales",
  {
    id_distrito_judicial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    nombre_distrito_judicial: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100],
      },
    },
    id_zona: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_municipio_distrito: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "distrito_judicial",
      plural: "distritos_judiciales",
    },
  }
);


///Modelo Asesoria el cual posee actualizaciones y nuevos enum

/**
 *  @typedef {Object} Asesoria
 * @property {number} id_asesoria
 * @property {string} resumen_asesoria
 *  @property {string} conclusion_asesoria
 * @property {boolean} estatus_requisitos
 * @property {Date} fecha_registro
 * @property {number} id_empleado
 * @property {number} id_turno
 * @property {number} id_asesorado
 * @property {string} usuario 
 * @property {number} id_tipo_juicio
 */
const Asesoria = sequelize.define(
  "asesorias",
  {
    id_asesoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    resumen_asesoria: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500],
      },
      defaultValue: null,
    },
    conclusion_asesoria: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 250],
      },
      defaultValue: null,
    },
    estatus_requisitos: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
    fecha_registro: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  
    ,
    id_asesorado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 75],
      },
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_distrito_judicial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, id_municipio_distrito: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estatus_asesoria: {
      type: DataTypes.ENUM('NO_TURNADA', 'TURNADA'), // Usar ENUM con los valores permitidos
      allowNull: false,
      validate: {
        isIn: [['NO_TURNADA', 'TURNADA']], // Validar que solo acepte estos valores
      },
    }

    
  },
  {
    freezeTableName: true,
    timestamps: false,
    name: {
      singular: "asesoria",
      plural: "asesorias",
    },
  }
);



//Module exports
module.exports = {
  Turno,
  Persona, Empleado, DistritoJudicial,
  MunicipioDistro, Defensor,
  Asesorado,
  Asesoria,
  EstadoCivil,
  Domicilio,
  Asesor,
  DetalleAsesoriaCatalogo,
  CatalogoRequisito,
  Genero,
  Zona,
  Motivo,
  TipoJuicio,
};
