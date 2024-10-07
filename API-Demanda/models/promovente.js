const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')


/*
* Modelo de promovente el cual contiene los atributos de un promovente
* y establece las relaciones con el modelo de participante
*/
const promovente = sequelize.define('promovente', {
  id_promovente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'participante',
      key: 'id_participante'
    }
  },
  español: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  id_escolaridad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'escolaridad',
      key: 'id_escolaridad'
    }
  },
  id_etnia: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'etnia',
      key: 'id_etnia'
    }
  },
  id_ocupacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ocupacion',
      key: 'id_ocupacion'
    }
  },
}, {
  sequelize,
  tableName: 'promovente',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id_promovente' }
      ]
    }, {
      name: 'id_escolaridad',
      using: 'BTREE',
      fields: [
        { name: 'id_escolaridad' }
      ]
    },
    {
      name: 'id_etnia',
      using: 'BTREE',
      fields: [
        { name: 'id_etnia' }
      ]
    },
    {
      name: 'id_ocupacion',
      using: 'BTREE',
      fields: [
        { name: 'id_ocupacion' }
      ]
    }
  ]
})

module.exports = promovente
