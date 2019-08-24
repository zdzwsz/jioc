let JIoc = require("./JIoc");
let json = require("./test/ioc.json");
var grpc = require('grpc');
var ServiceAgent = require('./ServiceAgent');
var Json2Proto = require('./Json2Proto');
var MetaService = require("./MetaService");

var {path} = require("./InitPath");

class JIocServer {

    constructor(json, ip, port) {
        this.json = json;
        this.ioc = new JIoc(json);
        let packageDefinition = Json2Proto(json, path);
        this.jioc = grpc.loadPackageDefinition(packageDefinition).jioc;
        this.server = null;
        if (typeof (ip) == "undefined") {
            ip = "0.0.0.0";
        }
        this.ip = ip;
        if (typeof (port) == "undefined") {
            port = 50051
        }
        this.port = port;
    }


    start() {
        this.server = new grpc.Server();
        this.createServiceByJson();
        this.createMetaService();
        this.server.bind(this.ip + ':' + this.port, grpc.ServerCredentials.createInsecure());
        this.server.start();
    }

    createServiceByJson() {
        for (let service in this.json) {
            if (this.json[service].type == "rpc") {
                this.createService(service);
            }
        }
    }

    createService(service) {
        let methods = {};
        let serviceConfig = this.json[service];
        let serviceObject = this.ioc.get(serviceConfig.object);
        for (let i = 0; i < serviceConfig.methods.length; i++) {
            let methodName = serviceConfig.methods[i].name;
            let serviceAgent = new ServiceAgent(serviceObject, serviceObject[methodName], serviceConfig.methods[i].parameters);
            methods[methodName] = serviceAgent.doService.bind(serviceAgent);
        }
        this.server.addService(this.jioc[service].service, methods);
    }

    createMetaService() {
        let metaService = new MetaService(this.json, path);
        this.server.addService(this.jioc["MetaService"].service, {
            getAllMetaName:function(call, callback){
                let result = metaService.getAllMetaName();
                callback(null, { message: result});
            },
            getSerevicesByName:function(call, callback){
                let result = metaService.getSerevicesByName(call.request["name"]);
                callback(null, { message: result});
            },
            getProtoByName:function(call, callback){
                let result = metaService.getProtoByName(call.request["name"]);
                callback(null, { message: result});
            }
        });
    }

    stop() {
        this.server.tryShutdown();
    }
}

if (require.main === module) {
    let server = new JIocServer(json);
    server.start();
}

module.exports = JIocServer;

