var fs = require('fs');

class MetaService{
     
     constructor(json,path){
         this.json = this.clone(json);
         this.allRPC = [];
         this.path = path;
         this.init();
     }

     init(){
        for (let service in this.json) {
            if (this.json[service].type == "rpc") {
              delete this.json[service].type;
              delete this.json[service].object;
              this.allRPC.push(service);
            }
        }
     }

     clone(json){
       return JSON.parse(JSON.stringify(json));
     }

     getAllMetaName(){
       return this.allRPC;
     }

     getSerevicesByName(name){
       return JSON.stringify(this.json[name]);
     }

     getProtoByName(name){
        let filePath = this.path + "/" + name + ".proto";
         return fs.readFileSync(filePath,'utf-8');
     }
}

module.exports = MetaService;