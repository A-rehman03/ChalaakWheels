import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Buy.css';


const Buy = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    price: '',
    model: '',
    location: '',
  });

  useEffect(() => {
    // Fetch cars from API
    const fetchCars = async () => {
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    };

    fetchCars();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredCars = cars.filter(car => {
    return (
      (!filters.price || car.price <= filters.price) &&
      (!filters.model || car.model.includes(filters.model)) &&
      (!filters.location || car.location.includes(filters.location))
    );
  });

  return (
    <div>
      <h2>Find Your Car</h2>
      <div>
        <input
          type="text"
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
      <div>
        {filteredCars.map((car) => (
          <div key={car.id}>
            <h3>{car.model}</h3>
            <p>Price: {car.price}</p>
            <p>Location: {car.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buy;
