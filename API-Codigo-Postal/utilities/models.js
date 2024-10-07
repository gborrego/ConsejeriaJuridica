//Constante que representa el modelo de Ciudades
const sequelize = require("./connection.js"); 

//Obtencion de variables DataTypes y Model de sequelize para la creacion de los modelos
const { DataTypes, Model } = require("sequelize"); 

/**
 * Modelo de la tabla estados
 * @name Estado
 * @type {Model}
 * @const
 * @property {number} id_estado - Identificador del estado
 * @property {string} nombre_estado - Nombre del estado
 */ 
const Estado = sequelize.define(
  "estados",
  {
    id_estado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_estado: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true, 
    tableName: "estados", 
    underscored: true,
    name: {
      singular: "estado",
      plural: "estados",
    },
  }
);

/**
 * Modelo de la tabla municipios
 * @name Municipio
 * @type {Model}
 * @const
 * @property {number} id_municipio - Identificador del municipio
 * @property {string} nombre_municipio - Nombre del municipio
 * @property {number} id_estado - Identificador del estado
 *  
 */
const Municipio = sequelize.define(
  "municipios",
  {
    id_municipio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_municipio: {
      type: DataTypes.STRING(100),
      allowNull: false, 
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, 
    freezeTableName: true, 
    tableName: "municipios", 
    underscored: true,
  }
);

/**
 * Modelo de la tabla ciudades
 * @name Ciudad
 * @type {Model}
 * @const
 * @property {number} id_ciudad - Identificador de la ciudad
 * @property {string} nombre_ciudad - Nombre de la ciudad
 * 
 */
const Ciudad = sequelize.define(
  "ciudades",
  {
    id_ciudad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_ciudad: {
      type: DataTypes.STRING(50),
      allowNull: false, // Don't allow null
    },
  },
  {
    timestamps: false, 
    freezeTableName: true, 
    tableName: "ciudades", 
    underscored: true, 
    name: {
      singular: "ciudad",
      plural: "ciudades",
    },
  }
);

/**
 * Modelo de la tabla codigos_postales
 * @name CodigoPostal
 * @type {Model}
 * @const
 * @property {number} id_codigo_postal - Identificador del codigo postal
 * @property {number} codigo_postal - Codigo postal
 * @property {number} id_municipio - Identificador del municipio
 * 
 */
const CodigoPostal = sequelize.define(
  "codigos_postales",
  {
    id_codigo_postal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo_postal: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    id_municipio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, 
    freezeTableName: true, 
    tableName: "codigos_postales", 
    underscored: true, 
    name: {
        singular: "codigo_postal",
        plural: "codigos_postales",
      },
  }
);

/**
 * Modelo de la tabla colonias
 * @name Colonia 
 * @type {Model} 
 * @const 
 * @property {number} id_colonia - Identificador de la colonia
 * @property {string} nombre_colonia - Nombre de la colonia
 * @property {number} id_ciudad - Identificador de la ciudad
 * @property {number} id_codigo_postal - Identificador del codigo postal
 * 
 */
const Colonia = sequelize.define(
  "colonias",
  {
    id_colonia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_colonia: {
      type: DataTypes.STRING(60),
      allowNull: false, 
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_codigo_postal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, 
    freezeTableName: true, 
    tableName: "colonias", 
    underscored: true, 
  }
);

//Exportar los modelos
module.exports = {
  Estado,
  Municipio,
  Ciudad,
  CodigoPostal,
  Colonia,
};
