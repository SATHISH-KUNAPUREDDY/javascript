var sathish ="good boy"
console.log(sathish)
var subbu = "lover boy"
console.log(subbu)

let nara = "innocent"
console.log(nara)

nara = "ijke"
console.log(nara)

let nara = "3fr ojl"
console.log(nara)

const balaji = "good"
console.log(balaji)

balaji = "reddhh"
console.log(balaji)


var a="10";
var b=40;
document.write(console.log(a));


alert("this is an webpage")

let name = prompt("What is your name?");
console.log("Hello, " + name);


let result = confirm("Are you sure you want to delete?");
if (result) {
  console.log("User clicked OK");
} else {
  console.log("User clicked Cancel");
}

let age = 15 ;

if (age>= 18) {
  console.log("You are eligible to vote.");
}else{
    console.log("You are not eligible to vote. ")
}


let day= "friday";

switch(day){
    case "monday":
       console.log("start day of the week");
       break;
    case "wednesday":
      console.log("mid day of the week");
      break;
    case "friday":
      console.log("end of the week");
      break;
    default :
    console.log("another day of the week"); 
}


let name = "sathish";

if (name) {
  console.log("Name exists");
} else {
  console.log("Name is empty or undefined");
}


function calculate(operation) {
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  let result;

  switch (operation) {
    case "add":
      result = add(num1, num2);
      break;
    case "subtract":
      result = subtract(num1, num2);
      break;
    case "multiply":
      result = multiply(num1, num2);
      break;
    case "divide":
      result = divide(num1, num2);
      break;
    default:
      result = "Invalid operation";
  }

  document.getElementById("result").innerText = "Result: " + result;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

const multiply = function(a, b) {
  return a * b;
};


const divide = (a, b) => {
  return b !== 0 ? (a / b).toFixed(2) : "Cannot divide by 0";
};
