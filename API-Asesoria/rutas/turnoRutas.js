// Importamos los módulos necesarios
const express = require('express');
const servicioTurnos = require('../servicios/servicioTurnos');

// Creamos un nuevo router
const router = express.Router();


const { existeTurno,validarPeticionPUT } = require('../middlewares/middlewareTurno');

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD" ]


router.route('/defensor/:id')
.get(
  validarPermisos( permisosAceptables),
  servicioTurnos.obtenerTurnoPorDefensorId)

router.route('/busqueda')
  // Obtener todos los turnos
  .get(
    validarPermisos(permisosAceptables),
    servicioTurnos.obtenerTurnos);

router.route('/:id')
  // Obtener un turno por su ID
  .get(
    validarPermisos(["ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD","CONSULTA_PROCESO_JUDICIAL_SD" ]),
    servicioTurnos.obtenerTurnoPorId)
  // Actualizar un turno por su ID
  .put(
    validarPermisos(permisosAceptables),
    existeTurno,
    validarPeticionPUT,
    servicioTurnos.actualizarTurno);

// Exportamos el router
module.exports = router;