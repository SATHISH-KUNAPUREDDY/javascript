// 1. Write a named function that prints "Good Morning" to the console.
function hi(){
    console.log("Good Morning")
}
hi()

// Q2. Write a named function that takes one parameter name and prints "Welcome, <name>".
function hlo(name) {
    console.log("Welcome " + name);
}
hlo("Sathish");

// Q3. Write a named function that takes two numbers and prints their sum.
function subtarct(a,b){
     console.log(a-b)
     console.log(a*b)
     console.log(a+b)
     console.log(a/b)
}
subtarct(10,20)

// Q4. Write a named function that checks if a number is even and prints true or false.
function isEven(number) {
    if (number % 2 === 0) {
        console.log(true);
    } else {
        console.log(false);
    }
}
isEven(4);  
isEven(7);

// Q5. Write a named function that loops from 1 to 5 and prints each number.
function loop(){
    for ( let i = 1; i<=5; i++ ){
         console.log(i)
    }
}
loop()

// Q6. Write an arrow function to print "I love JavaScript".
var z= ()=>{
  console.log("I love JavaScript")
}
z()

// Q7. Write an arrow function that multiplies two numbers and prints the result.
var s =(a,b)=>{
    console.log(a*b)
}
s(2,4)
// Q8. Write an arrow function that checks if a number is negative.

const d = (number) => number < 0;
console.log(d(-5));
console.log(d(5));

// Q9. Write an arrow function that takes a number and prints whether it is odd/even.

const checkOddEven = (number) => {
    if (number % 2 === 0) {
        console.log("Even");
    } else {
        console.log("Odd");
    }
};
checkOddEven(4);  
checkOddEven(7);  


