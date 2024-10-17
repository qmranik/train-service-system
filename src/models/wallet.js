// models/walletModel.js
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  transactionType: {
    type: String,
    enum: ['CREDIT', 'DEBIT'], // CREDIT for adding funds, DEBIT for spending
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

// Define the Wallet schema
const walletSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  balance: {
    type: Number,
    default: 0, 
  },
  transactionHistory: [transactionSchema],
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
