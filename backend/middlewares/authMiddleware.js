const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const verifyToken = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log("Authorization Header:", authHeader); // Debugging: Check the authorization header

    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : null;

    if (!token) {
      console.log("No token found in header."); // Debugging: No token
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    const user = await User.findById(decoded.user.id);
    if (!user) {
      console.log("No user found for this token."); // Debugging: No matching user
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error); // Debugging: Catch error details
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
