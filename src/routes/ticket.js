// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const { purchaseTicket } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

// Route to purchase a ticket
router.post('/purchase-ticket', protect, purchaseTicket);

module.exports = router;
