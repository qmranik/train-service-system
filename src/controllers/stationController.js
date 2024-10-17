// controllers/stationController.js
const Station = require('../models/station');


// @route POST /api/stations
const createStation = async (req, res) => {
  const { name, location, code } = req.body;

  // Validate that all required fields are provided
  if (!name || !location || !code) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const stationExists = await Station.findOne({ name });
  if (stationExists) {
    return res.status(400).json({ message: 'Station already exists' });
  }

  // Create a new station
  const station = new Station({
    name,
    location,
    code,
  });

  try {
    const savedStation = await station.save();
    res.status(201).json(savedStation);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create station', error: error.message });
  }
};

// @route GET /api/stations
const getStations = async (req, res) => {
  try {
    const stations = await Station.find({});
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve stations', error: error.message });
  }
};

// @route PUT /api/stations/:id
const updateStation = async (req, res) => {
  const { id } = req.params;
  const { name, location, code } = req.body;

  try {
    const station = await Station.findById(id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    station.name = name || station.name;
    station.location = location || station.location;
    station.code = code || station.code;

    const updatedStation = await station.save();
    res.status(200).json(updatedStation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update station', error: error.message });
  }
};

module.exports = {
  createStation,
  getStations,
  updateStation,
};
