const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

/*
* Modelo de participante el cual contiene los atributos de un participante
* y establece las relaciones con los modelos de escolaridad, etnia, ocupacion y persona
*/
const participante = sequelize.define('participante', {
  id_participante: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido_paterno: {
    type: DataTypes.STRING(50),
    allowNull: false
  }, apellido_materno: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 15],
    },
    defaultValue: null,
  },
  id_genero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_proceso_judicial: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proceso_judicial',
      key: 'id_proceso_judicial'
    }
  }
}, {
  sequelize,
  tableName: 'participante',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_participante' }
      ]
    },
    {
      name: 'id_proceso_judicial_idx3',
      using: 'BTREE',
      fields: [
        { name: 'id_proceso_judicial' }
      ]
    }
  ]
})

module.exports = participante
