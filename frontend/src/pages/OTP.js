import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OTP.css'; // Create a corresponding CSS file for styling

const OTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('OTP verified:', data);
                // Redirect to home or another page after successful verification
                navigate('/'); 
            } else {
                setError(data.message || 'OTP verification failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="otp-container">
            <h2>Enter OTP</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Verify OTP</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default OTP;
