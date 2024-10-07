const PROTO_PATH = 'routeCodigosPostales.proto';
const protoLoader = require('@grpc/proto-loader');
//  PackageDefinition encapsula la definición de paquete de un servicio gRPC.
const packageDefinition2 = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

    //Module exports
module.exports={
    packageDefinition2
}
