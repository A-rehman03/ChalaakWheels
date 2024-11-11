import React from 'react';
import './BuyerSeller.css';

const BuyerSeller = () => {
    return (
        <div className="buyer-seller-container">
            <div className="buyer-seller-card">
                <h2 className="buyer-seller-title">Are You a Buyer?</h2>
                <p>Find your dream car with our extensive listings!</p>
                <a href="/Buy" className="buyer-seller-button">Browse Cars</a>
            </div>
            <div className="buyer-seller-card">
                <h2 className="buyer-seller-title">Are You a Seller?</h2>
                <p>List your car and reach thousands of potential buyers!</p>
                <a href="/Sell" className="buyer-seller-button">List Your Car</a>
            </div>
        </div>
    );
};

export default BuyerSeller;
