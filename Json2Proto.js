var fs = require('fs');
var protoLoader = require('@grpc/proto-loader');

let template_head = `
syntax = "proto3";
package jioc;
`;
let template_service = `
service @serviceName {
    @methods
}
`;
let template_method = `rpc @methodName (@methodNameRequest) returns (@methodNameReply);`;
let template_Reply = `
message @methodNameReply {
    @type
}
`;

let template_Request = `
message @methodNameRequest {
    @type
}
`;
let newline = "\n";

function Json2Proto(json, path) {
    let paths = [];
    for (let name in json) {
        let result = object2Prote(name, json[name]);
        if (result != null && result.length > 10) {
            let fileName = path + "/" + name + ".proto";
            proto2File(result, fileName);
            paths.push(fileName);
        }
    }
    paths.push("./meta.proto");
    
    if (paths.length > 0) {
        var packageDefinition = protoLoader.loadSync(
            paths,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
        return packageDefinition;
    }
    return null;
}

function proto2File(proto, fileName) {
    try {
        fs.writeFileSync(fileName, proto)
    } catch (e) {
        throw e;
    }

}

function object2Prote(name, attribute) {
    if (attribute.type == "rpc" && attribute.methods && attribute.methods.length > 0) {
        let service_str = template_service.replace(/@serviceName/, name);
        let methods_str = "";
        let parameter_strs = "";
        let return_strs = "";
        for (let i = 0; i < attribute.methods.length; i++) {
            let method = attribute.methods[i]
            let method_str = template_method.replace(/@methodName/g, method.name);
            if (i == attribute.methods.length - 1) {
                methods_str += method_str;
            } else {
                methods_str += method_str + newline;
            }
            let parameter_str = template_Request.replace(/@methodName/g, method.name);
            let return_str = template_Reply.replace(/@methodName/g, method.name);
            let parameter_type = "";
            let j = 1
            for (let parameterKey in method.parameters) {
                parameter_type += method.parameters[parameterKey] + " " + parameterKey + " = " + j + ";" + newline;
                j++;
            }
            parameter_str = parameter_str.replace(/@type/, parameter_type)
            let return_type = "";
            if (method.return) {
                return_type = method.return + " message = 1;"
            }
            return_str = return_str.replace(/@type/, return_type);
            parameter_strs += parameter_str + newline;
            return_strs += return_str + newline
        }
        service_str = service_str.replace(/@methods/, methods_str);
        return template_head + service_str + parameter_strs + return_strs

    }
    return null;
}

module.exports = Json2Proto;

// function main() {
//     let name = "hello";
//     let attribute = {
//         "type": "rpc",
//         "object": "@helloworld1",
//         "methods": [
//             {
//                 "name": "sayHelloByMe",
//                 "return": "String",
//                 "parameters": {}
//             }
//         ]
//     }
//     console.time("test")
//     let result = object2Prote(name, attribute);
//     proto2File(result, "./" + name + ".proto");
//     console.log(result);
//     console.timeEnd("test");
// }
// main();