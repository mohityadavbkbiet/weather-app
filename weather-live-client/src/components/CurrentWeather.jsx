import React from 'react';

const CurrentWeather = ({ data }) => {
    if (!data) {
        return <div className="current-weather">No current weather data available.</div>;
    }

    const { city, country, temperature, humidity, windSpeed, description, icon, timestamp } = data;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <div className="current-weather">
            <h3>Current Weather in {city}, {country}</h3>
            <div className="weather-details">
                <div className="weather-icon-description">
                    <img src={iconUrl} alt={description} />
                    <p className="description">{description}</p>
                </div>
                <div className="weather-stats">
                    <p>Temperature: {temperature}°C</p>
                    <p>Humidity: {humidity}%</p>
                    <p>Wind Speed: {windSpeed} m/s</p>
                </div>
            </div>
            <p className="last-updated">Last updated: {new Date(timestamp).toLocaleTimeString()}</p>
        </div>
    );
};

export default CurrentWeather;