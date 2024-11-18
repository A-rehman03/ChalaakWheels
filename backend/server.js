const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const Grid = require('gridfs-stream');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

let gfs;
mongoose.connection.once('open', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('GridFS connected');
});

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ChalakWheels';

// GridFS storage configuration with error handling
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => ({
        filename: `file_${Date.now()}_${file.originalname}`,
        bucketName: 'uploads', // Collection name in MongoDB
    }),
});
storage.on('connection', (db) => {
    console.log('Connected to GridFS for file storage.');
});
storage.on('error', (error) => {
    console.error('GridFS Storage error:', error);
});

const upload = multer({ storage });

// Basic route
app.get('/', (req, res) => {
    res.send('ChalakWheels API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes);

// Route to handle file uploads to GridFS
app.post('/api/upload', upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    const fileIds = req.files.map(file => file.id); // Collect all file IDs
    res.status(201).json({ fileIds, message: 'Files uploaded successfully' });
});

// Route to get an image by ID from GridFS
app.get('/api/images/:id', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        if (!file || !file.contentType.startsWith('image/')) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const readstream = gfs.createReadStream(file._id);
        res.set('Content-Type', file.contentType);
        readstream.pipe(res);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
