/**
 *  "hello": {
        "type": "rpc",
        "object": "@helloworld1",
        "methods": [
            {
                "name": "sayHelloByMe",
                "return": "String",
                "parameters": {}
            }
        ]
    }

syntax = "proto3";
package jioc;

service hello {
  rpc sayHelloByMe () returns (sayHelloByMeReply) {}
}

message sayHelloByMeReply {
  string message = 1;
}

 */
var fs = require('fs'); 

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
    @type message = 1;
}
`;

let template_Request = `
message @methodNameRequest {
    @type
}
`;
let newline = "\n";

function Json2Proto(json) {

}

function proto2File(proto,fileName){
    fs.writeFile(fileName, proto, function(err) {
        if (err) {
            throw err;
        }
    })
}

function object2Prote(name, attribute) {
    if (attribute.type == "rpc" && attribute.methods && attribute.methods.length > 0) {
        let service_str = template_service.replace(/@serviceName/, name);
        let methods_str = "";
        let parameter_str = "";
        let return_str = "";
        for (let i = 0; i < attribute.methods.length; i++) {
            let method = attribute.methods[i]
            let method_str = template_method.replace(/@methodName/g, method.name);
            if(i==attribute.methods.length -1 ){
                methods_str += method_str;
            }else{
                methods_str += method_str + newline;
            }
            parameter_str = template_Request.replace(/@methodName/g, method.name);
            return_str = template_Reply.replace(/@methodName/g, method.name);
            let parameter_type = "";
            let j = 1
            for (let parameterKey in method.parameters) {
                parameter_type += method.parameters[parameterKey] + " " + parameterKey + "=" + j + newline;
                j++;
            }
            parameter_str = parameter_str.replace(/@type/, parameter_type)
            return_str = return_str.replace(/@type/, method.return);
        }
        service_str = service_str.replace(/@methods/, methods_str);
        return template_head + service_str + parameter_str + return_str

    }
    return null;
}
function main() {
    let name = "hello";
    let attribute = {
        "type": "rpc",
        "object": "@helloworld1",
        "methods": [
            {
                "name": "sayHelloByMe",
                "return": "String",
                "parameters": {}
            }
        ]
    }
    console.time("test")
    let result = object2Prote(name, attribute);
    proto2File(result,"./"+name+".proto");
    console.log(result);
    console.timeEnd("test");
}
main();