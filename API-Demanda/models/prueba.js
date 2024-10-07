
const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
 /**
  * Modelo de la tabla prueba
  */

const prueba = sequelize.define('prueba', {
  id_prueba: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  descripcion_prueba: {
    type: DataTypes.STRING(200),
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
  tableName: 'prueba',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_prueba' }
      ]
    },
    {
      name: 'id_proceso_judicial',
      using: 'BTREE',
      fields: [
        { name: 'id_proceso_judicial' }
      ]
    }
  ]
}) 

module.exports = prueba