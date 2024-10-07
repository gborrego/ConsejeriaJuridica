const {TipoUser,Usuario,Detalle_Permiso_Usuario}=require("../utilidades/modelosBase");
/**
 * Modelo de la tabla usuario el cual extiende de la clase Model de sequelize
 * y se relaciona con los modelos de tipo de usuario y zona
 * */
Usuario.belongsTo(TipoUser,{foreignKey:"id_tipouser"});

Usuario.hasMany(Detalle_Permiso_Usuario,{foreignKey:"id_usuario"});


module.exports = {TipoUser,Usuario};