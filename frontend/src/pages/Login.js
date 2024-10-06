import React from 'react';
import './Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Login</button>
            </div>
        </div>
    );
};

export default Login;
