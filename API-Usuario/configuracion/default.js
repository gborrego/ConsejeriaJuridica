
  // Importamos dotenv
const dotenv = require('dotenv'); 
// Invocamos el metodo config de dotenv
dotenv.config(); 



// Obtenemos el valor de la variable de entorno DBHOST
const DBHOST = process.env.DBHOST ;
// Obtenemos el valor de la variable de entorno DBUSER 
const DBUSER = process.env.DBUSER ; 
// Obtenemos el valor de la variable de entorno DBPASSWORD 
const DBPASSWORD = process.env.DBPASSWORD ; 
// Obtenemos el valor de la variable de entorno DATABASE
const DATABASE = process.env.DATABASE ; 
// Obtenemos el valor de la variable de entorno PORT 
const PORT = process.env.PORT ; 
// Obtenemos el valor de la variable de entorno DBPORT
const DBPORT = process.env.DBPORT ; 
 // Obtenemos el valor de la variable de entorno HOSTTOKEN
const GRPCPORTUSUARIOS = process.env.GRPCPORTUSUARIOS ;
// Obtenemos el valor de la variable de entorno HOSTTOKENGR
const HOSTGRPCASESORIAS = process.env.HOSTGRPCASESORIAS ; 
const DEPLOY = process.env.DEPLOY ;
const DEPLOYA = process.env.DEPLOYA ;
const DEPLOYB = process.env.DEPLOYB ;
const IPS = process.env.IPS;
// Exportamos las variables
module.exports = {
    DBHOST,
    DBUSER,
    DBPASSWORD,
    DATABASE,
    PORT,
    DBPORT,
    GRPCPORTUSUARIOS,HOSTGRPCASESORIAS,
    DEPLOY, DEPLOYA, DEPLOYB, IPS
}
 


