
// Importamos el módulo express y el servicio de usuarios
const express = require('express');
const servicioUsuarios = require('../servicios/servicioUsuarios');

// Creamos un nuevo router
const router = express.Router();

const { existeUsuario, validarJSONUsuarioPOST , validarJSONUsuarioPUT } = require('../middleware/middlewareUsuario');

const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["ALL_SA","AD_USUARIOS_SA",
"AD_EMPLEADOS_SA",
"AD_JUICIOS_SA",
"AD_GENEROS_SA",
"AD_ESTADOSCIVILES_SA",
"AD_MOTIVOS_SA",
"AD_CATALOGOREQUISITOS_SA",
"CONSULTA_ASESORIA_SA",
"REGISTRO_ASESORIA_SA",
"TURNAR_ASESORIA_SA",
"ALL_SD",
"AD_ESCOLARIDAD_SD",
"AD_ETNIA_SD",
"AD_JUZGADO_SD",
"AD_OCUPACION_SD",
"CONSULTA_PROCESO_JUDICIAL_SD",
"SEGUIMIENTO_PROCESO_JUDICIAL_SD",
"REGISTRO_PROCESO_JUDICIAL_SD"]

// Definimos la ruta '/usuario' que responde a una petición GET
// Esta ruta utiliza el método obtenerUsuarioCorreoPassword del servicio de usuarios
router.route('/usuario')
  .get(
    servicioUsuarios.obtenerUsuarioCorreoPassword);

 

    

// Definimos la ruta '/recuperacion' que responde a una petición GET
// Esta ruta utiliza el método recuperarContraseña del servicio de usuarios
router.route('/recuperacion')
  .get(
    servicioUsuarios.recuperarContraseña);

    router.route('/busqueda')
    .get(
      validarPermisos(["ALL_SA","AD_USUARIOS_SA"]),
      servicioUsuarios.obtenerUsuariosBusqueda);
// Definimos la ruta '/' que responde a una petición GET y POST
// La petición GET utiliza el método obtenerUsuarioPorId del servicio de usuarios
// La petición POST utiliza el método agregarUsuario del servicio de usuarios
router.route('/')
  .get(
    validarPermisos(["ALL_SA","AD_USUARIOS_SA"]),
    servicioUsuarios.obtenerUsuarios)
  .post(
    validarPermisos(["ALL_SA","AD_USUARIOS_SA"]),
    validarJSONUsuarioPOST,
    servicioUsuarios.agregarUsuario);

// Definimos la ruta '/:id' que responde a una petición GET, DELETE y PUT
// La petición GET utiliza el método obtenerUsuarioPorId del servicio de usuarios
// La petición DELETE utiliza el método eliminarUsuario del servicio de usuarios
// La petición PUT utiliza el método actualizarUsuario del servicio de usuarios
router.route('/:id')
  .get(
    validarPermisos(["ALL_SA","AD_USUARIOS_SA"]),
    servicioUsuarios.obtenerUsuarioPorId)
  .put(
    validarPermisos(["ALL_SA","AD_USUARIOS_SA"]),
    existeUsuario,
    validarJSONUsuarioPUT,
    servicioUsuarios.actualizarUsuario);


// Exportamos el router
module.exports = router;