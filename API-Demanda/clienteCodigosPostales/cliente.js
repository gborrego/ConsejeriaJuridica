//Constante que representa el modulo protoLoader
const protoLoader = require('@grpc/proto-loader');
//Constante que representa el archivo proto
const PROTO_PATH = 'routeCodigosPostales.proto';

//Constante que representa la definicion del paquete
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
   
});

//Exportar la definicion del paquete
module.exports={
  packageDefinition
}