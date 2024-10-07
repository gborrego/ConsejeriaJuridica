const {Turno,Asesoria, Defensor, Empleado }=require("../utilidades/modelosBase");

//Falta relacion de defensor y asesoria y actualizar controles
/**
 * Modelo de turno
 */

Turno.belongsTo(Asesoria,{foreignKey:'id_asesoria'});
Turno.belongsTo(Defensor,{foreignKey:'id_defensor'});
Defensor.belongsTo(Empleado,{foreignKey:'id_defensor'});



module.exports = {Turno,Asesoria, Defensor,Empleado  };