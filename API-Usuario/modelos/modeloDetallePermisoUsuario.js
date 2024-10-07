const {Detalle_Permiso_Usuario, Permiso}=require("../utilidades/modelosBase");

/**
 * Modelo de Detalle_Permiso_Usuario
 */
Detalle_Permiso_Usuario.belongsTo(Permiso, {foreignKey: 'id_permiso', targetKey: 'id_permiso'});


module.exports = {Detalle_Permiso_Usuario, Permiso};