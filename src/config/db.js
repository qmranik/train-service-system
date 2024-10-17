const mongoose = require('mongoose');

let isConnected;

const connectDB = async () => {
  if (isConnected) {
    return; // Connection already established
  }
  try {
    // Connecting to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connection.readyState === 1; // Connection established
    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false; // Update the connection state
    });
    mongoose.connection.on('error', (error) => {
      console.error(`MongoDB connection error: ${error}`);
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error('Database connection failed');
  }
};

// Method to disconnect from MongoDB
const disconnectDB = async () => {
  await mongoose.connection.close();
  isConnected = false; // Update the connection state
};

module.exports = {
  connectDB,
  disconnectDB,
};


// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     // Connecting to MongoDB
//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     console.log(`MongoDB connected: ${conn.connection.host}`);

//     mongoose.connection.on('disconnected', () => {
//       console.error('MongoDB disconnected');
//     });
//     mongoose.connection.on('error', (error) => {
//       console.error(`MongoDB connection error: ${error}`);
//     });

//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     throw new Error('Database connection failed');
//   }
// };

// // Method to disconnect from MongoDB
// const disconnectDB = async () => {
//     await mongoose.connection.close();
//   };
  
//   module.exports = {
//     connectDB,
//     disconnectDB,
//   };