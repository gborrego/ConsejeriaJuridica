// Importamos el módulo de enrutamiento de Express
const { Router } = require('express')

// Importamos los controladores de los juzgados
const {
  obtenerJuzgados,
  obtenerJuzgado,
  crearJuzgado,
  actualizarJuzgado,
  obtenerJuzgadosPaginacion
} = require('../controllers/juzgado')

 
const { existeJuzgado, validarJSONJuzgadoPOST, validarJSONJuzgadoPUT }
  = require('../middlewares/middlewareJuzgado')
  const validarPermisos = require("../utilidades/validadorPermisos");
  const permisosAceptables = ["AD_JUZGADO_SD","ALL_SD"]
  

// Creamos una nueva instancia de Router
const router = Router()


router.route('/paginacion')
  // Obtener todos los juzgados
  .get(
    validarPermisos(permisosAceptables),
    obtenerJuzgadosPaginacion)


// Definimos la ruta para obtener todos los juzgados
router.get('/',
validarPermisos(["AD_JUZGADO_SD","ALL_SD" , "REGISTRO_PROCESO_JUDICIAL_SD"]),
obtenerJuzgados)

// Definimos la ruta para obtener un juzgado por su id
router.get('/:id', 
  validarPermisos(["AD_JUZGADO_SD","ALL_SD" , "REGISTRO_PROCESO_JUDICIAL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD"]),
 obtenerJuzgado)

// Definimos la ruta para crear un nuevo juzgado
router.post('/', 
validarPermisos(permisosAceptables),
validarJSONJuzgadoPOST,
crearJuzgado)

// Definimos la ruta para actualizar un juzgado por su id
router.put('/:id',
    validarPermisos(permisosAceptables),
  existeJuzgado,
  validarJSONJuzgadoPUT,
actualizarJuzgado)


// Exportamos el router
module.exports = router