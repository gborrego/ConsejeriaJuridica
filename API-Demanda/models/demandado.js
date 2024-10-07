const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

/*
* Modelo de demandado el cual contiene los atributos de un demandado
* y establece las relaciones con el modelo de participante
*/
const demandado = sequelize.define('demandado', {
  id_demandado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'participante',
      key: 'id_participante'
    }
  }
}, {
  sequelize,
  tableName: 'demandado',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_demandado' }
      ]
    }
  ]
})

module.exports = demandado
