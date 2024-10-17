// controllers/trainController.js
const Train = require('../models/train');
const Station = require('../models/station');

// @route POST /api/trains
const createTrain = async (req, res) => {
  const { trainNumber, name, stops } = req.body;

  if (!trainNumber || !name || !stops || !Array.isArray(stops) || stops.length === 0) {
    return res.status(400).json({ message: 'Please provide valid train information including stops' });
  }

  const trainExists = await Train.findOne({ trainNumber });
  if (trainExists) {
    return res.status(400).json({ message: 'Train with this number already exists' });
  }

  for (const stop of stops) {
    const station = await Station.findById(stop.station);
    if (!station) {
      return res.status(400).json({ message: `Station with ID ${stop.station} not found` });
    }
  }

  // Create a new train
  const train = new Train({
    trainNumber,
    name,
    stops,
  });

  try {
    const savedTrain = await train.save();
    res.status(201).json(savedTrain);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create train', error: error.message });
  }
};

// @route GET /api/trains
const getTrains = async (req, res) => {
  try {
    const trains = await Train.find({}).populate('stops.station', 'name location code'); // Populate station details
    res.status(200).json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve trains', error: error.message });
  }
};

// @route PUT /api/trains/:id
const updateTrain = async (req, res) => {
  const { id } = req.params;
  const { trainNumber, name, stops } = req.body;

  try {
    const train = await Train.findById(id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Update train details
    train.trainNumber = trainNumber || train.trainNumber;
    train.name = name || train.name;

    // Validate and update stops
    if (stops && Array.isArray(stops) && stops.length > 0) {
      for (const stop of stops) {
        const station = await Station.findById(stop.station);
        if (!station) {
          return res.status(400).json({ message: `Station with ID ${stop.station} not found` });
        }
      }
      train.stops = stops;
    }

    const updatedTrain = await train.save();
    res.status(200).json(updatedTrain);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update train', error: error.message });
  }
};

module.exports = {
  createTrain,
  getTrains,
  updateTrain,
};
