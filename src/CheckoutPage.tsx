import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./context/AuthContext";
import "./CheckoutPage.css";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getTotalItems,
    clearCart,
  } = useCart();
  // const { user, isLoggedIn } = useAuth();

  /* ------------------ STATE ------------------ */

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    emailAddress: "",
    email: "",
    address: "",
    city: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  /* ------------------ PREFILL USER DATA ------------------ */

  // useEffect(() => {
  //   if (user) {
  //     setShippingInfo((prev) => ({
  //       ...prev,
  //       fullName: user.name || "",
  //       email: user.email || "",
  //     }));
  //   }
  // }, [user]);

  /* ------------------ TOTALS ------------------ */

  const subtotal = getSubtotal();
  const shipping = 0;
  const salesTax = subtotal * 0.08;
  const total = subtotal + shipping + salesTax;

  /* ------------------ SUBMIT ------------------ */

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!isLoggedIn) {
    //   alert("Please login to place an order");
    //   return;
    // }

    const { fullName, email, address, city } = shippingInfo;
    const { cardNumber, expiryDate, cvc } = paymentInfo;

    if (!fullName || !email || !address || !city) {
      alert("Please fill all shipping details");
      return;
    }

    if (!cardNumber || !expiryDate || !cvc) {
      alert("Please fill all payment details");
      return;
    }

    // Backend order API will go here later
    clearCart();
    navigate("/orders");
  };

  /* ------------------ RENDER ------------------ */

  return (
    <div className="checkout-page">
      <div className="checkout-bg-decoration" />

      {/* HEADER */}
      <header className="checkout-header">
        <div className="container">
          <div className="checkout-header-content">
            <div className="logo" onClick={() => navigate("/")}>
              <div className="logo-icon">🍔</div>
              <span className="logo-text">Re-Eat FastFood</span>
            </div>

            <nav className="checkout-nav">
              <button className="nav-link" onClick={() => navigate("/")}>
                Home
              </button>
              <button className="nav-link" onClick={() => navigate("/menu")}>
                Menu
              </button>
              <button className="nav-link" onClick={() => navigate("/about")}>
                About
              </button>
              <button className="nav-link" onClick={() => navigate("/contact")}>
                Contact
              </button>
            </nav>

            <div className="checkout-header-actions">
              <button className="cart-icon-btn">
                <span className="cart-emoji">🛒</span>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </button>

              <button className="cart-button">
                <ShoppingCart size={20} />
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="cart-count-badge">{getTotalItems()}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="checkout-main">
        <div className="container">
          <div className="checkout-page-header">
            <h1 className="checkout-page-title">Checkout</h1>
            <p className="checkout-page-subtitle">
              Almost done! Complete your order below
            </p>
          </div>

          <div className="checkout-hero-image">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200"
              alt="Food"
            />
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-grid">
              {/* LEFT */}
              <div>
                <div className="checkout-section">
                  <h2 className="section-title">Shipping Information</h2>

                  {[
                    { icon: User, key: "fullName", placeholder: "Full Name" },
                    { icon: Mail, key: "email", placeholder: "Email" },
                    { icon: MapPin, key: "address", placeholder: "Address" },
                    { icon: Phone, key: "city", placeholder: "City" },
                  ].map(({ icon: Icon, key, placeholder }) => (
                    <div className="input-with-icon" key={key}>
                      <Icon className="field-icon" size={20} />
                      <input
                        className="checkout-input"
                        placeholder={placeholder}
                        value={(shippingInfo as any)[key]}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="checkout-section">
                  <h2 className="section-title">Payment Details</h2>

                  {[
                    { key: "cardNumber", placeholder: "Card Number" },
                    { key: "expiryDate", placeholder: "MM/YY" },
                    { key: "cvc", placeholder: "CVC" },
                  ].map(({ key, placeholder }) => (
                    <input
                      key={key}
                      className="checkout-input"
                      placeholder={placeholder}
                      value={(paymentInfo as any)[key]}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          [key]: e.target.value,
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div>
                <div className="order-summary-card">
                  <h2 className="summary-title">Order Summary</h2>

                  <div className="summary-items">
                    {cartItems.map((item) => (
                      <div className="summary-item" key={item.id}>
                        <img
                          src={item.image}
                          className="summary-item-image"
                          alt={item.name}
                        />

                        <div className="summary-item-details">
                          <h4 className="summary-item-name">{item.name}</h4>
                          <p>${item.price.toFixed(2)}</p>
                        </div>

                        <div className="summary-item-controls">
                          <button
                            type="button"
                            className="control-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <span className="item-quantity">{item.quantity}</span>

                          <button
                            type="button"
                            className="control-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
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
                    ))}
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Tax</span>
                      <span>${salesTax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grand-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button type="submit" className="place-order-btn">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
