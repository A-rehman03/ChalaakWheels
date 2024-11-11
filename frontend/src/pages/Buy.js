// Buy.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Buy.css';

const Buy = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({ price: '', model: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars');
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
      <div className="filter-section">
        <input
          type="number"
          name="price"
          placeholder="Max Price"
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
          {filteredCars.length ? (
            filteredCars.map((car) => (
              <div key={car.id} className="car-card">
                <div className="car-image-container">
                  <img
                    src={car.images && car.images.length > 0 ? car.images[0] : 'default-car-image.jpg'}
                    alt={car.model}
                    className="car-image"
                  />
                </div>
                <div className="car-info">
                  <h3>{car.model}</h3>
                  <p>Price: {car.price} Rs</p>
                  <p>Location: {car.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No cars found matching the criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Buy;
