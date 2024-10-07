const Sequelize = require('sequelize');


const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

/**
 * Modelo de la tabla observacion
 * @name observacion
 * @type {object}
 * @param {number} id_observacion - Llave primaria de la tabla. Número autogenerado
 * @param {string} observacion - Campo obligatorio. Observación del proceso judicial
 * @param {number} id_proceso_judicial - Llave foránea que referencia al proceso judicial
 * @param {object} observacion - Objeto que define el modelo observacion
 * @returns {object} Retorna el modelo observacion
 * */
const observacion =  sequelize.define('observacion', {
    id_observacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    observacion: {
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
    tableName: 'observacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_observacion" },
        ]
      },
      {
        name: "id_proceso_judicial",
        using: "BTREE",
        fields: [
          { name: "id_proceso_judicial" },
        ]
      },
    ]
  });

module.exports = observacion