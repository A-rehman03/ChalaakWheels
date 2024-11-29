import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';  // Import socket.io-client
import './Buy.css';

// Create a socket connection and pass the token in the query
const socket = io('http://localhost:5000', {
  query: { token: localStorage.getItem('token') }  // Pass the token from localStorage
});

const Buy = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({ price: '', model: '', location: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars');
        setCars(response.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to fetch car listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }));
  };

  // Handle messaging seller
  const handleMessageSeller = (sellerId) => {
    if (!user || !user._id) {
      alert('You must be logged in to message a seller.');
      return;
    }
    if (!sellerId) {
      alert('Seller information is unavailable.');
      return;
    }

    // Emit message event via Socket.io
    const messageData = {
      senderId: user._id,
      receiverId: sellerId,
      message: 'Hi, I am interested in your car.',
    };

    socket.emit('send_message', messageData);  // Emit message data to seller

    // Navigate to the messaging page (optional)
    navigate(`/message/${user._id}/${sellerId}`);
  };

  const filteredCars = cars.filter((car) => {
    return (
      (!filters.price || car.price <= parseFloat(filters.price)) &&
      (!filters.model || car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (!filters.location || car.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  return (
    <div className="buy-page">
      <h2>Find Your Perfect Car</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="filter-section">
        <input
          type="number"
          name="price"
          placeholder="Max Price (Rs)"
          value={filters.price}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={filters.model}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
      </div>
      {loading ? (
        <div className="loading">Loading cars...</div>
      ) : (
        <div className="car-list">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div key={car._id} className="car-card">
                <div className="car-image-container">
                  <img
                    src={car.images?.length > 0 ? car.images[0] : 'default-car-image.jpg'}
                    alt={car.model}
                    className="car-image"
                  />
                </div>
                <div className="car-info">
                  <h3>{car.model}</h3>
                  <p><strong>Price:</strong> {car.price.toLocaleString()} Rs</p>
                  <p><strong>Location:</strong> {car.location}</p>
                  <p><strong>Description:</strong> {car.description}</p>
                  <button
                    className="car-card-button"
                    onClick={() => handleMessageSeller(car._user)}
                  >
                    Message Seller
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-cars-message">No cars found matching the criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Buy;
