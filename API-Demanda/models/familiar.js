const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
 
/** 
 *  Modelo de la tabla familiar
 */
const familiar = sequelize.define('familiar', {
    id_familiar: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nacionalidad: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    parentesco: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    perteneceComunidadLGBT: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    adultaMayor: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    saludPrecaria: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    pobrezaExtrema: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    id_promovente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'promovente',
            key: 'id_promovente'
        }
    },
}, {
    sequelize,
    tableName: 'familiar',
    timestamps: false,
    indexes: [
        {
            name: 'id_promovente',
            using: 'BTREE',
            fields: [
                { name: 'id_promovente' }
            ]
        }
    ]
})

module.exports = familiar
