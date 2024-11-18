const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const { createCar, getCars, getCarById, updateCar, deleteCar } = require('../controllers/carController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Configure GridFS storage for file uploads
const storage = new GridFsStorage({
  db: mongoose.connection, // Use the mongoose connection directly
  file: (req, file) => ({
    filename: `file_${Date.now()}_${file.originalname}`,
    bucketName: 'uploads', // Collection name in MongoDB
  }),
});

// Initialize multer with GridFS storage
const upload = multer({ storage });

// Create a new car listing (protected route with image upload)
router.post('/', authMiddleware, upload.array('images', 5), async (req, res, next) => {
  try {
    // Extract file IDs from the uploaded images
    const imageIds = req.files.map((file) => file.id);

    // Add image IDs to req.body to be handled in createCar
    req.body.imageIds = imageIds;

    // Call the createCar controller
    await createCar(req, res);
  } catch (error) {
    next(error);
  }
});

// Get all car listings
router.get('/', getCars);
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ sellerId: req.user.id });
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cars.' });
  }
});

// Get a specific car listing by ID
router.get('/:id', getCarById);

// Update a car listing (protected route)
router.put('/:id', authMiddleware, updateCar);

// Delete a car listing (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
    if (!car) return res.status(404).json({ error: 'Car not found or not owned by you.' });
    res.status(200).json({ message: 'Car deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete car.' });
  }
});
module.exports = router;
