// routes/stationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createStation, getStations, updateStation } = require('../controllers/stationController');

// Create a new station
router.post('/',protect, createStation);

// Get All stations
router.get('/', getStations);

// Update a station by ID
router.put('/:id', protect, updateStation);

module.exports = router;
