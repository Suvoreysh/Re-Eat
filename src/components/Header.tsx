import React, { useState } from "react";
import { ShoppingCart, Menu as MenuIcon, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

type HeaderProps = {
  onCartOpen: () => void;
  onLoginOpen: () => void;
};

const Header: React.FC<HeaderProps> = ({ onCartOpen, onLoginOpen }) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🍔</div>
            <span className="logo-text">Re-Eat FastFood</span>
          </div>

          {/* Nav */}
          <nav className={`nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
            {["/", "/menu", "/about", "/contact"].map((path, i) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {["Home", "Menu", "About", "Contact"][i]}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button className="cart-button" onClick={onCartOpen}>
              Cart
              <ShoppingCart size={18} />
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>

            {!isLoggedIn ? (
              <button className="login-button" onClick={onLoginOpen}>
                Login
              </button>
            ) : (
              <div className="user-info">
                <span className="user-name">
                  <User size={16} /> Hi, {user?.name}
                </span>
                <button className="login-button" onClick={logout}>
                  Logout
                </button>
              </div>
            )}

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
  );
};

export default Header;
