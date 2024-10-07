// Importamos los módulos necesarios
const express = require('express');
const servicioDefensor= require('../servicios/servicioDefensor');

// Creamos un nuevo router
const router = express.Router();


const validarPermisos = require("../utilidades/validadorPermisos");

router.route('/distrito') 
// Obtener todos los asesores
.get(
     validarPermisos(["AD_EMPLEADOS_SA","ALL_SA","REGISTRO_ASESORIA_SA",
          "AD_USUARIOS_SA" ,"CONSULTA_PROCESO_JUDICIAL_SD","REGISTRO_PROCESO_JUDICIAL_SD","TURNAR_ASESORIA_SA"
          ,"ALL_SD", "SEGUIMIENTO_PROCESO_JUDICIAL_SD"
     ]),
     servicioDefensor.obtenerDefensoresByDistrito);


router.route('/busqueda')
    // Obtener todos los defensores
    .get(
        validarPermisos(["AD_EMPLEADOS_SA","ALL_SA"]),
         servicioDefensor.obtenerDefensores)

  

    router.route('/zona/:id').get(
        validarPermisos(["AD_EMPLEADOS_SA","ALL_SA","CONSULTA_ASESORIA_SA"]),
        servicioDefensor.obtenerDefensoresZona);

router.route('/:id')
    // Obtener un defensor por su ID
    .get(
        validarPermisos( ["AD_EMPLEADOS_SA","ALL_SA","AD_USUARIOS_SA"]),
        servicioDefensor.obtenerDefensorPorId)
 


// Exportamos el router
module.exports = router;