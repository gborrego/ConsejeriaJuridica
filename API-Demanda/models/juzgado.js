const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

/*
* Modelo de juzgado el cual contiene los atributos de un juzgado
*/
const juzgado = sequelize.define('juzgado', {
  id_juzgado: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nombre_juzgado: {
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
  tableName: 'juzgado',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_juzgado' }
      ]
    }
  ]
})

module.exports = juzgado
