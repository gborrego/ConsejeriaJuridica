// Esta es la constante que representa el modulo express
const express = require('express');
//Importar el servicio de estados
const serviceEstados = require('../services/estados.services.js');


//Crear una instancia de express
const router = express.Router();
const validarPermisos = require("../utilities/validadorPermisos");
const permisosAceptables = ["ALL_SA","CONSULTA_ASESORIA_SA"
]
// Ruta para obtener un estado por su id
router.get('/:id',
validarPermisos(permisosAceptables),
serviceEstados.getEstado);

// Exportar el modulo de rutas
module.exports = router;
 

