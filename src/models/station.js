// models/stationModel.js
const mongoose = require('mongoose');

// Station Schema
const stationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
    },
    location: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true, 
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Station', stationSchema);
