
const { Router } = require('express')

// Controlador de observacion que permite realizar la lógica de negocio para la tabla observacion
const {
    obtenerObservacion,
    crearObservacion,
    actualizarObservacion,
    obtenerObservacionesPorProcesoJudicial
    } = require('../controllers/observacion')

const { existeObservacion, validarJSONObservacionPOST, validarJSONObservacionPUT 
 , existeProcesoJudicial

} 
= require('../middlewares/middlewareObservacion')

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables1 = ["REGISTRO_PROCESO_JUDICIAL_SD","ALL_SD"]
const permisosAceptables2 = ["SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]

// Se crea una instancia de Router
const router = Router()
// Ruta para obtener todas las observaciones de un proceso judicial por su id
router.get('/proceso-judicial', 
validarPermisos(permisosAceptables2),
 existeProcesoJudicial,
obtenerObservacionesPorProcesoJudicial)


// Ruta para obtener una observacion por su id
router.get('/:id',
validarPermisos(permisosAceptables2),
obtenerObservacion)

// Ruta para crear una observacion
router.post('/', 
validarPermisos(permisosAceptables1),
validarJSONObservacionPOST,
crearObservacion)

// Ruta para actualizar una observacion por su id
router.put('/:id', 
validarPermisos(permisosAceptables2),
existeObservacion,
validarJSONObservacionPUT,
actualizarObservacion)


module.exports = router

