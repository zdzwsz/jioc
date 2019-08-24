var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var fs = require("fs");
var metaProtoPath = "./meta.proto";


function getProto2File(ip, port, serviceName,tempPath) {
    var packageDefinition = protoLoader.loadSync(
        [metaProtoPath],
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
    var jioc = grpc.loadPackageDefinition(packageDefinition).jioc;
    var metaService = new jioc.MetaService(ip + ':' + port, grpc.credentials.createInsecure());
    metaService.getProtoByName({ name: serviceName }, function (err, response) {
        if (err) {
            console.log(err);
        }else{
            try {
                fs.writeFileSync(tempPath, response.message);
                console.log('get reomte(', ip, ":", port, ") name is :", serviceName);
            } catch (e) {
                console.log(e);
            }
        }
    });
}

var arguments = process.argv.splice(2);
getProto2File(arguments[0],arguments[1],arguments[2],arguments[3]);