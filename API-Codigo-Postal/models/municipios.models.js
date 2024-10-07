//Constantes que representa el municipio y modelos axuliares para la relación 1:M entre municipios y estados y 1:M entre municipios y códigos postales
const {Municipio, Estado, CodigoPostal} = require('../utilities/models.js');

 // Agrega la llave foranea id_estado a la tabla municipios
Municipio.belongsTo(Estado, {foreignKey: 'id_estado'});
// Agrega la llave foranea id_municipio a la tabla codigos_postales
Municipio.hasMany(CodigoPostal, {foreignKey: 'id_municipio'}); 

// Exportamos los modelos
module.exports = {
    Municipio,
    Estado,
    CodigoPostal
}
