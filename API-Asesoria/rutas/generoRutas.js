// Importamos los módulos necesarios
const express = require('express');
const servicioGeneros = require('../servicios/servicioGenero');

//Importamos el middleware
const {
  existeGenero,
  validarJSONGeneroPOST,
  validarJSONGeneroPUT
} = require('../middlewares/middlewareGenero');

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["AD_GENEROS_SA","ALL_SA"]

// Creamos un nuevo router
const router = express.Router();
 
router.route('/paginacion')
  // Obtener todos los géneros
  .get(
    validarPermisos(permisosAceptables),
    servicioGeneros.obtenerGenerosPaginacion)

router.route('/')
  // Obtener todos los géneros
  .get(
    validarPermisos(["ALL_SA","ALL_SD","REGISTRO_ASESORIA_SA", "TURNAR_ASESORIA_SA",
      "REGISTRO_PROCESO_JUDICIAL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD"]),
    servicioGeneros.obtenerGeneros)
  // Agregar un nuevo género
  .post(
    validarPermisos(permisosAceptables),
    validarJSONGeneroPOST,
    servicioGeneros.agregarGenero);

router.route('/:id')
  // Obtener un género por su ID 
  .get(
    validarPermisos(["AD_GENEROS_SA","ALL_SA","ALL_SD", "SEGUIMIENTO_PROCESO_JUDICIAL_SD","TURNAR_ASESORIA_SA"]),
    servicioGeneros.obtenerGeneroPorId)
 
  // Actualizar un género por su ID
  .put(
    validarPermisos(permisosAceptables),
    existeGenero,
    validarJSONGeneroPUT,
    servicioGeneros.actualizarGenero);


// Exportamos el router
module.exports = router;