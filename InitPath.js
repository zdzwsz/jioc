var fs = require("fs");
var path = "./_system_proto_";
var remotePath = path + "/remote";
if(!fs.existsSync(path)){
    fs.mkdirSync(path);
}
if(!fs.existsSync(remotePath)){
    fs.mkdirSync(remotePath);
}
module.exports = {path,remotePath};