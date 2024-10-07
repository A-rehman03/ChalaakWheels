const express = require('express');
const { registerUser, verifyOTP, loginUser } = require('../controllers/authController');
const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.post('/verify-otp', verifyOTP); // Add this line

module.exports = router;
