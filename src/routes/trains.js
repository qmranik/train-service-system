// routes/trainRoutes.js
const express = require('express');
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { createTrain, getTrains, updateTrain } = require('../controllers/trainController');

// Route to create a new train
router.post('/',protect, createTrain);

// Route to get all trains
router.get('/', getTrains);

// Route to update a train by ID
router.put('/:id',protect, updateTrain);

module.exports = router;
