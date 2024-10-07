const {Asesorado,Motivo,EstadoCivil}=require("../utilidades/modelosBase");

/*
* Modelo de asesorado el cual contiene los atributos de un asesorado y establece las relaciones con los modelos de motivo y estado civil
*/
Asesorado.belongsTo(Motivo,{foreignKey:"id_motivo"});
Asesorado.belongsTo(EstadoCivil,{foreignKey:"id_estado_civil"});

module.exports = {Asesorado,EstadoCivil,Motivo};