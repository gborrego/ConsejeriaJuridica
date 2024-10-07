
const express = require('express');
const servicioAsesorias = require('../servicios/servicioAsesorias');

const router = express.Router();

 
const { validarPeticionPOST, 
  validarPeticionPUT, validarPeticionPaginacion,
  validarPeticionBuscarNombre, 
  validarFiltros,validarPaginaFiltro,
   validarPeticionDescargarExcel } = require('../middlewares/middlewareAsesoria');


   const validarPermisos = require("../utilidades/validadorPermisos");
   const permisosAceptables = ["CONSULTA_ASESORIA_SA","ALL_SA"]
   



 router.route('/paginacion')  //
.get(
   validarPermisos(permisosAceptables),
  validarPeticionPaginacion,
  servicioAsesorias.obtenerAsesoriasPagina);

//Listp
router.route('/paginacion-filtro') //
.get(
   validarPermisos(permisosAceptables), 
  validarPaginaFiltro,
  validarFiltros, 
  servicioAsesorias.obtenerAsesoriasPaginaFiltro);
 
router.route('/buscar') //
  .get(
    validarPermisos(["ALL_SA","TURNAR_ASESORIA_SA"]),
     validarPeticionBuscarNombre,
    servicioAsesorias.obtenerAsesoriaNombre);
  router.route('/total-asesorias') //
  .get(
    validarPermisos(permisosAceptables),
    servicioAsesorias.obtenerAsesoriaTotal);

  router.route('/total-asesorias-filtro'). //
   //Listo
  get( 
    validarPermisos(permisosAceptables),
    validarFiltros,
    servicioAsesorias.obtenerAsesoriaFiltroTotal);
  
  
    router.route('/filtro') //
    //Listo
  .get(
    validarPermisos(permisosAceptables),
    validarFiltros,
    servicioAsesorias.obtenerAsesoriaFiltro);


   //Si requeirdo
  router.route('/descargar-excel') //
  .get(
    validarPermisos(permisosAceptables),
    validarPeticionDescargarExcel,
    servicioAsesorias.obtenerAsesoriaFiltroExcel);
router.route('/')
//Si requerido
  .post(
    validarPermisos(["ALL_SA","REGISTRO_ASESORIA_SA"]),
     validarPeticionPOST,
    servicioAsesorias.agregarAsesoria); //
router.route('/:id')
//No requerido
  .get(
    validarPermisos(["CONSULTA_ASESORIA_SA","ALL_SA","TURNAR_ASESORIA_SA","CONSULTA_PROCESO_JUDICIAL_SD","ALL_SD"]),
    servicioAsesorias.obtenerAsesoriaPorId)
   // Si requerido
  .put(
    validarPermisos(["ALL_SA","TURNAR_ASESORIA_SA"]),
    validarPeticionPUT,
    servicioAsesorias.actualizarAsesoria) //
;
module.exports = router;
 
