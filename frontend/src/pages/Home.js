import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

// Sample car data for listings
const carListings = [
    {
        id: 1,
        model: '2022 Tesla Model S',
        price: '$79,990',
        image: '/src/images/car1.jpg', // Replace with actual image paths
    },
    {
        id: 2,
        model: '2021 Ford Mustang',
        price: '$55,000',
        image: '../images/car2.jpg', // Replace with actual image paths
    },
    {
        id: 3,
        model: '2020 BMW M3',
        price: '$70,000',
        image: '../images/car3.jpg', // Replace with actual image paths
    },
    // Add more cars as needed
];

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to ChalakWheels</h1>
            <h2> Where Your Dream Car Awaits</h2>
            <Link to="/register">
                <button className="button">Join Us Now!</button>
            </Link>
            <Link to="/login">
                <button className="button">click if already registered!</button>
            </Link>

            <div className="car-listings">
                <h2>Featured Cars</h2>
                <div className="card-container">
                    {carListings.map((car) => (
                        <div className="card" key={car.id}>
                            <img src={car.image} alt={car.model} className="car-image" />
                            <h3>{car.model}</h3>
                            <p>{car.price}</p>
                            <Link to={`/car/${car.id}`}>
                                <button className="button">View Details</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
