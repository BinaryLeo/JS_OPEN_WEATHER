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

  //Random picture loader
 //https://openweathermap.org/weather-conditions
  let state = weather.description.replace(" ", "");
  let rmd = Math.floor(Math.random() * 5) + 1;
  if (state.includes("clouds")) { // * Done
    bg.style.backgroundImage = `url(img/clouds/${rmd}.jpg)`; 
  } else if (state.includes("rain")) { // * Done
    bg.style.backgroundImage = `url(img/rain/${rmd}.jpg)`;
  } else if (state.includes("thunderstorm")) {// * Done
    bg.style.backgroundImage = `url(img/thunderstorm/${rmd}.jpg)`;
  }else if (state.includes("drizzle")) {// * Done
    bg.style.backgroundImage = `url(img/rain/${rmd}.jpg)`;
  }else if (state.includes("snow")) {// * Done
    bg.style.backgroundImage = `url(img/snow/${rmd}.jpg)`;
  }else if (state.includes("mist")) {// * Done
    bg.style.backgroundImage = `url(img/atmosphere/mist.jpg)`;
  }else if (state.includes("fog")) {// * Done
    bg.style.backgroundImage = `url(img/atmosphere/fog.jpg)`; 
  }else if (state.includes("sky")) {// * Done
    bg.style.backgroundImage = `url(img/atmosphere/clearsky.jpg)`;
  }else if (state.includes("tornado")) {// * Done
    bg.style.backgroundImage = `url(img/atmosphere/tornado.jpg)`;
  }else{
    bg.style.backgroundImage = `url(img/default.jpg)`;
  }
 

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
