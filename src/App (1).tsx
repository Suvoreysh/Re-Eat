import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FoodDeliveryApp from './FoodDeliveryApp';
import MenuPage from './MenuPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FoodDeliveryApp />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
