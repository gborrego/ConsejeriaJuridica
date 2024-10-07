// Importamos los módulos necesarios
const express = require('express');
const servicioEstados = require('../servicios/servicioEstadosCiviles');

const { validarJSONEstadoCivilPOST, validarJSONEstadoCivilPUT, existeEstadoCivil } = require('../middlewares/middlewareEstadoCivil');


const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["AD_ESTADOSCIVILES_SA","ALL_SA"]

// Creamos un nuevo router
const router = express.Router();

 router.route('/paginacion')
    // Obtener todos los estados civiles
    .get(
      validarPermisos(permisosAceptables),
      servicioEstados.obtenerEstadosCivilesPaginacion)


router.route('/')
  // Obtener todos los estados civiles
  .get(
    validarPermisos(["REGISTRO_ASESORIA_SA","ALL_SA"]),
    servicioEstados.obtenerEstadosCiviles)
  // Agregar un nuevo estado civil
  .post(
    validarPermisos(permisosAceptables),
    validarJSONEstadoCivilPOST,
    servicioEstados.agregarEstadoCivil);

router.route('/:id')
  // Obtener un estado civil por su ID
  .get(
    validarPermisos(permisosAceptables),
    servicioEstados.obtenerEstadoCivilPorId)

  // Actualizar un estado civil por su ID
  .put(
    validarPermisos(permisosAceptables),
    existeEstadoCivil, validarJSONEstadoCivilPUT,
    servicioEstados.actualizarEstadoCivil);

// Exportamos el router
module.exports = router;