import React, { useState } from 'react';
import { ShoppingCart, Search, X, Plus, Minus, Trash2, Menu as MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './FoodDeliveryApp.css';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const FoodDeliveryApp: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, getSubtotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { 
      id: 1, 
      name: 'Cheeseburger', 
      price: 8.99, 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'Burgers'
    },
    { 
      id: 2, 
      name: 'Pepperoni Pizza', 
      price: 12.99, 
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
      category: 'Pizzas'
    },
    { 
      id: 3, 
      name: 'Crispy Fried Chicken', 
      price: 9.99, 
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
      category: 'Chicken'
    },
    { 
      id: 4, 
      name: 'Spicy Tacos', 
      price: 7.99, 
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      category: 'Tacos'
    }
  ];

  const subtotal = getSubtotal();

  return (
    <div className="food-delivery-app">
      <div className="bg-decoration bg-decoration-top"></div>
      <div className="bg-decoration bg-decoration-bottom"></div>
      
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">🍔</div>
              <span className="logo-text">Re-Eat FastFood</span>
            </div>
            
            <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
              <a href="#" className="nav-link active">Home</a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>Menu</a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a>
            </nav>
            
            <div className="header-actions">
              <button className="cart-icon-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
                <span className="cart-emoji">🛒</span>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </button>
              <button className="cart-button" onClick={() => setIsCartOpen(!isCartOpen)}>
                <ShoppingCart size={20} />
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="cart-count">{getTotalItems()}</span>
                )}
              </button>
              <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-content">
              <p className="hero-subtitle">Aayr The Peroaed Pipes</p>
              <h1 className="hero-title">
                Delicious Fast Food<br />
                Delivered <span className="highlight">Hot & Fresh</span>
              </h1>
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input type="text" placeholder="Search menu..." className="search-input" />
                <button className="search-filter-btn">⚙️</button>
              </div>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/menu')}>View Menu</button>
                  <button className="btn btn-secondary" onClick={() => navigate('/orders')}>View Orders</button>
                {/* <button className="btn btn-secondary">Order Now</button> */}
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop" 
                alt="Burger and Fries" 
              />
            </div>
          </div>
        </div>
      </section>

      <div className="main-content">
        <div className="container">
          <div className="content-wrapper">
            <section className="popular-dishes">
              <h2 className="section-title">Popular Dishes</h2>
              <div className="dishes-grid">
                {menuItems.map(item => (
                  <div key={item.id} className="dish-card">
                    <div className="dish-image-wrapper">
                      <img src={item.image} alt={item.name} className="dish-image" />
                    </div>
                    <div className="dish-info">
                      <h3 className="dish-name">{item.name}</h3>
                      <p className="dish-price">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className={`cart-sidebar ${isCartOpen ? 'cart-open' : ''}`}>
              <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
              <div className="cart-content">
                <div className="cart-header">
                  <h3 className="cart-title">Your Cart</h3>
                  <button className="cart-close" onClick={() => setIsCartOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="cart-items">
                  {cartItems.length === 0 ? (
                    <div className="cart-empty">
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                          <h4 className="cart-item-name">{item.name}</h4>
                          <p className="cart-item-price">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="cart-item-actions">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                          <button 
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Subtotal</span>
                      <span className="total-amount">${subtotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => navigate('/checkout')}>Checkout</button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <section className="promo-section">
        <div className="container">
          <div className="promo-wrapper">
            <div className="promo-content">
              <p className="promo-subtitle">Fresh & Tasty</p>
              <h2 className="promo-title">
                Get <span className="promo-highlight">20%</span> Off<br />
                on Your First Order!
              </h2>
              <button className="btn btn-primary">Order Now</button>
            </div>
            <div className="promo-image">
              <img 
                src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=600&fit=crop" 
                alt="Pizza" 
              />
            </div>
          </div>
        </div>
      </section>

      <div className="decorative-blob blob-1"></div>
      <div className="decorative-blob blob-2"></div>
      <div className="decorative-blob blob-3"></div>
    </div>
  );
};

export default FoodDeliveryApp;
