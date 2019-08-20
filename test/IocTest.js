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
}

main();