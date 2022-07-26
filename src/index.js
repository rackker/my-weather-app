function backgroundColourChange(localTime) {
  let bodyCSS = document.querySelector("#body-div");
  let cityName = document.querySelector("#city-name");
  let weatherNow = document.querySelector("#main-temp");
  let link = document.querySelector("a");
  //sunrise colours
  if (5 <= localTime && 8 >= localTime) {
    bodyCSS.removeAttribute("class");
    bodyCSS.classList.add("sunrise-background");
    cityName.style.color = "rgb(0 153 52)";
    weatherNow.style.color = "rgb(0 153 52)";
    bodyCSS.style.color = "rgb(193 0 0)";
  }
  //sunset colours
  else if (18 <= localTime && 21 >= localTime) {
    bodyCSS.removeAttribute("class");
    bodyCSS.classList.add("sunset-background");
    cityName.style.color = "rgba(250, 171, 49, 1)";
    weatherNow.style.color = "rgba(250, 171, 49, 1)";
    bodyCSS.style.color = "white";
  }
  //nighttime colours
  else if (21 < localTime || 5 > localTime) {
    bodyCSS.removeAttribute("class");
    bodyCSS.classList.add("nighttime-background");
    cityName.style.color = "#caafff";
    weatherNow.style.color = "#caafff";
    bodyCSS.style.color = "white";
    link.style.color = "white";
  }
  //daytime colours
  else {
    bodyCSS.removeAttribute("class");
    bodyCSS.classList.add("daytime-background");
    cityName.style.color = "#d7eef4";
    weatherNow.style.color = "#d7eef4";
    bodyCSS.style.color = "rgb(7,62,76)";
    link.style.color = "black";
  }
}

//converting timezones
function changeTimeZone(response) {
  let cityTimeZone = response.data.timezoneId;
  let updatedTime = new Date().toLocaleString("en-AU", {
    timeZone: cityTimeZone,
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });
  localDayTime.innerHTML = updatedTime;

  let newTime = new Date(response.data.time);
  backgroundColourChange(newTime.getHours());
}

let apiKey = "721dfdcfc09e07da4b6904753634db8b";
window.onload = melbRadio();

//forecast API function
function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiURL).then(displayForecast);
}

//main function to get weather from API and set HTML values on page
function getWeather(response) {
  let temp = Math.round(response.data.main.temp);
  let cityName = response.data.name;
  let desc = response.data.weather[0].description;
  let windSp = Math.round(response.data.wind.speed);
  let humid = Math.round(response.data.main.humidity);
  let dateTime = response.data.dt;
  let icon = response.data.weather[0].icon;

  celsiusTemp = temp;

  document.querySelector("#city-name").innerHTML = `${cityName}`;
  document.querySelector("#main-temp").innerHTML = `${temp}°C`;
  document.querySelector("#weather-desc").innerHTML = `${desc}`;
  let weatherIcon = document.querySelector("#icon-main");
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#wind-speed").innerHTML = `Wind: ${windSp}km/h`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${humid}%`;
  document.querySelector("#last-update-datetime").innerHTML = lastUpdateTime(
    dateTime * 1000
  );

  getForecast(response.data.coord);
}

let celsiusTemp = null;

//updates HTML to display forecast from API data
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div>`;
  let forecast = response.data.daily;
  forecast.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      let maxTemp = Math.round(day.temp.max);
      forecastHTML =
        forecastHTML +
        `
      <div class="row justify-content-md-center">
      <div class="col col-lg-2 text-end fw-bold">${maxTemp}°C</div>
      <div class="col-md-auto text-center">
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
      alt="${day.weather[0].description}"
      id="forecast-icon"/>
      </div>
      <div class="col col-lg-2">${formatDay(day.dt)}</div>
      </div>
      `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

//format day of week in forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  return days[day];
}

//update time under today's weather with time relevant to the displayed city
function lastUpdateTime(timestamp) {
  let date = new Date(timestamp);
  let day = days[date.getDay()];
  let hours = [
    12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11,
  ];
  let hour = hours[date.getHours()];

  function morningEvening() {
    let result;
    if (date.getHours() < 12) {
      result = "am";
    } else {
      result = "pm";
    }
    return result;
  }

  let amPM = morningEvening();
  let mins = date.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }
  return `Last updated ${day} ${hour}:${mins} ${amPM}`;
}

//radio buttons mapped to Melbourne, Sydney & Brisbane weather API call
function melbRadio() {
  let melbLat = -37.81;
  let melbLon = 144.96;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${melbLat}&lon=${melbLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `https://secure.geonames.org/timezoneJSON?lat=${melbLat}&lng=${melbLon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}

