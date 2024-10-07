const { Sequelize } = require('sequelize');
const dotenv = require('dotenv'); 
// Invocamos el metodo config de dotenv
dotenv.config(); 

// Crear instancia de Sequelize y establecer conexión a la base de datos
const sequelize = new Sequelize(
 process.env.DB_NAME ,
  process.env.DB_USER ,
   process.env.DB_PASSWORD ,
    {
        host: process.env.DB_HOST ,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
);

// Exportar la instancia de Sequelize para su uso en otros archivos
module.exports = sequelize;