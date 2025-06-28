const axios = require("axios");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "http://api.openweathermap.org/data/2.5";

async function getCurrentWeatherByCity(city) {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current weather by city:", error.message);
    throw error;
  }
}

async function getCurrentWeatherByCoords(lat, lon) {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching current weather by coordinates:",
      error.message
    );
    throw error;
  }
}

async function getSevenDayForecast(lat, lon) {
  try {
    const response = await axios.get(`${BASE_URL}/onecall`, {
      params: {
        lat: lat,
        lon: lon,
        exclude: "current,minutely,hourly,alerts",
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching 7-day forecast:", error.message);
    throw error;
  }
}

module.exports = {
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getSevenDayForecast,
};
