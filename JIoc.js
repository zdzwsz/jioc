var RemoteRpcClient = require("./RemoteRpcClient");
var fs = require("fs");


class JIoc {

   //metaSource = null;
   constructor(metaSource) {
      this.metaSource = metaSource;
      this.context = new Map();
   }

   get(id) {
      if (id.indexOf("@") == 0) {
         id = id.substring(1);
      }
      let o = this.context.get(id);
      if (isNull(o)) {
         o = this.metaSource[id]
         if (isNull(o)) {
            return null;
         }
         else if (isNull(o.type)) { //基本类型
            return o;
         } else if (o.type === "date") { //日期类型，
            o = convertDateFromString(o.value)
         } else if (o.type === "meta") {//元数据类型
            o = JSON.parse(o.value);
         } else if (o.type === "remote") {
            let reomteRpcClient = new RemoteRpcClient(o.ip, o.port, o.name);
            o = reomteRpcClient.getInstance();
         } else {
            //其余的是复杂对象类型
            let classType = require(o.type);
            let p = [];
            if (isNotNull(o.constructor) && typeof (o.constructor) != "function") {
               for (let i = 0; i < o.constructor.length; i++) {
                  p[i] = o.constructor[i].value;
                  if (p[i].indexOf("@") == 0) {
                     p[i] = this.get(p[i]);
                  }
               }
            }
            o = Reflect.construct(classType, p);
         }

         if (isNull(o)) {
            return null;
         } else {
            this.context.set(id, o);
         }
      }
      return o;
   }
}

function isNull(o) {
   return o == null || o == undefined;
}

function isNotNull(o) {
   return o != null && o != undefined && o != "";
}

function convertDateFromString(dateString) {
   if (dateString) { 
       var date = new Date(dateString.replace(/-/,"/"))  
       return date;
   }
}


module.exports = JIoc;