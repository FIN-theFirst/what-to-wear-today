const axios = require("axios");
const { WeatherSnapshot, WeatherDay } = require("../services/weatherTypes");

async function fetchWeather() {
  const latitudeR = 49.013432;
  const longitudeR = 12.101624;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudeR}&longitude=${longitudeR}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,uv_index,wind_speed_10m,weathercode&current_weather=true&timezone=auto`;

  const response = await axios.get(url);
  const data = response.data;

  const {
    temperature_2m,
    time,
    apparent_temperature,
    wind_speed_10m,
    precipitation_probability,
    precipitation,
    uv_index,
    weathercode
  } = data.hourly;

  const weatherByDay = {};

  time.forEach((t, i) => {
    const date = t.split("T")[0];

    if (!weatherByDay[date]) {
      weatherByDay[date] = new WeatherDay(date);
    }

    const snapshot = new WeatherSnapshot({
      time: t,
      temperature: temperature_2m[i],
      apparentTemperature: apparent_temperature[i],
      windSpeed: wind_speed_10m[i],
      rainProbability: precipitation_probability[i],
      rainAmount: precipitation[i],
      weatherCode: weathercode[i],
      uvIndex: uv_index[i]
    });

    weatherByDay[date].addSnapshot(snapshot);
  });

  return weatherByDay;
}

module.exports = { fetchWeather };


