//Select html Elements
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p ");
const bg = document.querySelector(".bg");
//App Data
const weather = {};

weather.temperature = { unit: "celsius" }; //Default Scale

const KELVIN = 273;
/* Note from Wikipedia:
The Kelvin scale fulfills Thomson's requirements
as an absolute thermodynamic temperature scale.
It uses absolute zero as its null point (i.e. low entropy ).
The relation between kelvin and Celsius scales is T K = t °C + 273.15.
*/
const key = "2115711775d854349351ae5751632a82"; // Open Weather Api

if (navigator.geolocation) {
  //Check if Browser supports Geolocation
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.inner = "<p>Browser Doesn't support Geolocation</p>";
}
//Set User's Position
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.inner = `<p>${error.message}</p>`;
}
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}
//Display weather to UI
function displayWeather() {
  let state= weather.description.replace(" ", "")
  //console.log(state); 
  bg.style.backgroundImage = `url(img/${state}.jpg)`;
  // change background image according to the weather description
  //https://openweathermap.org/weather-conditions

  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}
//switch scale

tempElement.addEventListener("click", function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
