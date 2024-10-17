const cron = require('node-cron');
const Train = require('../models/train'); // Import the Train model
const User = require('../models/user');   // Import the User model
const sendReminder = require('../utils/reminder'); // Utility to send reminders (you'll create this)

const scheduleReminders = () => {
  // This corn job will run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled job: Checking for upcoming trains');

    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Find trains departing within the next hour
      const upcomingTrains = await Train.find({
        'stops.time': { $gte: now, $lte: oneHourFromNow }
      });

      // For each train, find all users who have tickets
      for (const train of upcomingTrains) {
        const usersWithTickets = await User.find({ 'tickets.train': train._id });

        for (const user of usersWithTickets) {
          // Send a reminder to each user
          await sendReminder(user.email, train);
        }
      }

      console.log('Reminders sent for upcoming trains');
    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  });
};

module.exports = scheduleReminders;
