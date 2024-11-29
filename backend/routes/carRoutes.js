const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { createCar, getCars, getCarById, updateCar, deleteCar } = require('../controllers/carController');
const authMiddleware = require('../middlewares/authMiddleware');
const Car = require('../models/Car'); 
const router = express.Router();

// Setup multer to handle incoming image files and convert them to Base64 format
const storage = multer.memoryStorage(); // Store images in memory temporarily
const upload = multer({ storage });

// Create a new car listing (protected route with image upload)
router.post('/', authMiddleware, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // Convert uploaded files to Base64 and store in the imageUrls array
    const imageUrls = req.files.map(file => {
      const base64String = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64String}`;
    });

    // Add the Base64 images to the body for createCar
    req.body.images = imageUrls;

    // Call the createCar controller
    await createCar(req, res);
  } catch (error) {
    next(error);
  }
});
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Find cars that belong to the logged-in user (req.user.id)
    const cars = await Car.find({ user: new mongoose.Types.ObjectId(req.user.id) });

    // If no cars are found
    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: 'No cars found for this user.' });
    }

    // Return the list of cars
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cars for the dashboard.' });
  }
});
// Get all car listings
router.get('/', getCars);

// Get a specific car listing by ID
router.get('/:id', getCarById);

// Update a car listing (protected route)
router.put('/:id', authMiddleware, updateCar);

// Delete a car listing (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ error: 'Car not found or not owned by you.' });
    res.status(200).json({ message: 'Car deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete car.' });
  }
});

module.exports = router;
