// Importamos los módulos necesarios
const express = require('express');
const servicioTiposDeJuicio = require('../servicios/servicioTiposJuicios');

const { validarJSONTipoJuicioPOST, validarJSONTipoJuicioPUT, existeTipoJuicio } = require('../middlewares/middlewareTipoJuicio');

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["AD_JUICIOS_SA", "ALL_SA"]

// Creamos un nuevo router
const router = express.Router();

router.route('/paginacion')
  // Obtener todos los tipos de juicio
  .get(
    validarPermisos(permisosAceptables),
    servicioTiposDeJuicio.obtenerTiposDeJuicioPaginacion)



router.route('/')
  // Obtener todos los tipos de juicio
  .get(
    validarPermisos([ "ALL_SA","REGISTRO_ASESORIA_SA", "ALL_SD", "REGISTRO_PROCESO_JUDICIAL_SD", "SEGUIMIENTO_PROCESO_JUDICIAL_SD"]),
    servicioTiposDeJuicio.obtenerTiposDeJuicio)
  // Agregar un nuevo tipo de juicio
  .post(
    validarPermisos(permisosAceptables),
    validarJSONTipoJuicioPOST,
    servicioTiposDeJuicio.agregarTipoDeJuicio);

router.route('/:id')
  // Obtener un tipo de juicio por su ID
  .get(
    validarPermisos(["AD_JUICIOS_SA", "ALL_SA", "ALL_SD", "SEGUIMIENTO_PROCESO_JUDICIAL_SD"]),
    servicioTiposDeJuicio.obtenerTipoDeJuicioPorId)
  // Actualizar un tipo de juicio por su ID
  .put(
    validarPermisos(permisosAceptables),
    existeTipoJuicio, validarJSONTipoJuicioPUT,
    servicioTiposDeJuicio.actualizarTipoDeJuicio);

// Exportamos el router
module.exports = router;
