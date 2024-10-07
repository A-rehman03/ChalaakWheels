const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const messageRoutes = require('./routes/messageRoutes');
const app = express();
const { registerUser, generateOTP , loginUser } = require('./controllers/authController');

// Load environment variables
dotenv.config();

// Initialize Express app


app.use(cors());
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('ChalakWheels API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes); // Add the messages route

app.post('/api/register', registerUser);  // Register route
app.post('/api/generateOTP', generateOTP); 
app.post('/api/login', loginUser);        // Login route

// Start server
//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors());
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
