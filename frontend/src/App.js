import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarListing from './pages/CarListing';
import Footer from './components/Footer'; // Assuming you have a Footer component

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cars" element={<CarListing />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
  