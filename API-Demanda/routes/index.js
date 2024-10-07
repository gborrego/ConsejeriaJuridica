// Importamos los routers de cada entidad
const routerEscolaridad = require('./escolaridad')
const routerEstadoProcesal = require('./estado_procesal')
const routerEtnia = require('./etnia')
const routerJuzgado = require('./juzgado')
const routerOcupacion = require('./ocupacion')
const routerProcesoJudicial = require('./proceso_judicial')
const routerPrueba = require('./prueba')  
const routerObservacion = require('./observacion')
const rouiterResolucion = require('./resolucion')
const routerFamiliar = require('./familiar')

// Exportamos los routers para que puedan ser utilizados en otras partes de la aplicación
module.exports = {
  routerEscolaridad,
  routerEstadoProcesal,
  routerEtnia,
  routerJuzgado,
  routerOcupacion,
  routerProcesoJudicial,
  routerPrueba,
  routerObservacion,
  rouiterResolucion,
  routerFamiliar
}