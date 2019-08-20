var PROTO_PATH = __dirname + '/hello.proto';
let JIoc = require("./JIoc");
let json = require("./test/ioc.json");
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var ServiceAgent = require('./ServiceAgent');

let ioc = new JIoc(json);
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var jioc = grpc.loadPackageDefinition(packageDefinition).jioc;

function createService(service,server){
    let methods = {};
    let serviceConfig = json[service];
    let serviceObject = ioc.get(serviceConfig.object);
    for(let i = 0;i<serviceConfig.methods.length;i++){
        let methodName = serviceConfig.methods[i].name;
        let serviceAgent = new ServiceAgent(serviceObject,serviceObject[methodName],serviceConfig.methods[i].parameters);
        methods[methodName] = serviceAgent.doService.bind(serviceAgent);
    }
    server.addService(jioc[service].service, methods);
}

function main() {
  var server = new grpc.Server();
  createService("hello",server);
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();