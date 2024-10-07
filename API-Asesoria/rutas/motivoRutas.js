// Importamos los módulos necesarios
const express = require('express');
const servicioMotivos = require('../servicios/servicioMotivos');

const { validarJSONMotivoPOST, validarJSONMotivoPUT, existeMotivo } = require('../middlewares/middlewareMotivo');


const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["AD_MOTIVOS_SA","ALL_SA"]


// Creamos un nuevo router
const router = express.Router();


router.route('/paginacion')
  // Obtener todos los motivos
  .get(
    validarPermisos(permisosAceptables),
    servicioMotivos.obtenerMotivosPaginacion) 

router.route('/')
  // Obtener todos los motivos
  .get(
    validarPermisos(["ALL_SA","REGISTRO_ASESORIA_SA"]),
    servicioMotivos.obtenerMotivos)
  // Agregar un nuevo motivo
  .post(
     validarPermisos(permisosAceptables),
     validarJSONMotivoPOST,     
    servicioMotivos.agregarMotivo);

router.route('/:id')
  // Obtener un motivo por su ID
  .get(
      validarPermisos(permisosAceptables),
    servicioMotivos.obtenerMotivoPorId)

  // Actualizar un motivo por su ID
  .put(
    validarPermisos(permisosAceptables),
    existeMotivo, validarJSONMotivoPUT,
    servicioMotivos.actualizarMotivo);

// Exportamos el router
module.exports = router;