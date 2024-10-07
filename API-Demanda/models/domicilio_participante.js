const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
/**
 * Modelo de la tabla domicilio_participante
 * @name domicilio_participante
 * @type {object}
 * @param {number} id_domicilio - Llave primaria de la tabla. Número autogenerado
 * @param {string} calle_domicilio - Campo obligatorio. Calle del domicilio del participante
 * @param {string} numero_exterior_domicilio - Campo opcional. Número exterior del domicilio del participante
 * @param {string} numero_interior_domicilio - Campo opcional. Número interior del domicilio del participante
 * @param {number} id_colonia - Llave foránea que referencia a la colonia del domicilio del participante
 * @param {number} id_participante - Llave foránea que referencia al participante
 * @param {object} domicilio_participante - Objeto que define el modelo domicilio_participante
 * @returns {object} Retorna el modelo domicilio_participante
 * */


const domicilio_participante = sequelize.define('domicilio_participante', {
    id_domicilio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    calle_domicilio: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [0, 75],
        },
    },
    numero_exterior_domicilio: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 25],
        },
        defaultValue: null,
    },
    numero_interior_domicilio: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 25],
        },
        defaultValue: null,
    },
    id_colonia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    id_participante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'participante',
            key: 'id_participante'
        }
    },
}, {
    sequelize,
    tableName: 'domicilio_participante',
    timestamps: false,
    indexes: [
        {
            name: 'id_participante',
            using: 'BTREE',
            fields: [
                { name: 'id_participante' }
            ]
        }
    ]
})

module.exports = domicilio_participante
