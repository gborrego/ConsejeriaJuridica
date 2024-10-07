// Importamos los módulos necesarios
const express = require('express');
const servicioZonas = require('../servicios/servicioZonas');


// Creamos un nuevo router
const router = express.Router();

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["CONSULTA_ASESORIA_SA","ALL_SA"]


router.route('/')
  // Obtener todas las zonas
  .get(
    validarPermisos(permisosAceptables),
    servicioZonas.obtenerZonas)

// Exportamos el router
module.exports = router;