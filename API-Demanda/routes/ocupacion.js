// Importamos el módulo de enrutamiento de Express
const { Router } = require('express')

// Importamos los controladores de las ocupaciones
const {
  obtenerOcupaciones,
  crearOcupacion,
  obtenerOcupacion,
  actualizarOcupacion,
   obtenerOcupacionesPaginacion
} = require('../controllers/ocupacion')


const { existeOcupacion, validarJSONOcupacionPOST, validarJSONOcupacionPUT } 
= require('../middlewares/middlewareOcupacion')

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["AD_OCUPACION_SD","ALL_SD"]


// Creamos una nueva instancia de Router
const router = Router()

router.route('/paginacion')
  // Obtener todas las ocupaciones
  .get(
    validarPermisos(permisosAceptables),
    obtenerOcupacionesPaginacion)
 
// Definimos la ruta para obtener todas las ocupaciones
router.get('/',
validarPermisos(["AD_OCUPACION_SD","ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD"]),
obtenerOcupaciones)

// Definimos la ruta para obtener una ocupación por su id
router.get('/:id',
  validarPermisos(["AD_OCUPACION_SD","ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD"]),
obtenerOcupacion)

// Definimos la ruta para crear una nueva ocupación
router.post('/',  
validarPermisos(permisosAceptables),
validarJSONOcupacionPOST,
 crearOcupacion)

// Definimos la ruta para actualizar una ocupación por su id
router.put('/:id',
    validarPermisos(permisosAceptables),
  existeOcupacion,
  validarJSONOcupacionPUT,
actualizarOcupacion)


// Exportamos el router
module.exports = router