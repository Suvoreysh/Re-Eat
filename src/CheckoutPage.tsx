import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Mail, MapPin, Phone, CreditCard, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from './CartContext';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTotalItems, clearCart } = useCart();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: 'Juli Name',
    emailAddress: 'email Address',
    email: 'jane@example.com',
    address: '123 Main St',
    city: 'Flavor Town'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/24',
    cvc: '123'
  });

  const subtotal = getSubtotal();
  const shipping = 0; // Free shipping
  const salesTax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + salesTax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed successfully! Order ID: #' + Math.floor(Math.random() * 90000 + 10000));
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="checkout-page">
      {/* Background Decoration */}
      <div className="checkout-bg-decoration"></div>

      {/* Header */}
      <header className="checkout-header">
        <div className="container">
          <div className="checkout-header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <div className="logo-icon">🍔</div>
              <span className="logo-text">Re-Eat FastFood</span>
            </div>

            <nav className="checkout-nav">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="nav-link">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }} className="nav-link">Menu</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="nav-link">About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="nav-link active">Contact</a>
            </nav>

            <div className="checkout-header-actions">
              <button className="cart-icon-btn">
                <span className="cart-emoji">🛒</span>
                {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
              </button>
              <button className="cart-button">
                <ShoppingCart size={20} />
                <span>Cart</span>
                {getTotalItems() > 0 && <span className="cart-count-badge">{getTotalItems()}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="checkout-main">
        <div className="container">
          {/* Page Header */}
          <div className="checkout-page-header">
            <h1 className="checkout-page-title">Checkout</h1>
            <p className="checkout-page-subtitle">Almost done! Complete your order below</p>
          </div>

          {/* Hero Image Section */}
          <div className="checkout-hero-image">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop" 
              alt="Delicious food" 
            />
          </div>

          <form onSubmit={handlePlaceOrder} className="checkout-form-wrapper">
            <div className="checkout-grid">
              {/* Left Column - Shipping & Payment */}
              <div className="checkout-left-column">
                {/* Shipping Information */}
                <div className="checkout-section">
                  <h2 className="section-title">Shipping Information</h2>
                  <div className="form-fields">
                    <div className="form-group">
                      <div className="input-with-icon">
                        <User className="field-icon" size={20} />
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="checkout-input"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-with-icon">
                        <User className="field-icon" size={20} />
                        <input
                          type="text"
                          placeholder="Email Address"
                          className="checkout-input"
                          value={shippingInfo.emailAddress}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, emailAddress: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-with-icon">
                        <Mail className="field-icon" size={20} />
                        <input
                          type="email"
                          placeholder="jane@example.com"
                          className="checkout-input"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-with-icon">
                        <MapPin className="field-icon" size={20} />
                        <input
                          type="text"
                          placeholder="123 Main St"
                          className="checkout-input"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-with-icon">
                        <Phone className="field-icon" size={20} />
                        <input
                          type="text"
                          placeholder="Flavor Town"
                          className="checkout-input"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="checkout-section">
                  <h2 className="section-title">Payment Details</h2>
                  <div className="form-fields">
                    <div className="form-group">
                      <div className="input-with-icon">
                        <CreditCard className="field-icon" size={20} />
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="checkout-input"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <div className="input-with-icon">
                          <CreditCard className="field-icon" size={20} />
                          <input
                            type="text"
                            placeholder="12/24"
                            className="checkout-input"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="CVC 123"
                          className="checkout-input"
                          value={paymentInfo.cvc}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Method Icons */}
                    <div className="payment-methods">
                      <div className="payment-icon visa">VISA</div>
                      <div className="payment-icon mastercard">MC</div>
                      <div className="payment-icon amex">AE</div>
                      <div className="payment-icon discover">123</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="checkout-right-column">
                <div className="order-summary-card">
                  <h2 className="summary-title">Order Summary</h2>

                  {/* Cart Items */}
                  <div className="summary-items">
                    {cartItems.length === 0 ? (
                      <div className="empty-cart">
                        <p>Your cart is empty</p>
                        <button 
                          type="button"
                          className="browse-menu-btn"
                          onClick={() => navigate('/menu')}
                        >
                          Browse Menu
                        </button>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="summary-item">
                          <img src={item.image} alt={item.name} className="summary-item-image" />
                          <div className="summary-item-details">
                            <h4 className="summary-item-name">{item.name}</h4>
                            <p className="summary-item-original-price">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="summary-item-right">
                            <p className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                            <div className="summary-item-controls">
                              <button
                                type="button"
                                className="control-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="item-quantity">{item.quantity}</span>
                              <button
                                type="button"
                                className="control-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Order Totals */}
                  {cartItems.length > 0 && (
                    <>
                      <div className="order-totals">
                        <div className="total-row">
                          <span className="total-label">Subtotal</span>
                          <span className="total-value">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                          <span className="total-label">Shipping</span>
                          <span className="total-value free">Free</span>
                        </div>
                        <div className="total-row">
                          <span className="total-label">Sales Tax</span>
                          <span className="total-value">${salesTax.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="grand-total">
                        <span className="grand-total-label">Total</span>
                        <span className="grand-total-value">${total.toFixed(2)}</span>
                      </div>

                      <button type="submit" className="place-order-btn">
                        Place Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Contact Info */}
      <footer className="checkout-footer">
        <div className="container">
          <div className="footer-contact-grid">
            <div className="footer-contact-item">
              <div className="footer-icon location">
                <MapPin size={24} />
              </div>
              <div className="footer-text">
                <h4>123 Foodie St, Flavor Town, USA</h4>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-icon phone">
                <Phone size={24} />
              </div>
              <div className="footer-text">
                <h4>(123) 456-7890</h4>
                <p>Phone</p>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-icon email">
                <Mail size={24} />
              </div>
              <div className="footer-text">
                <h4>info@foodie.com</h4>
                <p>Email</p>
              </div>
            </div>
          </div>

          <div className="footer-message">
            <p>Our dedicated team is here to serve you.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;
