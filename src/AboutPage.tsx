import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <div className="about-page">
      {/* Decorative Background */}
      <div className="about-bg-decoration"></div>

      {/* Header */}
      <header className="about-header">
        <div className="container">
          <div className="about-header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <div className="logo-icon">🍔</div>
              <span className="logo-text">Re-Eat FastFood</span>
            </div>

            <nav className="about-nav">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="nav-link">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }} className="nav-link">Menu</a>
              <a href="#" className="nav-link active">About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="nav-link">Contact</a>
            </nav>

            <div className="about-header-actions">
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
      <main className="about-main">
        <div className="container">
          {/* Hero Section */}
          <section className="about-hero">
            <div className="about-hero-content">
              <h1 className="about-title">
                About <span className="highlight">Us</span>
              </h1>
              <h2 className="about-subtitle">
                Welcome to <span className="highlight">Foodie</span>,<br />
                Where Flavor Meets Fast!
              </h2>
              <p className="about-description">
                A fast foods content <span className="strikethrough">trone focussed or toartion</span> delivering fresh and <span className="strikethrough">flor to</span> fresh and tasty meals. <span className="strikethrough">Witrinized tino to thurt thiselong rou thase ator mating</span> you then and tasty <span className="strikethrough">omish</span> you <span className="strikethrough">oor</span> you f you <span className="strikethrough">care use o ariish on</span> onutlinet your poscje. <span className="strikethrough">Wlttessuosiny</span> help you a quality ingredients. <span className="strikethrough">The</span> commit ouri
              </p>
            </div>
            <div className="about-hero-image">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop" 
                alt="Delicious burger and fries" 
              />
            </div>
          </section>

          {/* Story and Mission Section */}
          <section className="story-mission-section">
            <div className="story-mission-grid">
              {/* Our Story */}
              <div className="story-card">
                <h2 className="section-title">Our Story</h2>
                <div className="story-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop" 
                    alt="Foodie restaurant" 
                  />
                </div>
                <p className="story-text">
                  Ou treas foodies a small burger stand, <span className="strikethrough">you thase e vertoly ont the</span> and <span className="strikethrough">noss toust miting your</span> ques a or <span className="strikethrough">nulles</span> you from <span className="strikethrough">onsore trash</span> grases, that <span className="strikethrough">ese tor</span> cer orsing you <span className="strikethrough">mootlis</span> neetts t you varleg!
                </p>
              </div>

              {/* Our Mission */}
              <div className="mission-card">
                <h2 className="section-title">Our Mission</h2>
                <div className="mission-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&h=300&fit=crop" 
                    alt="Chef preparing food" 
                  />
                </div>
                <p className="mission-text">
                  Our doodies providing <span className="strikethrough">quick yor wika</span> hot, fresh and delicious <span className="strikethrough">forot</span> food <span className="strikethrough">dosint</span> the highest level <span className="strikethrough">or ou wrote to ver</span> tasty your delicious <span className="strikethrough">utt ot</span> the <span className="strikethrough">foo</span> ot the highest level of customer satisfaction.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="team-section">
            <h2 className="team-title">Meet Our Team</h2>
            <div className="team-grid">
              {/* Team Member 1 */}
              <div className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                    alt="John Doe" 
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">John Doe</h3>
                  <p className="team-role">Founder</p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop" 
                    alt="Sarah Smith" 
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Sarah Smith</h3>
                  <p className="team-role">Head Chef</p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" 
                    alt="Mike Johnson" 
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Mike Johnson</h3>
                  <p className="team-role">Manager</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="about-decorative-blob blob-1"></div>
      <div className="about-decorative-blob blob-2"></div>
    </div>
  );
};

export default AboutPage;
