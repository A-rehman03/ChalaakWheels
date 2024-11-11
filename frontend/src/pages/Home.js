// Home.js
import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <header className="home-header">
        <h1>Welcome to ChalakWheels</h1>
        <p>where every car has a story, and we help you find the one ready to start a new chapter with you.</p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-btn">Sign Up</Link>
          <Link to="/login" className="cta-btn">Log In</Link>
        </div>
      </header>
      
      <section className="features">
        <div className="feature">
          <h2>Buy with Confidence</h2>
          <p>Search from a wide range of verified, pre-owned vehicles that fit your budget and needs.</p>
        </div>
        <div className="feature">
          <h2>Sell with Ease</h2>
          <p>List your car in minutes and connect directly with serious buyers.</p>
        </div>
        <div className="feature">
          <h2>Secure Transactions</h2>
          <p>Our secure platform ensures smooth and safe transactions every step of the way.</p>
        </div>
      </section>
    </div>
    
  );
};

export default Home;
