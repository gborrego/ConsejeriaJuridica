//Constantes para la creación de modelos de ciudades y colonias
const {Ciudad, Colonia} = require('../utilities/models');

// Relación uno a muchos entre Ciudad y Colonia
Ciudad.hasMany(Colonia, {foreignKey: 'id_ciudad'}); 

//Exportamos los modelos
module.exports = {
    Ciudad,
    Colonia,
};


