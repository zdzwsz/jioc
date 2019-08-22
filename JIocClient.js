var PROTO_PATH = __dirname + '/hello.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    [PROTO_PATH,"./meta.proto"],
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var jioc = grpc.loadPackageDefinition(packageDefinition).jioc;

function main() {
  var client = new jioc.hello('localhost:50051', grpc.credentials.createInsecure());

                                      
  client.sayHelloByMe({name:"zdz"}, function(err, response) {
    console.log('Greeting:', response.message);
  });

  client.sayHello({}, function(err, response) {
    console.log('Greeting:', response.message);
  });

  var metaService = new jioc.MetaService('localhost:50051', grpc.credentials.createInsecure());
  metaService.getAllMetaName({},function(err,response){
    console.log('metaName:', response.message);
  });
  metaService.getSerevicesByName({name:"hello"},function(err,response){
    console.log('metaName:', response.message);
  });
  metaService.getProtoByName({name:"hello"},function(err,response){
    console.log('metaName:', response.message);
  });
}

main();