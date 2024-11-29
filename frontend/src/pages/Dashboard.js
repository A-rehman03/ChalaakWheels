import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken'); // Get token from localStorage

      try {
        // Fetch user's cars with Authorization header
        const carsResponse = await axios.get('http://localhost:5000/api/cars/dashboard', {
          headers: {
            Authorization: `Bearer ${token}` // Add token to the request header
          }
        });
        setCars(carsResponse.data);
        
        // Fetch messages with Authorization header
        const messagesResponse = await axios.get('http://localhost:5000/api/messages/user', {
          headers: {
            Authorization: `Bearer ${token}` // Add token to the request header
          }
        });
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleRemoveCar = async (carId) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    try {
      // Remove car with Authorization header
      await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add token to the request header
        }
      });
      setCars(cars.filter(car => car._id !== carId)); // Update state to reflect car removal
      alert('Car removed successfully.');
    } catch (error) {
      console.error('Error removing car:', error);
      alert('Failed to remove car.');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your listed cars and check messages from potential buyers.</p>
      </header>

      <section className="dashboard-sections">
        <div className="section cars-section">
          <h2>Your Listed Cars</h2>
          {cars.length ? (
            <div className="dashboard-cards">
              {cars.map(car => (
                <div key={car._id} className="dashboard-card">
                  <div className="car-image-container">
                  <img
                    src={car.images?.length > 0 ? car.images[0] : 'default-car-image.jpg'}
                    alt={car.model}
                    className="car-image"
                  />
                </div>
                  <h3>{car.model}</h3>
                  <p>Price: {car.price} Rs</p>
                  <p>Location: {car.location}</p>
                  <p>Description: {car.description}</p>
                  <div className="card-actions">
                    <button className="remove-car-button" onClick={() => handleRemoveCar(car._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You have not listed any cars for sale.</p>
          )}
        </div>

        <div className="section messages-section">
          <h2>Messages from Buyers</h2>
          {messages.length ? (
            <div className="message-list">
              {messages.map(msg => (
                <div key={msg._id} className="message-item">
                  <p>
                    <span className="sender">{msg.senderName}:</span> {msg.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No messages from buyers yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
