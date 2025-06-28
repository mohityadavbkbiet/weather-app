const { Server } = require("socket.io");
const weatherService = require("../services/weatherService");

let io;
const clients = new Map();
let updateInterval;

function initSocketIO(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    clients.set(socket.id, { location: null, socket: socket });

    socket.on("subscribeToWeather", async (payload) => {
      console.log(`Client ${socket.id} attempting to subscribe to:`, payload);
      const { city, lat, lon } = payload;
      if (city || (lat && lon)) {
        const location = { city, lat: parseFloat(lat), lon: parseFloat(lon) };
        clients.set(socket.id, { location: location, socket: socket });
        console.log(
          `Client ${socket.id} subscribed to: ${city || `${lat},${lon}`}`
        );

        await sendWeatherUpdateToClient(socket, location);
      } else {
        socket.emit("weatherError", {
          message:
            "Invalid subscription request. Please provide city or lat/lon.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      clients.delete(socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });
  });

  console.log("Socket.IO server initialized.");
}

async function sendWeatherUpdateToClient(socket, location) {
  try {
    const weatherData = await weatherService.getFormattedWeatherData(location); // Fetches and saves data
    socket.emit("weatherUpdate", weatherData);
    console.log(
      `Sent current weather update to ${socket.id} for ${
        location.city || `${location.lat},${location.lon}`
      }`
    );

    // If 7-day forecast is a bonus and requested, you can send it here too
    if (location.lat && location.lon) {
      const forecastData = await weatherService.getFormattedSevenDayForecast(
        location.lat,
        location.lon
      );
      socket.emit("forecastUpdate", forecastData); //
      console.log(
        `Sent forecast update to ${socket.id} for ${
          location.city || `${location.lat},${location.lon}`
        }`
      );
    }
  } catch (error) {
    console.error("Error sending weather update to client:", error.message);
    socket.emit("weatherError", {
      message: "Could not fetch weather data for this location.",
    });
  }
}

async function broadcastWeatherUpdates() {
  console.log("Broadcasting weather updates to all subscribed clients...");
  for (let [id, clientInfo] of clients.entries()) {
    const socket = clientInfo.socket;
    const location = clientInfo.location;
    if (location && socket.connected) {
      await sendWeatherUpdateToClient(socket, location);
    }
  }
}

function startBroadcasting(intervalMinutes = 5) {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  updateInterval = setInterval(
    broadcastWeatherUpdates,
    intervalMinutes * 60 * 1000
  );
  console.log(`Weather updates broadcasting every ${intervalMinutes} minutes.`);
}

module.exports = {
  initSocketIO,
  startBroadcasting,
  io,
};
