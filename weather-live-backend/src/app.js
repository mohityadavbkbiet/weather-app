// src/app.js
require("dotenv").config(); // Load environment variables
const express = require("express");
const http = require("http"); // Required for Socket.IO server
const mongoose = require("mongoose"); // For MongoDB connection
const weatherRoutes = require("./routes/weatherRoutes");
const { initSocketIO, startBroadcasting } = require("./utils/socket"); // Import Socket.IO utility

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// CORS (Cross-Origin Resource Sharing) - essential for frontend to communicate
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin for development
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// API Routes
app.use("/api", weatherRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
initSocketIO(server);

// Start broadcasting weather updates every X minutes (e.g., 5 minutes)
startBroadcasting(5); // Broadcasts every 5 minutes

// Database Connection (if using MongoDB)
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn(
    "MONGO_URI not set. Historical data download will not be available."
  );
}

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Socket.IO server running on ws://localhost:${port}`);
});
