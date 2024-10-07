

const { Router } = require('express')

// Controlador de prueba que permite realizar la lógica de negocio para la tabla prueba
const {
    obtenerPrueba,
    crearPrueba,
    actualizarPrueba,
    obtenerPruebasPorProcesoJudicial
    } = require('../controllers/prueba')

 const { existePrueba, validarJSONPruebaPOST, validarJSONPruebaPUT, 
    existeProcesoJudicial
  } 
    = require('../middlewares/middlewarePrueba')


// Se crea una instancia de Router
const router = Router()
const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables1 = ["REGISTRO_PROCESO_JUDICIAL_SD","ALL_SD"]
const permisosAceptables2 = ["SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]

router.get('/proceso-judicial', 
validarPermisos(permisosAceptables2),
existeProcesoJudicial,
obtenerPruebasPorProcesoJudicial)

// Ruta para obtener una prueba por su id
 router.get('/:id', 
  validarPermisos(permisosAceptables2),
 obtenerPrueba)

// Ruta para crear una prueba
router.post('/', 
validarPermisos(permisosAceptables1),
validarJSONPruebaPOST,
crearPrueba)

// Ruta para actualizar una prueba por su id
router.put('/:id',
validarPermisos(permisosAceptables2),
 existePrueba, 
validarJSONPruebaPUT,
actualizarPrueba)




module.exports = router