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
});

// GridFS storage configuration
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return {
            filename: `file_${Date.now()}_${file.originalname}`,
            bucketName: 'uploads' // Collection name in MongoDB
        };
    }
});

const upload = multer({ storage });

// Basic route
app.get('/', (req, res) => {
    res.send('ChalakWheels API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes); // Add the messages route

// Route to handle file uploads to GridFS
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(201).json({ fileId: req.file.id, message: 'File uploaded successfully' });
});

// Route to get an image by ID from GridFS
app.get('/api/images/:id', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

        if (!file || !file.contentType.startsWith('image/')) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Stream the image file from GridFS
        const readstream = gfs.createReadStream(file._id);
        res.set('Content-Type', file.contentType);
        readstream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
