import React from 'react';
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
                    <Route path="/buy" element={<Buy />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/sell" element={<Sell />} />
                    <Route path="/messages/:buyerId/:sellerId" element={<Message />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
  