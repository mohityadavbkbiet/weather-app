const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get("/weather", weatherController.getCurrentWeather); //
router.get("/forecast", weatherController.getSevenDayForecast); //
router.get("/report", weatherController.downloadReport); //

module.exports = router;
