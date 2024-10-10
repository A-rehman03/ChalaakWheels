const express = require('express');
const { registerUser, verifyOTP, loginUser, resendOTP } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser); // Register user and send OTP
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);  // Make sure this route is included
router.post('/resend-otp', resendOTP);  // Resend OTP if needed

module.exports = router;
