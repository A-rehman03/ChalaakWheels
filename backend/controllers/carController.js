const Car = require('../models/Car');

// Create a new car listing
const createCar = async (req, res) => {
  try {
    const { title, model, price, year, location, description } = req.body;
    const images = req.files ? req.files.map(file => {
      // Convert image files to Base64
      const imageBuffer = file.buffer;
      const base64Image = imageBuffer.toString('base64');
      return `data:${file.mimetype};base64,${base64Image}`;
    }) : [];

    const newCar = new Car({
      title,
      model,
      price,
      year,
      location,
      description,
      images, // Store images as Base64 strings
      user: req.user.id, // Assuming you're storing the user ID
    });

    await newCar.save();
    res.status(201).json({ message: 'Car listed successfully!', car: newCar });
  } catch (error) {
    console.error('Error creating car listing:', error);
    res.status(500).json({ message: 'Failed to create car listing.' });
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

    if (images) {
      // Validate images
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ msg: 'At least one image is required' });
      }

      const validBase64Images = images.every((img) =>
        /^data:image\/(png|jpeg|jpg|gif);base64,/.test(img)
      );

      if (!validBase64Images) {
        return res.status(400).json({ msg: 'Invalid image format' });
      }

      car.images = images; // Update images
    }

    car.title = title || car.title;
    car.model = model || car.model;
    car.price = price || car.price;
    car.location = location || car.location;
    car.description = description || car.description;

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
