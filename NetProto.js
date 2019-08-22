var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var tempPath = "./temp"
const child_process = require('child_process');

class NetProto {
    constructor(ip, port, serviceName) {
        this.ip = ip;
        this.port = port;
        this.serviceName = serviceName;
        this.path = tempPath+"/"+serviceName+".proto";
        this.init();
    }

    init() {
       let message = child_process.execFileSync("node",["./RemoteProto2File.js",this.ip, this.port, this.serviceName, tempPath],{});
       console.log(String(message));
    }

    getInstance() {
        var packageDefinition = protoLoader.loadSync(
            [this.path],
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
        var jioc = grpc.loadPackageDefinition(packageDefinition).jioc;
        return new jioc[this.serviceName](this.ip + ':' + this.port, grpc.credentials.createInsecure());
    }


}

module.exports = NetProto;