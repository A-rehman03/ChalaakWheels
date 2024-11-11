import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OTP.css';

const OTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { otp });
            setSuccessMessage(response.data.message);

            // Navigate to login page after a short delay
            setTimeout(() => navigate('/Login'), 1500);
        } catch (error) {
            setError(error.response?.data?.msg || 'OTP verification failed');
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-box">
                <h2>Verify OTP</h2>
                <p>Please enter the OTP sent to your email</p>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="otp-input"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit" className="otp-submit-btn">Verify OTP</button>
                </form>
            </div>
        </div>
    );
};

export default OTP;
