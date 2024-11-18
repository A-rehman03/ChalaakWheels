import React from 'react';
import './BuyerSeller.css';

const BuyerSeller = () => {
    return (
        <div className="buyer-seller-container">
            <div className="buyer-seller-card">
                <h2 className="buyer-seller-title">Want to Buy?</h2>
                <p>Find your dream car with our extensive listings!</p>
                <a href="/Buy" className="buyer-seller-button">Browse Cars</a>
            </div>
            <div className="buyer-seller-card">
                <h2 className="buyer-seller-title">Dashboard</h2>
                <p>Check your Listed Cars and new messages from Buyers</p>
                <a href="/Dashboard" className="buyer-seller-button">Your Dashboard</a>
            </div>
            <div className="buyer-seller-card">
                <h2 className="buyer-seller-title">Want to Sell?</h2>
                <p>List your car and reach thousands of potential buyers!</p>
                <a href="/Sell" className="buyer-seller-button">List Your Car</a>
            </div>
        </div>
    );
};

export default BuyerSeller;
