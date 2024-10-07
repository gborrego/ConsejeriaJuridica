const {Empleado,DistritoJudicial, Zona,MunicipioDistro

}=require("../utilidades/modelosBase");
/**
 * Modelo de Empleado
 */
DistritoJudicial.belongsTo(Zona, { foreignKey: "id_zona" })
DistritoJudicial.belongsTo(MunicipioDistro, { foreignKey: "id_municipio_distrito" })

Empleado.belongsTo(DistritoJudicial, { foreignKey: 'id_distrito_judicial' });




module.exports = {Empleado,DistritoJudicial ,Zona,MunicipioDistro}; 