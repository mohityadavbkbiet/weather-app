const weatherService = require("../services/weatherService");

async function getCurrentWeather(req, res) {
  const { city, lat, lon } = req.query;
  if (!city && (!lat || !lon)) {
    return res
      .status(400)
      .json({ error: "Please provide a city name or latitude and longitude." });
  }

  try {
    const weatherData = await weatherService.getFormattedWeatherData({
      city,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });
    res.json(weatherData);
  } catch (error) {
    console.error("Error in getCurrentWeather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
}

async function getSevenDayForecast(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Please provide latitude and longitude for forecast." });
  }

  try {
    const forecastData = await weatherService.getFormattedSevenDayForecast(
      parseFloat(lat),
      parseFloat(lon)
    );
    res.json(forecastData);
  } catch (error) {
    console.error("Error in getSevenDayForecast:", error.message);
    res.status(500).json({ error: "Failed to fetch 7-day forecast data." });
  }
}

async function downloadReport(req, res) {
  const { city, hours } = req.query;
  if (!city || !hours || isNaN(parseInt(hours))) {
    return res.status(400).json({
      error:
        "Please provide a city and a valid number of hours for the report.",
    });
  }

  try {
    const historicalData = await weatherService.getHistoricalWeatherData(
      city,
      parseInt(hours)
    );
    if (historicalData.length === 0) {
      return res.status(404).json({
        message: "No historical data found for the given city and period.",
      });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=weather_report_${city}_${hours}h.json`
    );
    res.json(historicalData);
  } catch (error) {
    console.error("Error in downloadReport:", error.message);
    res.status(500).json({ error: "Failed to generate historical report." });
  }
}

module.exports = {
  getCurrentWeather,
  getSevenDayForecast,
  downloadReport,
};
