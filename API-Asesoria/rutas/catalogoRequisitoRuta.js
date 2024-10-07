// Importamos los módulos necesarios
const express = require('express');
const servicioCatalogoRequisitos = require('../servicios/servicioCatalogoRequisitos');

const { validarJSONCatalogoRequisitosPOST, validarJSONCatalogoRequisitosPUT, existeCatalogoRequisitos } = require('../middlewares/middlewareCatalogoRequisitos');



const validarPermisos = require("../utilidades/validadorPermisos");
const permisosAceptables = ["AD_CATALOGOREQUISITOS_SA","ALL_SA"]


// Creamos un nuevo router
const router = express.Router();

/** Operaciones Básicas */
router.route('/paginacion')
  // Obtener todos los requisitos del catálogo
  .get(
    validarPermisos(permisosAceptables),
    servicioCatalogoRequisitos.obtenerCatalogoRequisitosPaginacion)


router.route('/')
  // Obtener todos los requisitos del catálogo
  .get(
    validarPermisos(["ALL_SA","REGISTRO_ASESORIA_SA"]),
    servicioCatalogoRequisitos.obtenerCatalogoRequisitos)
  // Agregar un nuevo requisito al catálogo
  .post(
    validarPermisos(permisosAceptables),
    validarJSONCatalogoRequisitosPOST,
    servicioCatalogoRequisitos.agregarCatalogoRequisito);

router.route('/:id')
  // Obtener un requisito del catálogo por su ID
  .get(
    validarPermisos(permisosAceptables),
    servicioCatalogoRequisitos.obtenerCatalogoRequisitoPorId)
  // Actualizar un requisito del catálogo por su ID
  .put(
    validarPermisos(permisosAceptables),
    existeCatalogoRequisitos,
    validarJSONCatalogoRequisitosPUT,
    servicioCatalogoRequisitos.actualizarCatalogoRequisito);


// Exportamos el router
module.exports = router;
