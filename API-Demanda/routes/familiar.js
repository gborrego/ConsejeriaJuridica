
const { Router } = require('express')
// Controlador de familiar que permite realizar la lógica de negocio para la tabla familiar
const {
    obtenerFamiliar,
    crearFamiliar,
    actualizarFamiliar,
    obtenerFamiliaresPorPromovente
    } = require('../controllers/familiar')
 
const { existeFamiliar, validarJSONFamiliarPOST, validarJSONFamiliarPUT,
    existePromovente
 }
= require('../middlewares/middlewareFamiliar')

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables1 = ["REGISTRO_PROCESO_JUDICIAL_SD","ALL_SD"]
const permisosAceptables2 = ["SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]


// Se crea una instancia de Router
const router = Router()

router.get('/promovente', 
validarPermisos(permisosAceptables2),
existePromovente,
obtenerFamiliaresPorPromovente)

// Ruta para obtener un familiar por su id
router.get('/:id',
validarPermisos(permisosAceptables2),
obtenerFamiliar)

// Ruta para crear un familiar
router.post('/', 
validarPermisos(permisosAceptables1),
validarJSONFamiliarPOST,
crearFamiliar)

// Ruta para actualizar un familiar por su id
router.put('/:id', 
validarPermisos(permisosAceptables2),
existeFamiliar,
validarJSONFamiliarPUT,
actualizarFamiliar)



module.exports = router
