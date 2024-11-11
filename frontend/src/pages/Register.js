import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Navigate to OTP verification page
                navigate('/verify-otp', { state: { email } }); // Pass email for OTP verification
            } else {
                console.error('Registration failed:', data);
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Join ChalakWheels</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                <input
                        type="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
