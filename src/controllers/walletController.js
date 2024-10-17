// controllers/walletController.js
const Wallet = require('../models/wallet');
const Ticket = require('../models/ticket');
const Train = require('../models/train');
const User = require('../models/user');

// Helper function to calculate fare based on train stops
const calculateFare = (origin, destination, stops) => {
  const originIndex = stops.findIndex((stop) => stop.station === origin);
  const destinationIndex = stops.findIndex((stop) => stop.station === destination);

  if (originIndex === -1 || destinationIndex === -1 || originIndex >= destinationIndex) {
    throw new Error('Invalid origin or destination');
  }

  // Simple fare calculation based on the number of stops between origin and destination
  const fare = (destinationIndex - originIndex) * 10; // Example: 10 units per stop
  return fare;
};

// @route POST /api/wallet/add-funds
const addFunds = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id; // Assume user is authenticated and available in req.user

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Please provide a valid amount' });
  }

  try {
    let wallet = await Wallet.findOne({ user: userId });

    // If no wallet exists, create one
    if (!wallet) {
      wallet = new Wallet({
        user: userId,
        balance: 0,
        transactionHistory: [],
      });
    }

    // Add funds to the wallet balance
    wallet.balance += amount;

    // Record transaction
    wallet.transactionHistory.push({
      transactionType: 'CREDIT',
      amount,
      description: 'Funds added',
    });

    await wallet.save();
    res.status(200).json({ message: 'Funds added successfully', wallet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add funds', error: error.message });
  }
};

// @route GET /api/wallet
const getWalletDetails = async (req, res) => {
  const userId = req.user._id;

  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({
      balance: wallet.balance,
      transactionHistory: wallet.transactionHistory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve wallet details', error: error.message });
  }
};

// @route POST /api/wallet/purchase-ticket
const purchaseTicket = async (req, res) => {
  const { trainId, origin, destination } = req.body;
  const userId = req.user._id;

  try {
    // Find the train and its stops
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    const fare = calculateFare(origin, destination, train.stops);

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balance < fare) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    wallet.balance -= fare;

    wallet.transactionHistory.push({
      transactionType: 'DEBIT',
      amount: fare,
      description: `Ticket purchase from ${origin} to ${destination}`,
    });

    await wallet.save(); 
    
    const ticket = new Ticket({
      user: userId,
      train: trainId,
      origin,
      destination,
      fare,
    });

    await ticket.save(); 

    res.status(201).json({ message: 'Ticket purchased successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Ticket purchase failed', error: error.message });
  }
};


module.exports = {
  addFunds,
  getWalletDetails,
  purchaseTicket,
};
