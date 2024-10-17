
# Train Service Management System

## Overview
This is a backend system for managing train services, including user management, station management, train scheduling, wallet integration, and a ticketing system. The system is built using Node.js, Express, and MongoDB.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Scheduling Mechanism](#scheduling-mechanism)
- [Assumptions and Simplifications](#assumptions-and-simplifications)
- [Contributing](#contributing)
- [License](#license)

## Features
- User Management (registration, login, JWT authentication)
- Station Management (create, update, retrieve stations)
- Train Management (create, update, retrieve train schedules)
- Wallet Integration (add funds, retrieve wallet balance)
- Ticketing System (purchase tickets and calculate fares)
- Scheduling Mechanism (reminders for upcoming train departures)

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt
- Node-cron
- Nodemailer (for sending email reminders)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Postman (for API testing)

### Installation
1. **Clone the repository.**
  

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-email-password>
   ```

## Running the Project
To start the application, use the following command:
```bash
npm start
```
This will start the server on the specified PORT (default is 5000). You can access the API at `http://localhost:5000`.

For development, you can use Nodemon to automatically restart the server upon changes:
```bash
npm run dev
```

## Running Tests
To run the tests, execute the following command:
```bash
npm test
```
This command will run all the test cases defined in the project. To run test you can use:
```bash
npm test
```
This helps identify any asynchronous operations that might not be properly closed.

## API Endpoints

### User Management
- **Register User:** `POST /api/auth/register`
- **Login User:** `POST /api/auth/login`

### Station Management
- **Create Station:** `POST /api/stations`
- **Update Station:** `PUT /api/stations/:id`
- **Retrieve Stations:** `GET /api/stations`

### Train Management
- **Create Train Schedule:** `POST /api/trains`
- **Update Train Schedule:** `PUT /api/trains/:id`
- **Retrieve Train Schedule:** `GET /api/trains`

### Wallet Integration
- **Add Funds to Wallet:** `POST /api/wallet/add`
- **Retrieve Wallet Balance:** `GET /api/wallet/balance`

### Ticketing System
- **Purchase Ticket:** `POST /api/tickets/purchase`

## Scheduling Mechanism
The system includes a scheduling mechanism that runs every hour to check for upcoming train schedules. The mechanism will notify users via email about their upcoming trains.

### How It Works:
- The scheduling mechanism is implemented using the `node-cron` library, which allows for the scheduling of tasks.
- The task checks the database for train schedules that are set to depart within the next hour.
- Users with upcoming train departures will receive email notifications, providing them with timely reminders.

### Setup for Scheduling:
To ensure the scheduling mechanism works correctly:
- Make sure to configure the email settings in the `.env` file, particularly the `EMAIL_USER` and `EMAIL_PASS` variables for sending email reminders.
- Start the application, and the scheduling will automatically initiate and run in the background.


## Assumptions and Simplifications
- Users must provide a valid email for registration, which is also used for sending reminders.
- The wallet balance is stored as a simple number; real-world applications may require more robust handling of financial transactions.
- The reminder system is set to check for train departures every hour; this can be adjusted for production.
- Email sending is configured using Nodemailer with a Gmail account; ensure less secure app access is enabled for testing.
- The project does not include frontend integration; it's focused solely on the backend functionality.

### Key Additions:
- **Running the Project** section provides instructions on how to start the application and use Nodemon for development.
- **Running Tests** section explains how to execute tests and troubleshoot open handles with Jest.
