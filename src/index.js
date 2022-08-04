window.onload = melbRadio();

//main function to get weather from API and set HTML values on page
function getWeather(response) {
  let temp = Math.round(response.data.main.temp);
  let cityName = response.data.name;
  let desc = response.data.weather[0].main;
  let windSp = Math.round(response.data.wind.speed);
  let humid = Math.round(response.data.main.humidity);
  let dateTime = response.data.dt;
  document.querySelector("#city-name").innerHTML = `${cityName}`;
  document.querySelector("#main-temp").innerHTML = `${temp}°C`;
  document.querySelector("#weather-desc").innerHTML = `${desc}`;
  //need to add dynamic emoji eg if clouds = ⛅
  document.querySelector("#wind-speed").innerHTML = `Wind: ${windSp}km/h`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${humid}%`;
  document.querySelector("#last-update-datetime").innerHTML = lastUpdateTime(
    dateTime * 1000
  );
}

//how to convert to time zone of each city? rather than local time?

function lastUpdateTime(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
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

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}

//radio buttons mapped to Melbourne, Sydney & Brisbane weather API call
function melbRadio() {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let melbLat = -37.81;
  let melbLon = 144.96;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${melbLat}&lon=${melbLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
}

let melbRadioChecked = document.querySelector("#radioCitySelector1");
melbRadioChecked.addEventListener("click", melbRadio);

function sydRadio() {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let sydLat = -33.868;
  let sydLon = 151.2;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${sydLat}&lon=${sydLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
}

let sydRadioChecked = document.querySelector("#radioCitySelector2");
sydRadioChecked.addEventListener("click", sydRadio);

function brisRadio() {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let brisLat = -27.469;
  let brisLon = 153.02;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${brisLat}&lon=${brisLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
}

let brisRadioChecked = document.querySelector("#radioCitySelector3");
brisRadioChecked.addEventListener("click", brisRadio);

//sends current location lat lon to weather API
function handlePosition(position) {
  let apiKey = "721dfdcfc09e07da4b6904753634db8b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
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
//triggers function to get current location on "Current" button click
let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);
//triggers function to get searched location on "Search" button click
let searchButton = document.querySelector("#location-search");
searchButton.addEventListener("click", getSearchCity);
//ensure search bar also works on enter keypress
let searchInput = document.getElementById("city-search");
searchInput.addEventListener("keypress", enterPress);

// still to work on - forecast data, dynamic image, radio buttons
// forecast endpoint = api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

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
