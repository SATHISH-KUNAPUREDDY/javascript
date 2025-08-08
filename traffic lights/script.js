 function turnRed() {
            document.getElementById("red").style.backgroundColor = "red";
            document.getElementById("yellow").style.backgroundColor = "gray";
            document.getElementById("green").style.backgroundColor = "gray";
            document.getElementById("status").innerText = "STOP!";
            document.getElementById("status").style.color = "red";
        }

        function turnYellow() {
            document.getElementById("red").style.backgroundColor = "gray";
            document.getElementById("yellow").style.backgroundColor = "yellow";
            document.getElementById("green").style.backgroundColor = "gray";
            document.getElementById("status").innerText = "READY...";
            document.getElementById("status").style.color = "orange";
        }

        function turnGreen() {
            document.getElementById("red").style.backgroundColor = "gray";
            document.getElementById("yellow").style.backgroundColor = "gray";
            document.getElementById("green").style.backgroundColor = "green";
            document.getElementById("status").innerText = "GO!";
            document.getElementById("status").style.color = "green";
        }