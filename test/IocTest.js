let JIoc = require("../JIoc");
let json = require("./ioc.json");
function main(){

    console.time("other");
    let Ohello = require("./HelloWorld");
    let hello1 = new Ohello("111");
    hello1.sayHello();
    hello1.sayHelloByMe("wsz");
    console.timeEnd("other");

    console.time("ioc");
    let ioc = new JIoc(json);
    // let hello = ioc.get("helloworld");
    // hello.sayHello();
    // hello.sayHelloByMe("wsz");
    // hello = ioc.get("helloworld");
    // hello.sayHello();
    // console.timeEnd("ioc");

    // console.time("other");
    // let Ohello1 = require("./HelloWorld");
    // let ohello = new Ohello1("222");
    // ohello.sayHello();
    // ohello.sayHelloByMe("wsz");
    // console.timeEnd("other");

    let hello2 = ioc.get("helloworld2");
    hello2.sayHello();
    hello2.sayHelloByMe("wsz");

    let remoteHello = ioc.get("remoteHello");
    remoteHello.sayHelloByMe({name:"zdz"},function(err , message){
    });

    remoteHello = ioc.get("remoteHello");
    remoteHello.sayHelloByMe({name:"wsz"},function(err , message){});
    
    remoteHello.sayUser({user:{name:"zdz",age:11}},function(err , message){
        console.log(message);
    });

    remoteHello.sayHelloFriends({friends:["wsz","zdz"]},function(err , response){
        console.log("hello friends!");
    });

    remoteHello.getUser({id:"1"},function(err , response){
        for(let key in response){
            console.log("123:"+(response[key].age+2));
        }
    });
    remoteHello = ioc.get("remoteHello1");
    remoteHello.sayHelloByMe1({name:"wsz"},function(err , message){});
}

main();