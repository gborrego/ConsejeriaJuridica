// Importamos el módulo de enrutamiento de Express
const { Router } = require('express')

// Importamos los controladores de las escolaridades
const {
  obtenerEscolaridades,
  obtenerEscolaridad,
  crearEscolaridad,
  actualizarEscolaridad,
  obtenerEscolaridadesPaginacion
} = require('../controllers/escolaridad')

const { existeEscolaridad, validarJSONEscolaridadPOST, validarJSONEscolaridadPUT }
 = require('../middlewares/middlewareEscolaridad')

 const validarPermisos = require("../utilidades/validadorPermisos");
 const permisosAceptables = ["AD_ESCOLARIDAD_SD","ALL_SD"]
 
 

// Creamos una nueva instancia de Router
const router = Router()
 
 
router.route('/paginacion')
  // Obtener todas las escolaridades
  .get(
    validarPermisos(permisosAceptables),
    obtenerEscolaridadesPaginacion)

// Definimos la ruta para obtener todas las escolaridades
router.get('/',
validarPermisos(["ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD"]),
obtenerEscolaridades)

// Definimos la ruta para obtener una escolaridad por su id
router.get('/:id', 
  validarPermisos(["AD_ESCOLARIDAD_SD","ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD"]),
 obtenerEscolaridad)

// Definimos la ruta para crear una nueva escolaridad
router.post('/', 
validarPermisos(permisosAceptables),
 validarJSONEscolaridadPOST,
crearEscolaridad)

// Definimos la ruta para actualizar una escolaridad por su id
router.put('/:id',
    validarPermisos(permisosAceptables),
  existeEscolaridad,
  validarJSONEscolaridadPUT,
actualizarEscolaridad)



// Exportamos el router
module.exports = router