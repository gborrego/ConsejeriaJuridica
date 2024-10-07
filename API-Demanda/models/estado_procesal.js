const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

/*
* Modelo de estado procesal el cual contiene los atributos de un estado procesal
* y establece las relaciones con el modelo de proceso judicial
*/
const estadoProcesal = sequelize.define('estado_procesal', {
  id_estado_procesal: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  descripcion_estado_procesal: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fecha_estado_procesal: {
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
  tableName: 'estado_procesal',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_estado_procesal' }
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

module.exports = estadoProcesal

