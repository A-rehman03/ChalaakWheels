const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateOTP = require('../utils/generateOTP'); // Your OTP generator
const sendEmail = require('../utils/sendEmail'); 

// Register a new user
const registerUser = async (req, res) => {
  console.log("Request received:", req.body);  // Log request body
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP and save new user with OTP
    const otp = generateOTP();
    user = new User({
      name,
      email,
      password: hashedPassword,
      otp,  // Store generated OTP
      otpExpiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });

    await user.save();

    // Send OTP via email
    await sendEmail(email, otp);
  
    res.status(200).json({ message: 'User registered, OTP sent to email' });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// OTP verification route
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email and verify OTP
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // OTP is valid, clear the OTP
    user.otp = undefined;
    user.otpExpiry = undefined;  // Remove OTP expiry after verification
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Validate OTP
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Clear OTP and generate JWT after successful login
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate a new OTP and update the user
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();

    // Send new OTP via email
    await sendEmail(email, otp);

    res.status(200).json({ msg: 'OTP resent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  resendOTP,
};
