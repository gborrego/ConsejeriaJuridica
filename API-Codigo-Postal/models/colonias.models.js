//Constantes para la creación de modelo de colonias, con el apoyo de los modelos de ciudades y códigos postales
const {Ciudad, Colonia, CodigoPostal} = require('../utilities/models');

 // Relación uno a muchos entre Ciudad y Colonia
Colonia.belongsTo(Ciudad, {foreignKey: 'id_ciudad'});

 // Define la llave foranea id_codigo_postal en la tabla colonias, con la relación uno a muchos
Colonia.belongsTo(CodigoPostal, {foreignKey: 'id_codigo_postal'});

// Define la llave foranea id_ciudad en la tabla colonias, con la relación uno a muchos
Colonia.hasMany(CodigoPostal, {foreignKey: 'id_codigo_postal'}, ); 



// Exportación de los modelos
module.exports = {
    Colonia,
    Ciudad,
    CodigoPostal,
};

