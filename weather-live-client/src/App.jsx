import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";

import CurrentWeather from "./components/CurrentWeather.jsx";
import ForecastDisplay from "./components/ForecastDisplay.jsx";
import ReportDownload from "./components/ReportDownload.jsx";
import "./App.css";

// Backend URL and Socket.IO URL
const API_BASE_URL = "http://localhost:3000/api";
const SOCKET_SERVER_URL = "http://localhost:3000";
function App() {
  const [cityInput, setCityInput] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setError("");
    });

    socketRef.current.on("weatherUpdate", (data) => {
      console.log("Received real-time weather update:", data);
      setCurrentWeather(data);
      setLoading(false);
    });

    socketRef.current.on("forecastUpdate", (data) => {
      console.log("Received real-time forecast update:", data);
      setForecast(data);
    });

    socketRef.current.on("weatherError", (data) => {
      console.error("Weather error:", data.message);
      setError(data.message);
      setCurrentWeather(null);
      setForecast([]);
      setLoading(false);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setError("Disconnected from server. Attempting to reconnect...");
      setCurrentWeather(null);
      setForecast([]);
      setLoading(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const subscribeToWeather = useCallback((location) => {
    if (socketRef.current && socketRef.current.connected) {
      setError("");
      setLoading(true);
      setCurrentWeather(null);
      setForecast([]);
      socketRef.current.emit("subscribeToWeather", location);
    } else {
      setError("Not connected to the server. Please refresh or check backend.");
      setLoading(false);
    }
  }, []);

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      subscribeToWeather({ city: cityInput.trim() });
      setCityInput("");
    } else {
      setError("Please enter a city name.");
    }
  };

  const handleGeolocation = () => {
    setError("");
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          subscribeToWeather({ lat: latitude, lon: longitude });
        },
        (geoError) => {
          console.error("Geolocation error:", geoError);
          setError("Geolocation failed: " + geoError.message);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WeatherLive: Real-Time Weather Updates</h1>
      </header>

      <main>
        <div className="search-section">
          <form onSubmit={handleCitySearch}>
            <input
              type="text"
              placeholder="Enter city name"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />
            <button type="submit">Get Weather</button>
          </form>
          <button onClick={handleGeolocation} className="geolocation-button">
            Use My Location
          </button>
        </div>

        {loading && <p className="loading-message">Fetching weather data...</p>}
        {error && <p className="error-message">{error}</p>}

        {currentWeather && (
          <section className="weather-display">
            <CurrentWeather data={currentWeather} />
            {forecast.length > 0 && <ForecastDisplay forecast={forecast} />}
          </section>
        )}

        <section className="report-section">
          <h2>Download Historical Report</h2>
          <ReportDownload />
        </section>
      </main>
    </div>
  );
}

export default App;
