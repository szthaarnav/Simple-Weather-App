//Current Weather
const ddlUnits = document.querySelector("#ddlUnits");
const ddlDay = document.querySelector("#ddlDay");
const dvCityCountry = document.querySelector("#dvCityCountry");
const dvCurrDate = document.querySelector("#dvCurrDate");
const dvCurrTemp = document.querySelector("#dvCurrTemp");

//Current Conditions
const pFeelsLike = document.querySelector("#pFeelsLike");
const pHumidity = document.querySelector("#pHumidity");
const pWind = document.querySelector("#pWind");
const pPrecipitation = document.querySelector("#pPrecipitation");
let cityName, countryName, weatherData;

//Search Place name
const searchName = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");

async function getGeoData() {
  let search = searchName.value || "Lalitpur, Nepal";
  const url = `https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2&addressdetails=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    let lat = result[0].lat;
    let lon = result[0].lon;
    LoadLocationData(result);
    getWeatherData(lat,lon);
  } catch (error) {
    console.error(error.message);
  }
}

function LoadLocationData(locationData){
  let location =  locationData[0].address;
  cityName = location.city;
  countryName = location.country_code.toUpperCase();

  let dateOptions = {
    year:"numeric",
    month:"short",
    day:"numeric",
    weekday:"long",
  };

  let currDate = new Intl.DateTimeFormat("en-US",dateOptions).format(new Date()); 
  console.log(cityName, countryName, currDate);

  dvCityCountry.textContent = `${cityName}, ${countryName}`
  dvCurrDate.textContent = currDate;
}

async function getWeatherData(lat,lon) {
  //default values
  
  let tempUnit ="celsius";
  let windUnit ="kmh";
  let precipUnit ="mm";
  
  //if switched to fahrenheit
  if(ddlUnits.value === "F"){
    tempUnit ="fahrenheit";
    windUnit ="mph";
    precipUnit ="inch";
  }

  //temperature_unit = fahrenheit OR celsius(default)
  //wind_speed_unit = kmh(default) OR ms Or mph OR kn
  //precipitation_unit = mm(default) OR inch

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=weather_code,precipitation,temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature&wind_speed_unit=${windUnit}&temperature_unit=${tempUnit}&precipitation_unit=${precipUnit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    weatherData = await response.json();
    console.log(weatherData);

    LoadCurrentWeather(weatherData);
    LoadDailyForecast(weatherData);
    LoadHourlyForecast(weatherData);
  } catch (error) {
    console.error(error.message);
  }
}

function LoadCurrentWeather(weather){
  dvCurrTemp.textContent = Math.round(weather.current.temperature_2m);
  pFeelsLike.textContent = Math.round(weather.current.apparent_temperature);
  pHumidity.textContent = weather.current.relative_humidity_2m;
  pWind.textContent = `${Math.round(weather.current.wind_speed_10m)} ${weather.current_units.wind_speed_10m.replace("mp/h","mph")}`;
  pPrecipitation.textContent = `${weather.current.precipitation} ${weather.current_units.precipitation.replace("inch","in")}`;

}

function LoadDailyForecast(weather){
  let daily = weather.daily;

  for(let i=0;i<7;i++){
    let date = new Date(daily.time[i]);
    let dayOfWeek = new Intl.DateTimeFormat("en-US",{weekday : "short"}).format(date);
    let dvForecastDay = document.querySelector(`#dvForecastDay${i+1}`);

    dvForecastDay.innerHTML = "";
    let weatherCodeName = getWeatherCodeName(daily.weather_code[i]);
    let dailyHigh = Math.round(daily.temperature_2m_max[i]) + "°";
    let dailyLow = Math.round(daily.temperature_2m_min[i]) + "°";

    //Add content
    addDailyElement("p","daily_day-title",dayOfWeek,"",dvForecastDay,"afterbegin");
    addDailyElement("img","daily_day-icon","",weatherCodeName,dvForecastDay,"beforeend");
    addDailyElement("div","daily_day-temps","","",dvForecastDay,"beforeend");

    let dvDailyTemps = document.querySelector(`#dvForecastDay${i+1} .daily_day-temps`);
    addDailyElement("p","daily_day-high",dailyHigh,"",dvDailyTemps,"afterbegin");
    addDailyElement("p","daily_day-low",dailyLow,"",dvDailyTemps,"beforeend");

  }
  

  }

