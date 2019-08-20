class HelloWorld{
    constructor(name) {
        this.name = name
        this.age = 0;
    }
    sayHello(){
        console.log("hello " + this.name);
    }

    sayHelloByMe(youName){
        console.log(`${this.name} say hello to ${youName}`);
        return this.name + " say hello to " + youName;
    }

    sayUser(user){
        console.log(user)
        return "hello "+user.name;
    }
}
module.exports = HelloWorld;
