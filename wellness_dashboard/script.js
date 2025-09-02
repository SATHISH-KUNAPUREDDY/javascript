document.addEventListener('DOMContentLoaded', () => {
            const welcomeScreen = document.getElementById('welcomeScreen');
            const dashboard = document.getElementById('dashboard');
            const welcomeForm = document.getElementById('welcomeForm');
            const nameInput = document.getElementById('nameInput');
            const greeting = document.getElementById('greeting');
            
            const birthDateInput = document.getElementById('birthDate');
            const yearsEl = document.getElementById('years');
            const monthsEl = document.getElementById('months');
            const daysEl = document.getElementById('days');

            const heightSlider = document.getElementById('height');
            const weightSlider = document.getElementById('weight');
            const heightValueEl = document.getElementById('heightValue');
            const weightValueEl = document.getElementById('weightValue');
            const bmiValueEl = document.getElementById('bmiValue');
            const bmiCategoryEl = document.getElementById('bmiCategory');
            const bmiGauge = document.getElementById('bmiGauge');

            const colorPicker = document.getElementById('colorPicker');
            const colorPreview = document.getElementById('colorPreview');

            welcomeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = nameInput.value.trim();
                if (name) {
                    greeting.textContent = `Hello, ${name}!`;
                    welcomeScreen.classList.add('fade-out');
                    welcomeScreen.addEventListener('animationend', () => {
                        welcomeScreen.classList.add('hidden');
                        dashboard.classList.remove('hidden');
                        dashboard.classList.add('fade-in');
                    }, { once: true });
                }
            });

            function animateCount(element, target, duration = 800) {
                let start = 0;
                const final = parseInt(target, 10);
                const increment = Math.ceil(final / (duration / 16));
                
                const timer = setInterval(() => {
                    start += increment;
                    if (start >= final) {
                        element.textContent = final;
                        clearInterval(timer);
                    } else {
                        element.textContent = start;
                    }
                }, 16);
                 element.textContent = final;
            }

    function calculateAge() {
    if (!birthDateInput.value) return;

    const birthDate = new Date(birthDateInput.value);
    const today = new Date();

    if (birthDate > today) {
        alert("Birth date cannot be in the future!");
        return;
    }

    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();

    if (ageDays < 0) {
        ageMonths--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        ageDays += prevMonth.getDate();
    }

    if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
    }

    animateCount(yearsEl, ageYears);
    animateCount(monthsEl, ageMonths);
    animateCount(daysEl, ageDays);
}

birthDateInput.addEventListener('change', calculateAge);

            function calculateBMI() {
                const height = heightSlider.value / 100; 
                const weight = weightSlider.value;
                const bmi = (weight / (height * height)).toFixed(1);

                heightValueEl.textContent = `${heightSlider.value} cm`;
                weightValueEl.textContent = `${weightSlider.value} kg`;
                bmiValueEl.textContent = bmi;

                let category = '';
                let color = '';
                let rotation = 0;

                if (bmi < 18.5) {
                    category = 'Underweight';
                    color = '#3498db'; 
                    rotation = -70;
                } else if (bmi >= 18.5 && bmi <= 24.9) {
                    category = 'Normal';
                    color = '#2ecc71'; 
                    rotation = -25;
                } else if (bmi >= 25 && bmi <= 29.9) {
                    category = 'Overweight';
                    color = '#f1c40f'; 
                    rotation = 25;
                } else {
                    category = 'Obese';
                    color = '#e74c3c'; 
                    rotation = 70;
                }

                bmiCategoryEl.textContent = category;
                bmiCategoryEl.style.color = color;
                bmiGauge.style.borderColor = color;
                bmiGauge.style.transform = `rotate(${rotation}deg)`;
            }

            heightSlider.addEventListener('input', calculateBMI);
            weightSlider.addEventListener('input', calculateBMI);
            
            colorPicker.addEventListener('input', (e) => {
                const newColor = e.target.value;
                const lightColor = hexToRgba(newColor, 0.7);
                document.documentElement.style.setProperty('--primary-color', newColor);
                document.documentElement.style.setProperty('--primary-color-light', lightColor);
                colorPreview.style.backgroundColor = newColor;
            });
         
            function hexToRgba(hex, alpha) {
                let r = parseInt(hex.slice(1, 3), 16),
                    g = parseInt(hex.slice(3, 5), 16),
                    b = parseInt(hex.slice(5, 7), 16);

                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            
            calculateBMI();
            const today = new Date();
            birthDateInput.max = today.toISOString().split("T")[0];

        });