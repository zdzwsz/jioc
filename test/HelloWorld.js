class HelloWorld{
    constructor(name) {
        this.name = name
        this.age = 0;
    }
    sayHello(){
        console.log("hello " + this.name);
    }

    sayHelloFriends(friends){
        console.log("hello " + friends);
    }

    sayHelloByMe(youName){
        console.log(`${this.name} say hello to ${youName}`);
        return this.name + " say hello to " + youName;
    }

    sayHelloByMe1(youName){
        console.log(`sayHelloByMe1: ${this.name} say hello to ${youName}`);
        return this.name + " say hello to " + youName;
    }

    sayUser(user){
        console.log(user)
        return "hello user ,you name is "+user.name +" age is " + (user.age+2);
    }

    getUser(id){
        console.log("getUser:"+id);
        return {name:"zdz",age:2019};
    }
}
module.exports = HelloWorld;
