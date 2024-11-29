const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();

// Create an HTTP server and attach Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ChalakWheels';
connectDB(mongoURI);

// Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

const ImageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: String, // Store Base64 string
});

const Image = mongoose.model('Image', ImageSchema);

// Basic route
app.get('/', (req, res) => {
  res.send('ChalakWheels API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes);

// Route to handle file uploads
app.post('/api/upload', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const base64Data = file.buffer.toString('base64');
        const newImage = new Image({
          filename: file.originalname,
          contentType: file.mimetype,
          data: base64Data,
        });
        await newImage.save();
        return newImage._id;
      })
    );

    res.status(201).json({ fileIds: uploadedImages, message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Socket.io Authentication Middleware
let userSockets = {};  // Track active socket connections per user

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.user = decoded;  // Store user data in socket
    userSockets[decoded._id] = socket.id;  // Track socket ID for the user
    next();
  });
});

// Set up socket events
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Listen for incoming messages and emit to the seller or buyer
  socket.on('send_message', (messageData) => {
    const { receiverId } = messageData;
    if (userSockets[receiverId]) {
      io.to(userSockets[receiverId]).emit('receive_message', messageData);  // Send to specific user (buyer/seller)
    }
  });

  // Disconnect event - remove the user from the tracking list
  socket.on('disconnect', () => {
    if (socket.user && socket.user._id) {
      delete userSockets[socket.user._id];  // Remove user from tracking on disconnect
    }
    console.log('A user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
