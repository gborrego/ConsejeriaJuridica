const {Defensor}=require("../utilidades/modelosBase");
const {Empleado}=require("./modeloEmpleado");
//Falta relacion de defensor y asesoria y actualizar controles
/**
 * Modelo de Defensor
 * 
 */

Defensor.hasOne(Empleado,{foreignKey: 'id_empleado'});

module.exports = {Defensor,Empleado}; 