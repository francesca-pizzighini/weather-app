import "../scss/style.scss";
import axios from "axios";
import * as bootstrap from "bootstrap";
import appendFavicon from "./appendFavicon";

import searchIconPng from "../../img/search.png";
import humidityIconPng from "../../img/humidity.png";
import windIconPng from "../../img/wind.png";
import clearIcon from "../../img/clear.png";
import cloudsIcon from "../../img/clouds.png";
import drizzleIcon from "../../img/drizzle.png";
import mistIcon from "../../img/mist.png";
import rainIcon from "../../img/rain.png";
import snowIcon from "../../img/snow.png";

document.head.appendChild(appendFavicon(clearIcon));

let searchIcon = document.getElementById("search-icon");
let humidityIcon = document.getElementById("humidity-icon");
let windIcon = document.getElementById("wind-icon");
searchIcon.src = searchIconPng;
humidityIcon.src = humidityIconPng;
windIcon.src = windIconPng;

let cityNameInput = "london";
function saveCityName() {
  cityNameInput = document.getElementById("search-value").value;
  return cityNameInput;
}

function setNextForecast(id, hourToSum, listIndex, date, apidata) {
  let liElement = document.getElementById(id);

  let dateToDisplay = new Date(date.getTime() + 1000 * 60 * 60 * hourToSum);

  let emoji = "";
  function setEmoji() {
    if (apidata.list[listIndex].weather[0].main === "Clouds") {
      emoji = "☁️";
    } else if (apidata.list[listIndex].weather[0].main === "Clear") {
      emoji = "☀️";
    } else if (apidata.list[listIndex].weather[0].main === "Rain") {
      emoji = "🌧️";
    } else if (apidata.list[listIndex].weather[0].main === "Drizzle") {
      emoji = "🌦️";
    } else if (apidata.list[listIndex].weather[0].main === "Mist") {
      emoji = "🌫️";
    } else if (apidata.list[listIndex].weather[0].main === "Snow") {
      emoji = "❄️";
    } else {
      emoji = "🌦️";
    }
  }
  setEmoji();

  liElement.innerHTML = `${dateToDisplay.toLocaleDateString("en-US", {
    weekday: "short",
  })} ${dateToDisplay.toLocaleTimeString("en-US", {
    hour: "2-digit",
  })} - ${Math.round(apidata.list[listIndex].main.temp)}°C ${
    apidata.list[listIndex].weather[0].main
  } ${emoji}`;
}

let error = document.getElementById("error");
let temperature = document.getElementById("temp");
let cityName = document.getElementById("city");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let weatherIcon = document.getElementById("weather-icon");

// let API_KEY = "21f0616ee2103b557ec8f9a16f40e781";
const API_KEY = process.env.API_KEY;

const weatherApi = async (cityNameInput) => {
  try {
    let response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameInput}&units=metric&appid=${API_KEY}`
    );

    let data = await response.data;

    error.style.display = "none";

    temperature.innerHTML = `${Math.round(data.list[0].main.temp)}°C`;
    cityName.innerHTML = `${data.city.name}`;
    humidity.innerHTML = `${data.list[0].main.humidity}%`;
    wind.innerHTML = `${data.list[0].wind.speed} km/h`;

    if (data.list[0].weather[0].main === "Clouds") {
      weatherIcon.src = cloudsIcon;
    } else if (data.list[0].weather[0].main === "Clear") {
      weatherIcon.src = clearIcon;
    } else if (data.list[0].weather[0].main === "Rain") {
      weatherIcon.src = rainIcon;
    } else if (data.list[0].weather[0].main === "Drizzle") {
      weatherIcon.src = drizzleIcon;
    } else if (data.list[0].weather[0].main === "Mist") {
      weatherIcon.src = mistIcon;
    } else if (data.list[0].weather[0].main === "Snow") {
      weatherIcon.src = snowIcon;
    } else {
      weatherIcon.src = drizzleIcon;
    }

    let date = new Date();

    setNextForecast("3-hr-forecast", 3, 1, date, data);
    setNextForecast("6-hr-forecast", 6, 2, date, data);
    setNextForecast("12-hr-forecast", 12, 4, date, data);
    setNextForecast("1-d-forecast", 24, 8, date, data);
    setNextForecast("2-d-forecast", 48, 16, date, data);
    setNextForecast("3-d-forecast", 72, 24, date, data);
    setNextForecast("4-d-forecast", 96, 32, date, data);

    document.getElementById("search-value").value = "";
  } catch (err) {
    error.style.display = "block";
    console.error(err);
  }
};

let searchValue = document.getElementById("search-value");
searchValue.addEventListener("input", saveCityName);

let searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", () => {
  weatherApi(saveCityName());
});

weatherApi(cityNameInput);
