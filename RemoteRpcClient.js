var grpc = require('grpc');
var fs = require("fs");
var protoLoader = require('@grpc/proto-loader');
var {remotePath} = require("./InitPath");
const child_process = require('child_process');


class RemtoeRpcClient {
    constructor(ip, port, serviceName) {
        this.ip = ip;
        this.port = port;
        this.serviceName = serviceName;
        this.path = remotePath + "/" + serviceName + ".proto";
        this.init();
    }

    init() {
        let message = child_process.execFileSync("node", ["./RemoteProto2File.js", this.ip, this.port, this.serviceName, this.path], {});
        console.log(String(message));
    }

    getInstance() {
        if (fs.existsSync(this.path)) {
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
        } else {
            throw new Error("no such proto file: " + this.path + ", Please check if the remote service is turned on. ");
        }

    }
}

module.exports = RemtoeRpcClient;