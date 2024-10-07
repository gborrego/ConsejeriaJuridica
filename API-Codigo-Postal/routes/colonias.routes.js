//Constante que representa el modulo express
const   express = require('express');
//Importar el servicio de colonias
const   servicesColonias = require('../services/colonias.services');
const validarPermisos = require("../utilities/validadorPermisos");
const permisosAceptables = ["ALL_SA","CONSULTA_ASESORIA_SA",
,"TURNAR_ASESORIA_SA","ALL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD",
"REGISTRO_PROCESO_JUDICIAL_SD"
]
//Crear una instancia de express
const router = express.Router();

// Ruta para obtener una colonia por su id
router.get ('/:id', 
validarPermisos(permisosAceptables),
servicesColonias.getColonia);

//Exportar el modulo de rutas
module.exports = router;