var NetProto = require("./NetProto");

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

         } else if (o.type === "meta") {//元数据类型

         } else if (o.type === "remote") {
            let netProto = new NetProto(o.ip, o.port, o.name);
            o = netProto.getInstance();
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


module.exports = JIoc;