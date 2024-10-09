const express = require('express');
const { registerUser, loginUser,verifyOTP, resendOTP } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser); // Register user and send OTP
router.post('/login', loginUser);       // Login with OTP
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);  // Resend OTP if needed

module.exports = router;
