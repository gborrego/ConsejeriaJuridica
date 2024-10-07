const {DistritoJudicial,MunicipioDistro,Zona}=require("../utilidades/modelosBase");
/**
 * Modelo de DistritoJudicial
 */
DistritoJudicial.belongsTo(MunicipioDistro,{foreignKey:"id_distrito_judicial"});
DistritoJudicial.hasMany(MunicipioDistro,{foreignKey:"id_distrito_judicial"});
DistritoJudicial.hasOne(Zona,{foreignKey:"id_zona"});

module.exports = {DistritoJudicial,MunicipioDistro,Zona }; 