function LoadHourlyForecast(weather){
  let dayIndex = parseInt(ddlDay.value) || 0;
  // console.log(`Day ${dayIndex+1}`);
  let firstHour = 24 * dayIndex;
  let lastHour = 24 * (dayIndex + 1) - 1;
  let weatherCodes = weather.hourly.weather_code;
  let temps = weather.hourly.temperature_2m;
  let hours = weather.hourly.time;

  for(let h = firstHour; h<= lastHour; h++){
    let weatherCodeName = getWeatherCodeName(weatherCodes[h]); 
    let temp = Math.round(temps[h]) + "°";
    let hour = new Date(hours[h]).toLocaleString("en-US",{hour: "numeric", hour12: true});

    let hourDivIndex = h - firstHour + 1;
    let dvForecastHour = document.querySelector(`#dvForecastHour${hourDivIndex}`);
    dvForecastHour.innerHTML = "";

    addDailyElement("img","hourly_hour-icon","",weatherCodeName,dvForecastHour,"afterbegin");
    addDailyElement("p","hourly_hour-time",hour,"",dvForecastHour,"beforeend");
    addDailyElement("p","hourly_hour-temp",temp,"",dvForecastHour,"beforeend");
    }

}

function addDailyElement(tag, className, content, weatherCodeName, parentElement, position){
  const newElement = document.createElement(tag);
  newElement.setAttribute("class",className);
  if(content !== ""){
    const newContent = document.createTextNode(content);
    newElement.appendChild(newContent);
  }

  if(tag === "img"){
    newElement.setAttribute("src",`/assets/images/icon-${weatherCodeName}.webp`);
    newElement.setAttribute("alt",weatherCodeName);
    newElement.setAttribute("width","320");
    newElement.setAttribute("height","320");
  }
  parentElement.insertAdjacentElement(position, newElement);
}


function getWeatherCodeName(code){
  // Sunny = 0
  // Partly Cloudly = 1, 2
  // Overcast = 3
  // Fog = 45, 48
  //Drizzle = 51, 53, 55, 56, 57
  // Rain = 61, 63, 65, 66, 67, 80, 81, 82
  // Snow = 71, 73, 75, 77, 85, 86
  // Storm = 95, 96, 99

  const weatherCodes = {
    0:"sunny",
    1:"partly-cloudy",
    2:"partly-cloudy",
    3:"overcast",
    45:"fog",
    48:"fog",
    51:"drizzle",
    53:"drizzle",
    55:"drizzle",
    56:"drizzle",
    57:"drizzle",
    61:"rain", 
    63:"rain", 
    65:"rain", 
    66:"rain", 
    67:"rain", 
    80:"rain", 
    81:"rain", 
    82:"rain",
    71:"snow",
    73:"snow",
    75:"snow",
    77:"snow",
    85:"snow",
    86:"snow",
    95:"storm",
    96:"storm",
    99:"storm"
  };

  return weatherCodes[code];
}

function populateDayOfWeek(){
  let currDate = new Date();
  let currDay; 

  for(i=0;i<7;i++){
    currDay = new Intl.DateTimeFormat("en-US",{weekday:"long"}).format(currDate);
    const newOption = document.createElement("option");
    const dayOfWeek = document.createTextNode(currDay);

    newOption.setAttribute("class","hourly_select-day");
    newOption.setAttribute("value",i);
    newOption.appendChild(dayOfWeek);

    ddlDay.insertAdjacentElement("beforeend", newOption);
    currDate.setDate(currDate.getDate() + 1);
  }
  
}

populateDayOfWeek();
searchBtn.addEventListener("click",() => {
  getGeoData();
})
ddlUnits.addEventListener("change", () => {
  getGeoData();
});
getGeoData();
ddlDay.addEventListener("change", () => {
  LoadHourlyForecast(weatherData);
});