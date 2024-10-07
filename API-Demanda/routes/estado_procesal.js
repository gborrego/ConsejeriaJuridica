// Importamos el módulo de enrutamiento de Express
const { Router } = require('express')

// Importamos los controladores de los estados procesales
const {
  obtenerEstadoProcesal,
  crearEstadoProcesal,
  actualizarEstadoProcesal,
  obtenerEstadosProcesalesPorProcesoJudicial
} = require('../controllers/estado_procesal')

const { existeEstadoProcesal, validarJSONEstadoProcesalPOST, validarJSONEstadoProcesalPUT,
  existeProcesoJudicial 
} 
= require('../middlewares/middlewareEstadoProcesal')


const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables1 = ["REGISTRO_PROCESO_JUDICIAL_SD","ALL_SD"]
const permisosAceptables2 = ["SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]

// Creamos una nueva instancia de Router
const router = Router()

router.get('/proceso-judicial',
validarPermisos(permisosAceptables2),
 existeProcesoJudicial,
  obtenerEstadosProcesalesPorProcesoJudicial)

// Definimos la ruta para obtener un estado procesal por su id
router.get('/:id', 
validarPermisos(permisosAceptables2),
 obtenerEstadoProcesal)

// Definimos la ruta para crear un nuevo estado procesal
router.post('/', 
validarPermisos(permisosAceptables1),
 validarJSONEstadoProcesalPOST,
crearEstadoProcesal)

// Definimos la ruta para actualizar un estado procesal por su id
router.put('/:id',
validarPermisos(permisosAceptables2),
existeEstadoProcesal,
  validarJSONEstadoProcesalPUT,
actualizarEstadoProcesal)



// Exportamos el router
module.exports = router