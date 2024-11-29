import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarListing from './pages/CarListing';
import OTP from './pages/OTP';
import Footer from './components/Footer';
import BuyerSeller from './pages/BuyerSeller';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Message from './pages/Message';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load user and token from localStorage or other persistent storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CarListing />} />
          <Route path="/verify-otp" element={<OTP />} />
          <Route path="/buyer-seller" element={<BuyerSeller />} />
          <Route path="/buy" element={<Buy user={user} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sell" element={<Sell />} />
          <Route
            path="/messages/:sellerId"
            element={<Message user={user} token={token} />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
