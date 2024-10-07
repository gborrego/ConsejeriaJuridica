//Constante que representa el modelo de Estados y modelo de Municipios que sirve para la relación 1:M
const { Estado, Municipio } = require('../utilities/models'); 

// 1:M (1 Estado tiene muchos Municipios) 
Estado.hasMany(Municipio, { foreignKey: 'id_estado' }); 

// Exportamos los modelos
module.exports = {
    Estado,
    Municipio,
};

