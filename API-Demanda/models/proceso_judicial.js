const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

/*
* Modelo de proceso judicial el cual contiene los atributos de un proceso judicial
* y establece las relaciones con el modelo de juzgado
*/
const procesoJudicial = sequelize.define('proceso_judicial', {
  id_proceso_judicial: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_estatus: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  control_interno: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  numero_expediente: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  id_turno: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, id_distrito_judicial: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_municipio_distrito: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, id_tipo_juicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, id_defensor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estatus_proceso: {
    type: DataTypes.ENUM('EN_TRAMITE', 'BAJA', 'CONCLUIDO'), // Usar ENUM con los valores permitidos
    allowNull: false,
    validate: {
      isIn: [['EN_TRAMITE', 'BAJA', 'CONCLUIDO']], // Validar que solo acepte estos valores
    },
  },

  id_juzgado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'juzgado',
      key: 'id_juzgado'
    }
  },

}, {
  sequelize,
  tableName: 'proceso_judicial',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_proceso_judicial' }
      ]
    },
    {
      name: 'id_juzgado',
      using: 'BTREE',
      fields: [
        { name: 'id_juzgado' }
      ]
    }
  ]
})

module.exports = procesoJudicial
