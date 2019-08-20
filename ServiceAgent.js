class ServiceAgent{
    constructor(o,method,parameters){
       this.o = o
       this.method = method;
       this.parameters = parameters
    }
    doService(call, callback){
        let parameter = this.getParameters(call);
        let result = Reflect.apply(this.method, this.o, parameter);
        callback(null, {message: result});
    }

    getParameters(call){
       let returnValue = [];
       let i = 0;
       for(let name in this.parameters){
        returnValue[i] = call.request[name];
       }
       return returnValue;
    }
}

module.exports = ServiceAgent;
