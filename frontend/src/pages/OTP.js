import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './OTP.css';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { otp });
      alert(response.data.message);
      
      // Redirect to login page after successful OTP verification
      navigate('/login'); // Replace '/login' with your actual login route
      
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter OTP:
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </label>
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default OTP;
