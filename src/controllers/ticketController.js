const User = require("../models/user");
const Train = require("../models/train");
const Ticket = require("../models/ticket");

// Calculate fare based on train stops (distance)
const calculateFare = (trainStops, userStop) => {
  // Example fare calculation logic based on the number of stops
  const farePerStop = 10; // Assuming $10 per stop
  const stopsCount = trainStops.length; // Total stops
  return stopsCount * farePerStop;
};

// Purchase ticket
exports.purchaseTicket = async (req, res) => {
  const { trainId, userStop } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const train = await Train.findById(trainId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    const fare = calculateFare(train.stops, userStop);

    if (user.balance < fare) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    user.balance -= fare;

    user.transactionHistory.push({
      amount: fare,
      type: "debit",
    });

    await user.save();

    const newTicket = new Ticket({
      user: user._id,
      train: train._id,
      fare,
    });

    await newTicket.save();

    res
      .status(201)
      .json({ message: "Ticket purchased successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ error: "Error purchasing ticket" });
  }
};
