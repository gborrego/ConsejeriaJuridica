// Importamos el módulo de enrutamiento de Express
const { Router } = require('express')

// Importamos los controladores de las etnias
const {
    obtenerEtnias,
    obtenerEtnia,
    crearEtnia,
    actualizarEtnia,
    obtenerEtniasPaginacion
} = require('../controllers/etnia')

const {
    existeEtnia,
    validarJSONEtniaPOST,
    validarJSONEtniaPUT
}   = require('../middlewares/middlewareEtnia')

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["AD_ETNIA_SD","ALL_SD"]


// Creamos una nueva instancia de Router
const router = Router()

router.route('/paginacion')
    // Obtener todas las etnias
    .get(
        validarPermisos(permisosAceptables),
        obtenerEtniasPaginacion)  


// Definimos la ruta para obtener todas las etnias
router.get('/',
validarPermisos(["ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD"]),
obtenerEtnias)

// Definimos la ruta para obtener una etnia por su id
router.get('/:id',
 validarPermisos(["AD_ETNIA_SD","ALL_SD","REGISTRO_PROCESO_JUDICIAL_SD","SEGUIMIENTO_PROCESO_JUDICIAL_SD"]),
obtenerEtnia)

// Definimos la ruta para crear una nueva etnia
router.post('/',
 validarPermisos(permisosAceptables),
 validarJSONEtniaPOST,
crearEtnia)

// Definimos la ruta para actualizar una etnia por su id
router.put('/:id',
    validarPermisos(permisosAceptables),
 existeEtnia,
    validarJSONEtniaPUT,
actualizarEtnia)


// Exportamos el router
module.exports = router