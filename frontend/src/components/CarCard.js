import React from 'react';
import './CarCard.css'; // Separate CSS

const CarCard = ({ model, price, image }) => {
    return (
        <div className="car-card">
            <img src={image} alt={model} className="car-image" />
            <div className="car-details">
                <h3>{model}</h3>
                <p>{price}</p>
            </div>
        </div>
    );
};

export default CarCard;
