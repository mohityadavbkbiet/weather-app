# WeatherLive: Real-Time Weather Application

This project is a real-time weather application with a React frontend and a Node.js backend. It provides current weather updates, a 7-day forecast, and the ability to download historical weather data.

## Features

*   **Real-Time Weather Updates:** Uses Socket.IO to deliver real-time weather information.
*   **Search by City or Geolocation:** Get weather information for any city or use your current location.
*   **7-Day Forecast:** View the weather forecast for the next seven days.
*   **Download Historical Data:** Download a JSON report of historical weather data for a specified city and time range.
*   **MongoDB Integration:** Stores historical weather data for reporting.

## Project Structure

The project is divided into two main parts:

*   `weather-live-client`: The React frontend that displays the weather information.
*   `weather-live-backend`: The Node.js/Express backend that serves the weather data and handles real-time updates.

## Getting Started

### Prerequisites

*   Node.js and npm installed
*   MongoDB installed and running (optional, for historical data)
*   An OpenWeatherMap API key

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mohityadavbkbiet/weather-app.git
    cd weather-app
    ```

2.  **Backend Setup:**
    *   Navigate to the backend directory:
        ```bash
        cd weather-live-backend
        ```
    *   Install the dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `weather-live-backend` directory and add the following environment variables:
        ```
        PORT=3000
        MONGO_URI=<your-mongodb-connection-string>
        OPENWEATHERMAP_API_KEY=<your-openweathermap-api-key>
        ```
    *   Start the backend server:
        ```bash
        npm start
        ```

3.  **Frontend Setup:**
    *   Navigate to the frontend directory:
        ```bash
        cd ../weather-live-client
        ```
    *   Install the dependencies:
        ```bash
        npm install
        ```
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```

### Usage

1.  Open your browser and go to `http://localhost:5173` (or the port specified by Vite).
2.  Enter a city name in the search bar and click "Get Weather" or click "Use My Location" to get weather information.
3.  To download historical data, enter a city name, select a time range, and click "Download Report".

