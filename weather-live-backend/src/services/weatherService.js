const openWeatherMap = require("../api/openWeatherMap");
const WeatherData = require("../models/WeatherData");

async function getFormattedWeatherData(options) {
  let weatherData;
  if (options.city) {
    weatherData = await openWeatherMap.getCurrentWeatherByCity(options.city);
  } else if (options.lat && options.lon) {
    weatherData = await openWeatherMap.getCurrentWeatherByCoords(
      options.lat,
      options.lon
    );
  } else {
    throw new Error("Invalid input: Provide either city or lat/lon.");
  }

  const formattedData = {
    city: weatherData.name,
    country: weatherData.sys.country,
    temperature: weatherData.main.temp,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
    timestamp: new Date(),
  };

  if (WeatherData) {
    const newWeatherData = new WeatherData({
      city: formattedData.city,
      latitude: weatherData.coord.lat,
      longitude: weatherData.coord.lon,
      temperature: formattedData.temperature,
      humidity: formattedData.humidity,
      windSpeed: formattedData.windSpeed,
    });
    await newWeatherData.save();
  }

  return formattedData;
}

async function getFormattedSevenDayForecast(lat, lon) {
  const forecastData = await openWeatherMap.getSevenDayForecast(lat, lon);

  const formattedForecast = forecastData.daily.slice(0, 7).map((day) => ({
    date: new Date(day.dt * 1000).toDateString(),
    minTemp: day.temp.min,
    maxTemp: day.temp.max,
    description: day.weather[0].description,
    icon: day.weather[0].icon,
  }));
  return formattedForecast;
}

async function getHistoricalWeatherData(city, hours) {
  if (!WeatherData) {
    throw new Error("Database not configured for historical data.");
  }
  const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);
  const historicalData = await WeatherData.find({
    city: new RegExp(`^${city}$`, "i"),
    timestamp: { $gte: cutoffDate },
  }).sort({ timestamp: 1 });
  return historicalData;
}

module.exports = {
  getFormattedWeatherData,
  getFormattedSevenDayForecast,
  getHistoricalWeatherData,
};
