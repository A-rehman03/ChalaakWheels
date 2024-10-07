const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate and send OTP
    const otp = generateOTP();
    await sendEmail(email, otp);
    
    // Store OTP in the user document or in-memory storage (for simplicity)
    user.otp = otp;
    await user.save();
    res.status(200).json({ message: 'User registered, OTP sent to email' });
    
    // Return JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });  // Return error as JSON
  }
};

// OTP verification route
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user || user.otp !== otp) {
          return res.status(400).json({ msg: 'Invalid OTP' });
      }

      // OTP is valid, clear it or handle accordingly
      user.otp = undefined; // Clear the OTP
      await user.save();

      res.status(200).json({ message: 'OTP verified, login successful' });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const otp = generateOTP();
        await sendEmail(email, otp);
        
        // Store OTP in the user document or in-memory storage (for simplicity)
        user.otp = otp;
        await user.save();

        res.status(200).json({ message: 'Login successful, OTP sent to email' });


    // Return JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
};
