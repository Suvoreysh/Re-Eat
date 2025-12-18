import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Phone, Mail, MapPin, User, Edit } from 'lucide-react';
import { useCart } from './CartContext';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Decorative Background */}
      <div className="contact-bg-decoration"></div>

      {/* Header */}
      <header className="contact-header">
        <div className="container">
          <div className="contact-header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <div className="logo-icon">🍔</div>
              <span className="logo-text">Re-Eat FastFood</span>
            </div>

            <nav className="contact-nav">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="nav-link">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }} className="nav-link">Menu</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="nav-link">About</a>
              <a href="#" className="nav-link active">Contact</a>
            </nav>

            <div className="contact-header-actions">
              <button className="cart-icon-btn">
                <span className="cart-emoji">🛒</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <button className="cart-button">
                <ShoppingCart size={20} />
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="contact-main">
        <div className="container">
          {/* Hero Section */}
          <section className="contact-hero">
            <div className="contact-hero-content">
              <h1 className="contact-title">
                Contact <span className="highlight">Us</span>
              </h1>
              <h2 className="contact-subtitle">
                Get in Touch with <span className="highlight">Foodie</span>
              </h2>
              <p className="contact-description">
                Wohtipalize the froan! <span className="strikethrough">izrae</span> missioxm of <span className="strikethrough">we will intaoerlecids</span> delivering sweetness, <span className="strikethrough">perconedbels suzsething</span> ptorhus, of <span className="strikethrough">wad to eod fooede i</span> a quality <span className="strikethrough">folda scates</span> too <span className="strikethrough">witns</span> the meat fresh, <span className="strikethrough">icussed</span> food <span className="strikethrough">hetwertslevs ever</span> eal the most <span className="strikethrough">sonoted</span> health <span className="strikethrough">ordics</span>.
              </p>
            </div>
            <div className="contact-hero-image">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop" 
                alt="Burger and drink" 
              />
            </div>
          </section>

          {/* Contact Information and Form Section */}
          <section className="contact-info-form-section">
            <div className="contact-info-form-grid">
              {/* Contact Information Card */}
              <div className="contact-info-card">
                <h2 className="info-card-title">Contact Information</h2>
                <div className="support-agent-image">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop" 
                    alt="Support Agent" 
                  />
                </div>
                <div className="contact-details">
                  <div className="contact-detail-item">
                    <Phone className="detail-icon" size={24} />
                    <span className="detail-text">(123) 456-7890</span>
                  </div>
                  <div className="contact-detail-item">
                    <Mail className="detail-icon" size={24} />
                    <span className="detail-text">info@foodie.com</span>
                  </div>
                  <div className="contact-detail-item">
                    <MapPin className="detail-icon" size={24} />
                    <span className="detail-text">123 Foodie St, Flavor Town, USA</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-card">
                <h2 className="form-card-title">Contact Us</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-wrapper">
                      <Edit className="input-icon" size={20} />
                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        className="form-input"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="textarea-wrapper">
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        className="form-textarea"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="submit-button">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="map-section">
            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-marker">
                  <MapPin size={40} color="#FF6B35" />
                  <div className="marker-label">123 Foodie St, Flavor Town, USA</div>
                </div>
                {/* Placeholder for map - In production, use Google Maps API or similar */}
                <div className="map-grid"></div>
              </div>
            </div>
          </section>

          {/* Bottom Contact Info */}
          <section className="bottom-contact-info">
            <div className="bottom-info-grid">
              <div className="bottom-info-item">
                <div className="bottom-icon-wrapper location">
                  <MapPin size={32} />
                </div>
                <div className="bottom-info-text">
                  <h3>123 Foodie St, Flavor Town, USA</h3>
                </div>
              </div>

              <div className="bottom-info-item">
                <div className="bottom-icon-wrapper phone">
                  <Phone size={32} />
                </div>
                <div className="bottom-info-text">
                  <h3>(123) 456-7890</h3>
                  <p>Phone</p>
                </div>
              </div>

              <div className="bottom-info-item">
                <div className="bottom-icon-wrapper email">
                  <Mail size={32} />
                </div>
                <div className="bottom-info-text">
                  <h3>info@foodie.com</h3>
                  <p>Email</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Message */}
          <div className="footer-message">
            <p>Our dedicated team is here to serve you.</p>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="contact-decorative-blob blob-1"></div>
      <div className="contact-decorative-blob blob-2"></div>
      <div className="contact-bottom-wave"></div>
    </div>
  );
};

export default ContactPage;
