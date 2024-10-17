const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db'); // Import the DB connection functions

const Train = require('../models/train');
const Station = require('../models/station');
const User = require('../models/user');

let accessToken;

beforeAll(async () => {
  // Connect to the test database
  await connectDB();

  // Register a test user
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

  // Log in the user to get the access token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123',
    });

  accessToken = loginResponse.body.token; // Store the access token for future requests
});

afterAll(async () => {
  // Clean up the collections and close the database connection
  await Train.deleteMany({});
  await Station.deleteMany({});
  await User.deleteMany({});
  await disconnectDB(); // Disconnect from the database after tests
});

describe('Train API', () => {
  beforeEach(async () => {
    // Clear the Train and Station collections before each test to ensure isolation
    await Train.deleteMany({});
    await Station.deleteMany({});
  });

  it('should return 400 if train number is missing', async () => {
    const res = await request(app)
      .post('/api/trains')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fromStation: 'Station A',
        toStation: 'Station B',
        schedule: '2023-10-17T10:00:00Z',
      });

    expect(res.statusCode).toBe(400); // Expect a 400 error for missing train number
  });

  it('should return 400 if train with the same number exists', async () => {
    // First request to create a train with a train number
    await request(app)
      .post('/api/trains')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        trainNumber: '12345',
        fromStation: 'Station A',
        toStation: 'Station B',
        schedule: '2023-10-17T10:00:00Z',
      });

    // Second request with the same train number, which should trigger a 400 error
    const res = await request(app)
      .post('/api/trains')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        trainNumber: '12345', // Same train number as before
        fromStation: 'Station C',
        toStation: 'Station D',
        schedule: '2023-10-17T12:00:00Z',
      });

    expect(res.statusCode).toBe(400); // Expect a 400 error for duplicate train number
  });
});



// const mongoose = require('mongoose');
// const request = require('supertest');
// const app = require('../app');
// const { connectDB, disconnectDB } = require('../config/db'); // Correctly import connectDB

// const Train = require('../models/train');
// const Station = require('../models/station');
// const User = require('../models/user');

// let accessToken;

// beforeAll(async () => {
//   // Connect to the test database
//   await connectDB();

//   // Register a test user
//   await request(app)
//     .post('/api/auth/register')
//     .send({
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'password123',
//     });

//   // Log in the user to get the access token
//   const loginResponse = await request(app)
//     .post('/api/auth/login')
//     .send({
//       email: 'test@example.com',
//       password: 'password123',
//     });

//   accessToken = loginResponse.body.token; // Store the access token
// });

// afterAll(async () => {
//   // Clean up and close the connection
//   await Train.deleteMany({});
//   await Station.deleteMany({});
//   await User.deleteMany({});
//   await disconnectDB(); // Disconnect from DB after tests
// });

// describe('Train API', () => {
//   beforeEach(async () => {
//     // Clear the Train and Station collections before each test
//     await Train.deleteMany({});
//     await Station.deleteMany({});
//   });


//   it('should return 400 if train number is missing', async () => {
//     const res = await request(app)
//       .post('/api/trains')
//       .set('Authorization', `Bearer ${accessToken}`)
//       .send({
//         fromStation: 'Station A',
//         toStation: 'Station B',
//         schedule: '2023-10-17T10:00:00Z',
//       });

//     expect(res.statusCode).toBe(400);
//   });

//   it('should return 400 if train with the same number exists', async () => {
//     await request(app)
//       .post('/api/trains')
//       .set('Authorization', `Bearer ${accessToken}`)
//       .send({
//         trainNumber: '12345',
//         fromStation: 'Station A',
//         toStation: 'Station B',
//         schedule: '2023-10-17T10:00:00Z',
//       });

//     const res = await request(app)
//       .post('/api/trains')
//       .set('Authorization', `Bearer ${accessToken}`)
//       .send({
//         trainNumber: '12345', // Same train number
//         fromStation: 'Station C',
//         toStation: 'Station D',
//         schedule: '2023-10-17T12:00:00Z',
//       });

//     expect(res.statusCode).toBe(400);
//   });
// });
