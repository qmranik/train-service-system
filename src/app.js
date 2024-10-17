const express = require("express");
const { connectDB } = require("./config/db");

const userRoutes = require("./routes/user");
const stationRoutes = require("./routes/stations");
const trainRoutes = require("./routes/trains");
const walletRoutes = require("./routes/wallet");
const ticketRoutes = require("./routes/ticket");

require("dotenv").config();
const scheduleReminders = require("./services/scheduler");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/tickets", ticketRoutes);

scheduleReminders();

module.exports = app;
