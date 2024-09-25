const Car = require('../models/Car');

// Create a new car listing
const createCar = async (req, res) => {
  try {
    const { title, model, price, location, description, images } = req.body;

    const newCar = new Car({
      user: req.user.id, // Get user ID from auth middleware
      title,
      model,
      price,
      location,
      description,
      images,
    });

    const car = await newCar.save();
    res.json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all car listings
const getCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('user', 'name');
    res.json(cars);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a specific car listing by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('user', 'name');
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a car listing
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    // Check if the user updating is the owner
    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { title, model, price, location, description, images } = req.body;

    car.title = title || car.title;
    car.model = model || car.model;
    car.price = price || car.price;
    car.location = location || car.location;
    car.description = description || car.description;
    car.images = images || car.images;

    await car.save();
    res.json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a car listing
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    // Check if the user deleting is the owner
    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await car.remove();
    res.json({ msg: 'Car removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};