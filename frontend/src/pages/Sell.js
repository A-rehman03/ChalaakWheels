// Sell.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Sell.css';

const Sell = () => {
  const [carDetails, setCarDetails] = useState({
    title: '',
    model: '',
    price: '',
    year: '',
    location: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // Store selected files as an array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    // Create FormData and append fields
    const formData = new FormData();
    formData.append('title', carDetails.title);
    formData.append('model', carDetails.model);
    formData.append('price', carDetails.price);
    formData.append('year', carDetails.year);
    formData.append('location', carDetails.location);
    formData.append('description', carDetails.description);

    // Append each image to FormData
    images.forEach((image) => formData.append('images', image));

    try {
      await axios.post('http://localhost:5000/api/cars', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Car listed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setError('Failed to list the car. Please try again.');
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      }
    }
  };

  return (
    <div className="sell-page">
      <h2>List Your Car</h2>
      <form onSubmit={handleSubmit} className="sell-form">
        <input type="text" name="title" placeholder="Title" value={carDetails.title} onChange={handleChange} required />
        <input type="text" name="model" placeholder="Model" value={carDetails.model} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={carDetails.price} onChange={handleChange} required />
        <input type="number" name="year" placeholder="Year" value={carDetails.year} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={carDetails.location} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={carDetails.description} onChange={handleChange} required />
        <input type="file" name="images" multiple onChange={handleImageChange} accept="image/*" required />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Sell;