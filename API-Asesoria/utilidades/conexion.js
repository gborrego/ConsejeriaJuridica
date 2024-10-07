
//Obtencion del Sequelize para la conexion a la base de datos
const { Sequelize } = require("sequelize");
//  Obtenemos las variables de entorno para la conexion a la base de datos
const {
  DATABASE,
  DBUSER,
  DBPASSWORD,
  DBHOST,
  DBPORT,
} = require('../configuracion/default.js');

// Crear la conexión a la base de datos
const sequelize = new Sequelize(DATABASE, DBUSER, DBPASSWORD, {
  host: DBHOST,
  port: DBPORT,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize; // Exportar la conexión para que pueda ser usada en otros archivos
