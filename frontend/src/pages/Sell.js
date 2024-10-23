import React, { useState } from 'react';
import axios from 'axios';
import './Sell.css';

const Sell = () => {
  const [carDetails, setCarDetails] = useState({
    model: '',
    price: '',
    year: '',
    location: '',
  });

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/cars', carDetails);
      alert('Car listed successfully!');
    } catch (error) {
      console.error(error.response.data);
      alert('Failed to list the car');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>List Your Car</h2>
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={carDetails.model}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={carDetails.price}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="year"
        placeholder="Year"
        value={carDetails.year}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={carDetails.location}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Sell;
