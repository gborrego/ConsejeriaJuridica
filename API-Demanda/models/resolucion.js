const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

 /**
  * Modelo de la tabla resolucion
  */
const resolucion = sequelize.define('resolucion', {
  id_resolucion: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  resolucion: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fecha_resolucion: {
    type: DataTypes.DATEONLY,
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
  tableName: 'resolucion',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_resolucion' }
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

module.exports = resolucion

