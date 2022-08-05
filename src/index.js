window.onload = melbRadio();

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
  weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#wind-speed").innerHTML = `Wind: ${windSp}km/h`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${humid}%`;
  document.querySelector("#last-update-datetime").innerHTML = lastUpdateTime(
    dateTime * 1000
  );
}

let celsiusTemp = null;

//how to convert to time zone of each city? rather than local time?

function lastUpdateTime(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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

//converting timezones
function changeTimeZone(response) {
  let cityTimeZone = response.data.timezoneId;
  let updatedTime = new Date().toLocaleString("en-AU", {
    timeZone: cityTimeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  localDayTime.innerHTML = updatedTime;
}

//radio buttons mapped to Melbourne, Sydney & Brisbane weather API call
function melbRadio() {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let melbLat = -37.81;
  let melbLon = 144.96;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${melbLat}&lon=${melbLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `http://secure.geonames.org/timezoneJSON?lat=${melbLat}&lng=${melbLon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}

let melbRadioChecked = document.querySelector("#radioCitySelector1");
melbRadioChecked.addEventListener("click", melbRadio);

function sydRadio() {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let sydLat = -33.868;
  let sydLon = 151.2;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${sydLat}&lon=${sydLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `http://secure.geonames.org/timezoneJSON?lat=${sydLat}&lng=${sydLon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}

let sydRadioChecked = document.querySelector("#radioCitySelector2");
sydRadioChecked.addEventListener("click", sydRadio);

function brisRadio() {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let brisLat = -27.469;
  let brisLon = 153.02;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${brisLat}&lon=${brisLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `http://secure.geonames.org/timezoneJSON?lat=${brisLat}&lng=${brisLon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}

let brisRadioChecked = document.querySelector("#radioCitySelector3");
brisRadioChecked.addEventListener("click", brisRadio);

//sends current location lat lon to weather API
function handlePosition(position) {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `http://secure.geonames.org/timezoneJSON?lat=${position.coords.latitude}&lng=${position.coords.longitude}&username=rack`;
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
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
  let timeZoneApiUrl = `http://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lon}&username=rack`;
  axios.get(timeZoneApiUrl).then(changeTimeZone);
}
//gets value input into search bar, calls above function.
function getSearchCity() {
  let input = document.getElementById("city-search").value;
  let cleanInput = input.toLowerCase().trim();
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
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
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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
function displayTempAsF(event) {
  event.preventDefault();
  let checkElement = farenheitLink.innerHTML;
  let check = checkElement.includes("Farenheit");

  if (check == true) {
    let farenheitTemp = Math.round((celsiusTemp * 9) / 5 + 32);
    document.querySelector("#main-temp").innerHTML = `${farenheitTemp}°F`;
    farenheitLink.innerHTML = "Convert to Celsius";
  } else {
    document.querySelector("#main-temp").innerHTML = `${celsiusTemp}°C`;
    farenheitLink.innerHTML = "Convert to Farenheit";
  }
}

//triggers function to get current location on "Current" button click
let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);
//triggers function to get searched location on "Search" button click
let searchButton = document.querySelector("#location-search");
searchButton.addEventListener("click", getSearchCity);
//ensure search bar also works on enter keypress
let searchInput = document.getElementById("city-search");
searchInput.addEventListener("keypress", enterPress);
//farenheit conversion
let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayTempAsF);

// still to work on - forecast data, timezone conversion
// forecast endpoint = api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
