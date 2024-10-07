const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

/*
* Modelo de ocupacion el cual contiene los atributos de una ocupacion
*/
const ocupacion = sequelize.define('ocupacion', {
  id_ocupacion: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  descripcion_ocupacion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  estatus_general: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), // Usar ENUM con los valores permitidos
    allowNull: false,
    validate: {
      isIn: [['ACTIVO', 'INACTIVO']], // Validar que solo acepte estos valores
    },
  }
}, {
  sequelize,
  tableName: 'ocupacion',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_ocupacion' }
      ]
    }
  ]
})

module.exports = ocupacion
