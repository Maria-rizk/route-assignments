//1
var x ="123" 
x= 123
var z = 7
console.log(x+z)
//2
var x=0 
if(x>0){
    console.log("ok")
}else{
    console.log("Invalid")
}
//3
for (let i = 1; i < 10; i+=2) {
    console.log(i);
    
}
//4
const num=[1,2,3,4,5]
console.log(num.filter(num => num % 2 ===0));
//5
const data1 =[1,2,3]
const data2 =[3,4,5]
console.log([...new Set([...data1,...data2])])
//6
switch (i=2) {
    case i=1:
        console.log("sunday");
        break;
    case i=2:
        console.log("monday");
        break;
    case i=3:
        console.log("tuesday");
        break;
    case i=4:
        console.log("wednesday");
        break;
    case i=5:
        console.log("thursday");
        break;
    case i=6:
        console.log("friday");
        break;    
    case i=7:
        console.log("saturday");
        break;                

    default:
        console.log(undefined);
        break;
}
//7
const data=["a", "ab", "abc"]
console.log(data.map(item => item.length));

//8
let number = 15
if(number /3 && number /5){
    console.log("Divisible by both")
}
//9
let y=5
let square = y*y
console.log(square)
//10
const person = {name: 'John', age: 25}
console.log(`${person.name} is ${person.age} years old`)
//11
function sum(...args) {
    return args.reduce((total, num) => total + num);
}
console.log(sum(1, 2, 3, 4, 5)); 
//12
function resolve(){
    setTimeout(() => {
        console.log("Success");
        
    }, 3000);
}
resolve()
//13
function largenum(){
    return Math.max(...arguments)
}
console.log(largenum(1,3,7,2,4))
//14
function getkey(obj){
    return Object.keys(obj)
}
const key ={name: "John", age: 30}
console.log(getkey(key));
//15
function createarray(str){
    return str.split(" ")
}
const string="The quick brown fox"
console.log(createarray(string))

/*
q2:
1: foreach =>for matrices or arrays 
   forof => for objects
   Use forEach() when you need to perform a simple action on each element in an array and you don't need to stop the loop 
   Use for...of when you need more flexibility in controlling the loop, such as the ability to use break or when you want to iterate over different types of iterable objects

*/
/* 
2:hoisting => javascript read all variable before executing any code 
     the hoisting moves the declaration to the top of the scope 
     var, let and const accept hoisting but var is initialized with undefined
Temporal Dead Zone (TDZ) =>is the time between the entering of the scope and the acutual declaration
   applies to let and const only 

*/
/*
3:
== It only checks that the value is equal
=== it  checks that the value and datatype is equal

*/ 
/**
 4: try...catch is used to handle errors 
 how it works:
 1.executes the code inside the try block
 2.If no error occurs → catch is skipped
 3.If an error is thrown > execution jumps to the catch block.
 4.The caught error is an object 
 5.finally always runs — useful for cleanup
 */
/**
 5:Conversion => Explicit (intentional, programmer-controlled)
   Coercion => Implicit (automatic, JavaScript-driven)
 */