let melbRadioChecked = document.querySelector("#radioCitySelector1");
melbRadioChecked.addEventListener("click", melbRadio);

function sydRadio() {
  let sydLat = -33.868;
  let sydLon = 151.2;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${sydLat}&lon=${sydLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `https://secure.geonames.org/timezoneJSON?lat=${sydLat}&lng=${sydLon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}

let sydRadioChecked = document.querySelector("#radioCitySelector2");
sydRadioChecked.addEventListener("click", sydRadio);

function brisRadio() {
  let brisLat = -27.469;
  let brisLon = 153.02;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${brisLat}&lon=${brisLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `https://secure.geonames.org/timezoneJSON?lat=${brisLat}&lng=${brisLon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}

let brisRadioChecked = document.querySelector("#radioCitySelector3");
brisRadioChecked.addEventListener("click", brisRadio);

//sends current location lat lon to weather API
function handlePosition(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `https://secure.geonames.org/timezoneJSON?lat=${position.coords.latitude}&lng=${position.coords.longitude}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}
//uses geolocation API to get browser IP address
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}
//inputs lat lon for searched city into weather API endpoint and calls getWeather function
function getWeatherforCity(response) {
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}
//gets value input into search bar, calls above function.
function getSearchCity() {
  let input = document.getElementById("city-search").value;
  let cleanInput = input.toLowerCase().trim();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cleanInput}&appid=${apiKey}`;
  axios.get(apiUrl).then(getWeatherforCity);
}
//function to make enter key work to search for a city
function enterPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("location-search").click();
  }
}

//date & time function
function currentDayTime(now) {
  let day = days[now.getDay()];

  let hours = [
    12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11,
  ];
  let hour = hours[now.getHours()];

  function morningEvening() {
    let result;
    if (now.getHours() < 12) {
      result = "am";
    } else {
      result = "pm";
    }
    return result;
  }

  let amPM = morningEvening();
  let mins = now.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }
  return `${day} ${hour}:${mins}${amPM}`;
}

let now = new Date();
let localDayTime = document.querySelector("#daytime");
localDayTime.innerHTML = currentDayTime(now);

//convert temperature metrics
// function displayTempAsF(event) {
//   event.preventDefault();
//   let checkElement = farenheitLink.innerHTML;
//   let check = checkElement.includes("Farenheit");

//   if (check == true) {
//     let farenheitTemp = Math.round((celsiusTemp * 9) / 5 + 32);
//     document.querySelector("#main-temp").innerHTML = `${farenheitTemp}°F`;
//     farenheitLink.innerHTML = "Convert to Celsius";
//   } else {
//     document.querySelector("#main-temp").innerHTML = `${celsiusTemp}°C`;
//     farenheitLink.innerHTML = "Convert to Farenheit";
//   }
// }

//triggers function to get current location on "Current" button click
let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);
//triggers function to get searched location on "Search" button click
let searchButton = document.querySelector("#location-search");
searchButton.addEventListener("click", getSearchCity);
//ensure search bar also works on enter keypress
let searchInput = document.getElementById("city-search");
searchInput.addEventListener("keypress", enterPress);
// //farenheit conversion
// let farenheitLink = document.querySelector("#farenheit-link");
// farenheitLink.addEventListener("click", displayTempAsF);
