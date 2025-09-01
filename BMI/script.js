 const result = document.getElementById("result");
    const progress = document.getElementById("progress");
    const historyList = document.getElementById("historyList");

    let history = JSON.parse(localStorage.getItem("bmiHistory")) || [];

    function updateHistory() {
      historyList.innerHTML = "";
      history.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${index+1}. BMI: ${item.bmi} (${item.category})`;
        historyList.appendChild(li);
      });
    }

    function calculateBMI() {
      const weight = document.getElementById("weight").value;
      const height = document.getElementById("height").value / 100; // convert cm to meters

      if (weight <= 0 || height <= 0 || isNaN(weight) || isNaN(height)) {
        result.innerHTML = "Please enter valid values!";
        result.style.color = "red";
        return;
      }

      const bmi = (weight / (height * height)).toFixed(2);
      let category = "";
      let color = "green";

      if (bmi < 18.5) {
        category = "Underweight!";
        color = "#f39c12";
      } else if (bmi < 24.9) {
        category = "Normal";
        color = "#27ae60";
      } else if (bmi < 29.9) {
        category = "Overweight";
        color = "#e67e22";
      } else {
        category = "Obese";
        color = "#e74c3c";
      }

      result.style.color = "#333";
      result.innerHTML = `Your BMI is <b>${bmi}</b> (${category})`;

      const progressWidth = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);
      progress.style.width = progressWidth + "%";
      progress.style.background = color;


      history.unshift({ bmi, category });
      if (history.length > 5) history.pop();
      localStorage.setItem("bmiHistory", JSON.stringify(history));
      updateHistory();
    }

    function resetBMI() {
      document.getElementById("weight").value = "";
      document.getElementById("height").value = "";
      result.innerHTML = "";
      progress.style.width = "0";
    }

    updateHistory();

    function clearHistory() {
  localStorage.removeItem("bmiHistory"); 
  history = []; 
  updateHistory(); 
}