
// Importamos los módulos necesarios
const express = require('express');
const servicioAsesor = require('../servicios/servicioAsesores');

// Creamos un nuevo router
const router = express.Router();


const validarPermisos = require("../utilidades/validadorPermisos");


router.route('/distrito/:id') 
// Obtener todos los asesores
.get(
     validarPermisos(["AD_EMPLEADOS_SA","ALL_SA","REGISTRO_ASESORIA_SA",
          "AD_USUARIOS_SA"
     ]),
     servicioAsesor.obtenerAsesoresByDistrito);

/** Operaciones Básicas */

// Definimos las rutas y sus manejadores de solicitudes
//En esta se tiene que verificar el id del distrito judicial
router.route('/busqueda')
// Obtener todos los asesores
.get(
     validarPermisos(["AD_EMPLEADOS_SA","ALL_SA"
     ]),
     servicioAsesor.obtenerAsesores);

     router.route('/zona/:id')
.get(
     validarPermisos(["AD_EMPLEADOS_SA","ALL_SA","CONSULTA_ASESORIA_SA"]),
     servicioAsesor.obtenerAsesoresZona);

router.route('/:id')
// Obtener un asesor por su ID
.get(
       validarPermisos(["AD_EMPLEADOS_SA","ALL_SA","AD_USUARIOS_SA"]),    
      servicioAsesor.obtenerAsesorPorId)


// Exportamos el router
module.exports = router;


