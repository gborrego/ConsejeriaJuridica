//Constantes para la creación del modelo de códigos postales
const { CodigoPostal, Municipio, Colonia } = require('../utilities/models.js');

// Agrega la llave foranea id_municipio a la tabla codigos_postales
CodigoPostal.belongsTo(Municipio, { foreignKey: 'id_municipio' }); 

// Agrega la llave foranea id_codigo_postal a la tabla ciudades
CodigoPostal.hasMany(Colonia, { foreignKey: 'id_codigo_postal' }); 

// Exportamos los modelos
module.exports = {
    CodigoPostal,
    Municipio,
    Colonia
}


