// Importamos los módulos necesarios
const express = require('express');
const servicioDistritosJudiciales = require('../servicios/servicioDistritoJudicial');

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["ALL_SA","CONSULTA_ASESORIA_SA","REGISTRO_ASESORIA_SA","ALL_SD"
    ,"SEGUIMIENTO_PROCESO_JUDICIAL_SD","REGISTRO_PROCESO_JUDICIAL_SD", "AD_EMPLEADOS_SA" ,"AD_USUARIOS_SA"
]



// Creamos un nuevo router
const router = express.Router();


router.route('/')
    // Obtener todos los distritos judiciales
    .get(
        validarPermisos(permisosAceptables),
        servicioDistritosJudiciales.obtenerDistritosJudiciales)

// Exportamos el router
module.exports = router;