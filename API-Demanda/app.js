// Importamos el módulo 'dotenv' y llamamos a su método 'config' para cargar las variables de entorno del archivo .env
require('dotenv').config()

// Importamos la clase Server desde el archivo server.js en la carpeta models
const Server = require('./server')

// Creamos una nueva instancia de la clase Server
const server = new Server()

// Llamamos al método 'listen' de la instancia de Server para iniciar el servidor
server.listen()