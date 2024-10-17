// models/trainModel.js
const mongoose = require('mongoose');

// Define the Stop schema for the train stops
const stopSchema = mongoose.Schema({
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station', 
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
});

const trainSchema = mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      unique: true, 
    },
    name: {
      type: String,
      required: true,
    },
    stops: [stopSchema], 
  },
  { timestamps: true } 
);

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
