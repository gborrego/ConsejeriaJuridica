

const { Router } = require('express')

// Controlador de resolucion que permite realizar la lógica de negocio para la tabla resolucion
const {

    obtenerResolucion,
    crearResolucion,
    actualizarResolucion,
     obtenerResolucionesPorProcesoJudicial
    } = require('../controllers/resolucion')

    const { existeResolucion, validarJSONResolucionPOST, validarJSONResolucionPUT,
        existeProcesoJudicial
     }
    = require('../middlewares/middlewareResolucion')
    const validarPermisos = require("../utilidades/validadorPermisos");
    const permisosAceptables1 = ["REGISTRO_PROCESO_JUDICIAL_SD","ALL_SD"]
    const permisosAceptables2 = ["SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]
    // Se crea una instancia de Router
    const router = Router()

// Ruta para obtener todas las resoluciones
router.get('/proceso-judicial',
validarPermisos(permisosAceptables2),
 existeProcesoJudicial,
obtenerResolucionesPorProcesoJudicial)

// Ruta para obtener una resolucion por su id
router.get('/:id',
validarPermisos(permisosAceptables2),
obtenerResolucion)

// Ruta para crear una resolucion
router.post('/', 
validarPermisos(permisosAceptables1),
validarJSONResolucionPOST,
crearResolucion)

// Ruta para actualizar una resolucion por su id
router.put('/:id',
validarPermisos(permisosAceptables2),
existeResolucion,
validarJSONResolucionPUT,
actualizarResolucion)


module.exports = router
