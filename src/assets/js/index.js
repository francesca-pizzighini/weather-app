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

function setImage(element, data) {
  if (data.list[0].weather[0].main === "Clouds") {
    element.src = cloudsIcon;
  } else if (data.list[0].weather[0].main === "Clear") {
    element.src = clearIcon;
  } else if (data.list[0].weather[0].main === "Rain") {
    element.src = rainIcon;
  } else if (data.list[0].weather[0].main === "Drizzle") {
    element.src = drizzleIcon;
  } else if (data.list[0].weather[0].main === "Mist") {
    element.src = mistIcon;
  } else if (data.list[0].weather[0].main === "Snow") {
    element.src = snowIcon;
  } else {
    element.src = drizzleIcon;
  }
}
function setEmoji(data) {
  let emoji = "";
  if (data.weather[0].main === "Clouds") {
    emoji = "☁️";
  } else if (data.weather[0].main === "Clear") {
    emoji = "☀️";
  } else if (data.weather[0].main === "Rain") {
    emoji = "🌧️";
  } else if (data.weather[0].main === "Drizzle") {
    emoji = "🌦️";
  } else if (data.weather[0].main === "Mist") {
    emoji = "🌫️";
  } else if (data.weather[0].main === "Snow") {
    emoji = "❄️";
  } else {
    emoji = "🌦️";
  }
  return emoji;
}

let error = document.getElementById("error");
let temperature = document.getElementById("temp");
let cityName = document.getElementById("city");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let weatherIcon = document.getElementById("weather-icon");
let listOfWeather = document.getElementById("list-of-next-forecast");

const API_KEY = process.env.API_KEY;

const weatherApi = async (cityNameInput) => {
  try {
    let response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameInput}&units=metric&appid=${API_KEY}`
    );

    let data = await response.data;

    error.style.display = "none";

    while (listOfWeather.hasChildNodes()) {
      listOfWeather.removeChild(listOfWeather.firstChild);
    }

    temperature.innerHTML = `${Math.round(data.list[0].main.temp)}°C`;
    cityName.innerHTML = `${data.city.name}`;
    humidity.innerHTML = `${data.list[0].main.humidity}%`;
    wind.innerHTML = `${data.list[0].wind.speed} km/h`;

    setImage(weatherIcon, data);

    data.list.map((weather) => {
      let li = document.createElement("li");
      const date = new Date(weather.dt_txt);
      let formattedDate = `${date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })} - ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
      })}`;
      let temp = `${Math.round(weather.main.temp)}°C`;

      let weatherEmoji = setEmoji(weather);

      let innerHTML = `${formattedDate} - ${temp} ${weatherEmoji}`;
      li.innerHTML = innerHTML;
      listOfWeather.appendChild(li);
    });

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
