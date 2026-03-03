const ddlUnits = document.querySelector("#ddlUnits");
const dvCityCountry = document.querySelector("#dvCityCountry");
const dvCurrDate = document.querySelector("#dvCurrDate");
const dvCurrTemp = document.querySelector("#dvCurrTemp");
let cityName, countryName;

async function getGeoData() {
  let search = "pokhara"
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

  let date = new Intl.DateTimeFormat("en-US",dateOptions).format(new Date());
  console.log(cityName, countryName, date);

  dvCityCountry.textContent = `${cityName}, ${countryName}`
  dvCurrDate.textContent = date;
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

  // const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=weather_code,precipitation,temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature&wind_speed_unit=${windUnit}&temperature_unit=${tempUnit}&precipitation_unit=${precipUnit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

getGeoData();