const {Asesor}=require("../utilidades/modelosBase");
const {Empleado}=require("./modeloEmpleado");
/**
 * Modelo de asesor
 */
Asesor.hasOne(Empleado,{foreignKey: 'id_empleado'});

module.exports = {Asesor, Empleado}; 