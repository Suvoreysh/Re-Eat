import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import FoodDeliveryApp from './FoodDeliveryApp';
import MenuPage from './MenuPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import MyOrdersPage from './MyOrdersPage';
import CheckoutPage from './CheckoutPage';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<FoodDeliveryApp />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
