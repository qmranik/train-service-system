const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db'); // Use the same DB connection as in train.test.js
const User = require('../models/user');

// Connect to the shared database before running all tests
beforeAll(async () => {
  await connectDB();
}, 30000); // Increase timeout if needed

// Clean up the User collection before each test to avoid interference between tests
beforeEach(async () => {
  await User.deleteMany({});
});

// Disconnect from the database after all tests have finished
afterAll(async () => {
  await disconnectDB();
}, 30000); // Increase timeout if needed

describe('User Registration and Login', () => {

  // Test registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Test User');
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).toHaveProperty('token');
  });

  // Test trying to register a user with an existing email
  it('should not register a user with an existing email', async () => {
    // Register a user first
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    // Try to register the same user again
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  // Test login
  it('should login a registered user', async () => {
    // Register a user first
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    // Now log in with the same user
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Test User');
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).toHaveProperty('token');
  });

  // Test login with invalid credentials
  it('should not login with invalid credentials', async () => {
    // Attempt to log in with an unregistered user
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
});



// const request = require('supertest');
// const app = require('../app');
// const { connectDB, disconnectDB } = require('../config/db'); // Use the same DB connection as in train.test.js
// const User = require('../models/user');

// beforeAll(async () => {
//   // Connect to the shared database
//   await connectDB();
// });

// beforeEach(async () => {
//   // Clean up the User collection before each test
//   await User.deleteMany({});
// });

// afterAll(async () => {
//   // Disconnect from the database after all tests
//   await disconnectDB();
// });

// describe('User Registration and Login', () => {

//   // Test registration
//   it('should register a new user', async () => {
//     const res = await request(app)
//       .post('/api/auth/register')
//       .send({
//         name: 'Test User',
//         email: 'test@example.com',
//         password: 'password123',
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('_id');
//     expect(res.body).toHaveProperty('name', 'Test User');
//     expect(res.body).toHaveProperty('email', 'test@example.com');
//     expect(res.body).toHaveProperty('token');
//   });

//   it('should not register a user with an existing email', async () => {
//     // Register a user first
//     await request(app)
//       .post('/api/auth/register')
//       .send({
//         name: 'Test User',
//         email: 'test@example.com',
//         password: 'password123',
//       });

//     // Try to register the same user again
//     const res = await request(app)
//       .post('/api/auth/register')
//       .send({
//         name: 'Test User',
//         email: 'test@example.com',
//         password: 'password123',
//       });

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty('message', 'User already exists');
//   });

//   // Test login
//   it('should login a registered user', async () => {
//     // Register a user first
//     await request(app)
//       .post('/api/auth/register')
//       .send({
//         name: 'Test User',
//         email: 'test@example.com',
//         password: 'password123',
//       });

//     // Now log in with the same user
//     const res = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: 'test@example.com',
//         password: 'password123',
//       });

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty('_id');
//     expect(res.body).toHaveProperty('name', 'Test User');
//     expect(res.body).toHaveProperty('email', 'test@example.com');
//     expect(res.body).toHaveProperty('token');
//   });

//   it('should not login with invalid credentials', async () => {
//     // Attempt to log in with an unregistered user
//     const res = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: 'nonexistent@example.com',
//         password: 'wrongpassword',
//       });

//     expect(res.statusCode).toBe(401);
//     expect(res.body).toHaveProperty('message', 'Invalid email or password');
//   });
// });
