import React from 'react';

// No Chart.js imports or registration here

const ForecastDisplay = ({ forecast }) => {
    if (!forecast || forecast.length === 0) {
        return <div className="forecast-display">No 7-day forecast available.</div>;
    }

    return (
        <div className="forecast-display">
            <h3>7-Day Forecast</h3>
            <div className="forecast-grid">
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <p className="date">{day.date}</p>
                        <img src={`http://openweathermap.org/img/wn/${day.icon}.png`} alt={day.description} />
                        <p>Min: {day.minTemp}°C</p>
                        <p>Max: {day.maxTemp}°C</p>
                    </div>
                ))}
            </div>
           
        </div>
    );
};

export default ForecastDisplay;