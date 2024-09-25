const express = require('express');
const { createCar, getCars, getCarById, updateCar, deleteCar } = require('../controllers/carController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new car listing (protected route)
router.post('/', authMiddleware, createCar);

// Get all car listings
router.get('/', getCars);

// Get a specific car listing by ID
router.get('/:id', getCarById);

// Update a car listing (protected route)
router.put('/:id', authMiddleware, updateCar);

// Delete a car listing (protected route)
router.delete('/:id', authMiddleware, deleteCar);

module.exports = router;