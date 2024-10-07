const {Asesoria,Empleado,Asesorado,Turno,
   DetalleAsesoriaCatalogo,TipoJuicio,DistritoJudicial
   , Persona
    }=require("../utilidades/modelosBase");


//Empleado.belongsTo(DistritoJudicial, { foreignKey: "id_distrito_judicial" });

Asesoria.belongsTo(Empleado, { foreignKey: "id_empleado" })
Asesorado.hasOne(Persona, { foreignKey: "id_persona" })



Asesoria.belongsTo(Asesorado, { foreignKey: "id_asesorado"})
Asesoria.hasMany(DetalleAsesoriaCatalogo,{foreignKey:"id_asesoria"});
Asesoria.belongsTo(TipoJuicio, { foreignKey: "id_tipo_juicio" })
Asesoria.hasOne(DistritoJudicial, { foreignKey: "id_distrito_judicial" })
Asesoria.hasOne(Turno, { foreignKey: "id_asesoria" });



//Turno.belongsTo(Asesoria, { foreignKey: "id_asesoria" });

module.exports = {Asesoria

  ,Asesorado,Empleado,Turno,
  DetalleAsesoriaCatalogo,TipoJuicio,
  DistritoJudicial,
  Persona
};