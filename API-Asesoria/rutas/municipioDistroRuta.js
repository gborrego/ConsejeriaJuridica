// Importamos los módulos necesarios
const express = require('express');
const servicioMunicipiosDistro = require('../servicios/servicioMunicipioDistro');

// Creamos un nuevo router
const router = express.Router();

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["ALL_SA","CONSULTA_ASESORIA_SA","REGISTRO_ASESORIA_SA","ALL_SD"
    ,"SEGUIMIENTO_PROCESO_JUDICIAL_SD","REGISTRO_PROCESO_JUDICIAL_SD"
]


router.route('/')
    // Obtener todos los municipios
    .get(
        validarPermisos(permisosAceptables),
        servicioMunicipiosDistro.obtenerMunicipios)
    // Obtener todos los municipios por distrito
    router.route('/distrito/:id')
    .get(
        validarPermisos(permisosAceptables),
        servicioMunicipiosDistro.obtenerMunicipiosDistrito)



// Exportamos el router
module.exports = router;