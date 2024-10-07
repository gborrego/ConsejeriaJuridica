// Importamos el módulo de enrutamiento de Express
const { Router } = require('express')

// Importamos los controladores de los procesos judiciales
const {
  crearProcesoJudicial,
  obtenerProcesosJudiciales,
  obtenerProcesoJudicial,
  actualizarProcesoJudicial,
  obtenerProcesosJudicialesBusqueda,
  obtenerProcesosJudicialesPorTramite
  ,
} = require('../controllers/proceso_judicial')

const { 
  existeProcesoJudicial,
  validarJSONProcesoJudicialPOST,
  validarJSONProcesoJudicialPUT
 } 
 = require('../middlewares/middlewareProcesoJudicial')
 

const validarPermisos = require("../utilidades/validadorPermisos");



// Creamos una nueva instancia de Router
const router = Router()

/*
router.get('/tramite/',  
validarPermisos(["SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]),
obtenerProcesosJudicialesPorTramite
)
*/

// Definimos la ruta para crear un nuevo proceso judicial
router.post('/',  
validarPermisos(["REGISTRO_PROCESO_JUDICIAL_SD","ALL_SD"]),
validarJSONProcesoJudicialPOST,
 crearProcesoJudicial)
/*
// Definimos la ruta para obtener todos los procesos judiciales
router.get('/', 
  validarPermisos(["CONSULTA_PROCESO_JUDICIAL_SD","ALL_SD"]), 
obtenerProcesosJudiciales)
*/

// Definimos la ruta para obtener todos los procesos judiciales
router.get('/busqueda',
  validarPermisos(["CONSULTA_PROCESO_JUDICIAL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]),
obtenerProcesosJudicialesBusqueda)


// Definimos la ruta para obtener un proceso judicial por su id
router.get('/:id',
 validarPermisos(["CONSULTA_PROCESO_JUDICIAL_SD","ALL_SD"]),
 obtenerProcesoJudicial)


// Definimos la ruta para actualizar un proceso judicial por su id
router.put('/:id', 
validarPermisos(["SEGUIMIENTO_PROCESO_JUDICIAL_SD","ALL_SD"]),
existeProcesoJudicial,
validarJSONProcesoJudicialPUT,
 actualizarProcesoJudicial)



// Exportamos el router
module.exports = router