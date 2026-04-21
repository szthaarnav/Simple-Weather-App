# 🌤️ Weather Now

A clean, responsive weather web app that shows current conditions, a 7-day daily forecast, and a 24-hour hourly forecast for any searched location.

![Weather Now Screenshot](./preview.jpg)

---

## 🔗 Live Demo

[View Live →](https://szthaarnav.github.io/Simple-Weather-App/)

---

## ✨ Features

- Search any city or location worldwide
- Current weather — temperature, feels like, humidity, wind speed, precipitation
- 7-day daily forecast with high/low temperatures and weather icons
- 24-hour hourly forecast with a day selector dropdown
- Toggle between **Celsius/Fahrenheit** and metric/imperial units
- Defaults to Kathmandu, Nepal on initial load
- Fully responsive — mobile-first design

---

## 🛠️ Built With

- **HTML5**
- **CSS3** — CSS Grid, custom properties, `@layer`, media queries
- **Vanilla JavaScript** — no frameworks or libraries
- **[Open-Meteo API](https://open-meteo.com/)** — free weather forecast data (no API key required)
- **[Nominatim / OpenStreetMap](https://nominatim.org/)** — free geocoding to convert city names to coordinates

---

## 🌐 APIs Used

### Open-Meteo
Provides current weather, daily forecast, and hourly forecast data. No API key required.

```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}
  &current=weather_code,precipitation,temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &hourly=temperature_2m,weather_code
  &temperature_unit=celsius
  &wind_speed_unit=kmh
  &precipitation_unit=mm
```

### Nominatim (OpenStreetMap)
Converts a search query (city name) into latitude and longitude coordinates.

```
https://nominatim.openstreetmap.org/search?q={city}&format=jsonv2&addressdetails=1
```

---

## 🚀 Getting Started

No build tools or dependencies required. Just clone and open.

```bash
git clone https://github.com/szthaarnav/Simple-Weather-App.git
cd Simple-Weather-App
```

Then open `index.html` in your browser, or serve it locally:

```bash
npx serve .
```

---

## 📁 Project Structure

```
weather-app/
├── assets/
│   ├── fonts/
│   └── images/
├── design/
├── .gitignore
├── index.html
├── preview.jpg
├── README.md
├── script.js
├── style-guide.md
└── style.css
```

---

## 🌦️ Weather Code Mapping

| Code | Condition |
|------|-----------|
| 0 | Sunny |
| 1, 2 | Partly Cloudy |
| 3 | Overcast |
| 45, 48 | Fog |
| 51–57 | Drizzle |
| 61–67, 80–82 | Rain |
| 71–77, 85–86 | Snow |
| 95, 96, 99 | Storm |

---

## 🙏 Acknowledgements

- [Open-Meteo](https://open-meteo.com/) for the free weather API
- [Nominatim](https://nominatim.org/) for the free geocoding API
- [Frontend Mentor](https://www.frontendmentor.io/) for the original design challenge inspiration