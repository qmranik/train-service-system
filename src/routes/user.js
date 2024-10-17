const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Register a new User
router.post('/register', registerUser);
// Login registered User
router.post('/login', loginUser);

module.exports = router;
