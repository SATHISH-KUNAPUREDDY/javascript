let display = document.getElementById('display');
    function appendChar(char) {
      if (display.innerText === "0") display.innerText = "";
      display.innerText += char;
    }
    function clearDisplay() {
      display.innerText = "0";
    }
    function deleteChar() {
      display.innerText = display.innerText.slice(0, -1) || "0";
    }
    function calculate() {
    try {
      display.innerText = eval(display.innerText.replace('÷','/').replace('×','*'));
       display.style.color = "white";
    } catch {
      display.innerText = "Error";
       display.style.color = "red";
    }
    }  