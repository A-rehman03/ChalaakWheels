import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerSeller.css';

const BuyerSeller = () => {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate('/buy');
  };

  const handleSell = () => {
    navigate('/sell');
  };

  return (
    <div>
      <h2>Are you a buyer or a seller?</h2>
      <button onClick={handleBuy}>Buy</button>
      <button onClick={handleSell}>Sell</button>
    </div>
  );
};

export default BuyerSeller;
