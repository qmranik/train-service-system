// routes/walletRoutes.js
const express = require('express');
const router = express.Router();
const { addFunds, getWalletDetails, debitFunds } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

// Route to add funds to wallet
router.post('/add-funds', protect, addFunds);

// Route to get wallet details (balance and transaction history)
router.get('/', protect, getWalletDetails);

module.exports = router;
