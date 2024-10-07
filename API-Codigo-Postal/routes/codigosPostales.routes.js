//Constante que  representa el modulo express
const express = require('express');
//Importar el servicio de codigos postales
const serviceCodigosPostales = require('../services/codigosPostales.services');

//Crear una instancia de express
const router = express.Router();
const validarPermisos = require("../utilities/validadorPermisos");
const permisosAceptables = ["ALL_SA","REGISTRO_ASESORIA_SA",
,"TURNAR_ASESORIA_SA","ALL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD",
"REGISTRO_PROCESO_JUDICIAL_SD"
]
// Ruta para obtener las colonias por codigo postal
router.get('/cp/:cp',
  validarPermisos(permisosAceptables),
serviceCodigosPostales.getColoniasByCodigoPostal);

//Exportar el modulo de rutas
module.exports = router;