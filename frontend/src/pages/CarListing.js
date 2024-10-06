import React, { useEffect, useState } from 'react';
import './CarListing.css';
import CarCard from '../components/CarCard';  // Import CarCard component


const CarListing = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('/api/cars')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Failed to fetch car listings', error));
  }, []);

  return (
    <div className="car-listing">
      <h2>Available Cars</h2>
      {cars.length > 0 ? (
        <ul>
          {cars.map(car => (
            <li key={car._id}>
              <h3>{car.title}</h3>
              <p>{car.model}</p>
              <p>${car.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cars available</p>
      )}
    </div>
  );
};

export default CarListing;
