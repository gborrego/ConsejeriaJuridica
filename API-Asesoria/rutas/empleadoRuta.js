// Importamos los módulos necesarios
const express = require('express');
const servicioEmpleado = require('../servicios/servicioEmpleado');

// Creamos un nuevo router
const router = express.Router();

const { validarJSONEmpleadoPOST,
    validarJSONEmpleadoPUT,
    existeDistritoJudicial,
    existeEmpleado
 } = require('../middlewares/middlewareEmpleado');



 const validarPermisos = require("../utilidades/validadorPermisos");
 const permisosAceptables = ["AD_EMPLEADOS_SA","ALL_SA"]
 


 router.route('/busqueda')
  .get(
    validarPermisos(permisosAceptables),
      servicioEmpleado.obtenerEmpleadosBusqueda
      );



router.route('/')
     /* .get(servicioEmpleado.obtenerEmpleados) */


    // Agregar un nuevo empleado
    .post(
        validarPermisos(permisosAceptables),
          existeDistritoJudicial,
          validarJSONEmpleadoPOST,
        servicioEmpleado.agregarEmpleado);

router.route('/:id')
 /*    .get(existeEmpleado, 
        servicioEmpleado.obtenerEmpleadoPorId) */
    // Actualizar un empleado por su ID
    .put(
        validarPermisos(permisosAceptables),
        existeEmpleado,
        existeDistritoJudicial,
        validarJSONEmpleadoPUT,
        servicioEmpleado.actualizarEmpleado);  


// Exportamos el router
module.exports = router;