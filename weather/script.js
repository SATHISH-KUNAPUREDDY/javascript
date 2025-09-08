const apiKey = "fbe9451e1d7bb444128965e93a0b1ac6"; 
const searchBtn = document.getElementById("search");
const cityInput = document.getElementById("city");
const weatherBox = document.getElementById("weather");
const cityName = document.getElementById("city-name");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");
const errorMsg = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  } else {
    errorMsg.textContent = "Please enter a city name!";
  }
});

async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message); 
    }

    displayWeather(data);
  } catch (error) {
    errorMsg.textContent =  error.message;
    weatherBox.classList.add("hidden");
  }
}

function displayWeather(data) {
  errorMsg.textContent = "";
  weatherBox.classList.remove("hidden");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = ` ${data.main.temp}°C`;
  desc.textContent = ` ${data.weather[0].description}`;
  humidity.textContent = ` Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind: ${data.wind.speed} km/h`;

  const iconCode = data.weather[0].icon;
  icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

 
  const weatherMain = data.weather[0].main.toLowerCase();

  if (weatherMain.includes("cloud")) {
    document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)"; 
  } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
    document.body.style.background = "linear-gradient(to right, #00c6fb, #005bea)"; 
  } else if (weatherMain.includes("clear")) {
    document.body.style.background = "linear-gradient(to right, #fceabb, #f8b500)"; 
  } else if (weatherMain.includes("snow")) {
    document.body.style.background = "linear-gradient(to right, #e0eafc, #cfdef3)"; 
  } else if (weatherMain.includes("thunderstorm")) {
    document.body.style.background = "linear-gradient(to right, #232526, #414345)"; 
  } else {
    document.body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)"; 
  }
}
