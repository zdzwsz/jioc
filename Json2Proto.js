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
let template_type = `
message @name{
    @type
}
`
let newline = "\n";
let formatTab = "    ";

function Json2Proto(json, path) {
    let paths = [];
    for (let name in json) {
        let result = object2Prote(name, json[name], json);
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
let protoTypes={
    "String":"string",
    "String[]":"repeated string",
    "string[]":"repeated string",
    "number":"double",
    "number[]":"repeated double",
    "boolean":"bool",
    "boolean[]":"repeated bool",
    "int":"int32",
    "int[]":"repeated int32",
    "long":"int64",
    "long[]":"repeated int64"
}
function jsType2ProtoType(jsType){
    let result = protoTypes[jsType];
    if(result == null){
        result = jsType
    }
    return result;
}

function object2Prote(name, attribute, json) {
    if (attribute.type == "rpc" && attribute.methods && attribute.methods.length > 0) {
        var objectTypeMap = new Map();
        let service_str = template_service.replace(/@serviceName/, name);
        let methods_str = "";
        let parameter_strs = "";
        let return_strs = "";
        for (let i = 0; i < attribute.methods.length; i++) {
            let method = attribute.methods[i]
            let method_str = template_method.replace(/@methodName/g, method.name);
            if (i == 0) {
                methods_str += method_str + newline;
            }
            else if (i == attribute.methods.length - 1) {
                methods_str += formatTab + method_str;
            } else {
                methods_str += formatTab + method_str + newline;
            }
            let parameter_str = template_Request.replace(/@methodName/g, method.name);
            let return_str = template_Reply.replace(/@methodName/g, method.name);
            let parameter_type = "";
            let j = 1
            for (let parameterKey in method.parameters) {
                let parameterType = method.parameters[parameterKey];
                if (parameterType.indexOf("@") == 0) {
                    parameterType = parameterType.substring(1);
                    JosnMeta2ProteType(parameterType, json, objectTypeMap);
                }
                parameter_type += jsType2ProtoType(parameterType) + " " + parameterKey + " = " + j + ";" + newline;
                j++;
            }
            parameter_str = parameter_str.replace(/@type/, parameter_type)
            let return_type = "";
            if (method.return) {
                let returnType = method.return;
                if (returnType.indexOf("@") == 0) {
                    returnType = returnType.substring(1);
                    JosnMeta2ProteType(returnType, json, objectTypeMap);
                }
                return_type = returnType + " message = 1;"
            }
            return_str = return_str.replace(/@type/, return_type);
            parameter_strs += parameter_str + newline;
            return_strs += return_str + newline
        }
        service_str = service_str.replace(/@methods/, methods_str);
        return template_head + service_str + parameter_strs + return_strs + ObjectTypeMap2String(objectTypeMap);

    }
    return null;
}

function JosnMeta2ProteType(name, json, objectTypeMap) {
    if (objectTypeMap.get(name) != null) return;
    let jsonObject = json[name];
    if (jsonObject == null) {
        throw new Error("The object(" + name + ") does not exist, please configure it.");
    } else if (jsonObject.type != "meta") {
        throw new Error("The object(" + name + ")  is not a metadata type.");
    }
    let type_str = template_type.replace(/@name/, name);
    attributes_str = attribute2ProteType(jsonObject.value,json,objectTypeMap);
    objectTypeMap.set(name, type_str.replace(/@type/, attributes_str));
}

function ObjectTypeMap2String(objectTypeMap) {
    let result = "";
    for (let key of objectTypeMap.keys()) {
        result += objectTypeMap.get(key) + newline;
    }
    return result
}

function attribute2ProteType(attributes,json,objectTypeMap) {
    let attributes_str = "";
    let j = 1;
    for (let attribute in attributes) {
        let type = attributes[attribute];
        if (type.indexOf("@") == 0) {
            type = type.substring(1);
            JosnMeta2ProteType(type, json, objectTypeMap);
        }
        if(j==1){
            attributes_str += jsType2ProtoType(type) + " " + attribute + " = " + j + ";" + newline;
        }else{
            attributes_str += formatTab + jsType2ProtoType(type) + " " + attribute + " = " + j + ";" + newline;
        }
        
        j++;
    }
    return attributes_str;
}

module.exports = Json2Proto;
