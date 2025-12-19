import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useCart, CartItem } from "./CartContext";
import { useAuth } from "./context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import "./CheckoutPage.css";

const API = "http://localhost:5000";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    clearCart,
  } = useCart();
  const { user, isLoggedIn, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "online">("cash");

  // Prefill user data
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/menu");
    }
  }, [cartItems.length, navigate]);

  // Calculate totals
  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const { fullName, email, phone, address, city } = shippingInfo;

    if (!fullName || !email || !phone || !address || !city) {
      toast.error("Please fill all shipping details");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cartItems.map((item: CartItem) => ({
          menuItem: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
        shippingInfo: {
          fullName,
          email,
          phone,
          address,
          city,
          zipCode: shippingInfo.zipCode,
          state: shippingInfo.state,
        },
        paymentMethod,
        subtotal,
        tax,
        deliveryFee,
        discount: 0,
        total,
      };

      const response = await axios.post(`${API}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Order placed successfully!");
      clearCart();
      
      // Navigate to order confirmation page with order ID
      navigate(`/order-confirmation/${response.data.order._id}`);
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as "card" | "cash" | "online");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-bg-decoration" />

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
              {/* LEFT - Shipping & Payment */}
              <div>
                <div className="checkout-section">
                  <h2 className="section-title">Shipping Information</h2>

                  <div className="input-with-icon">
                    <User className="field-icon" size={20} />
                    <input
                      className="checkout-input"
                      placeholder="Full Name *"
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="input-with-icon">
                    <Mail className="field-icon" size={20} />
                    <input
                      className="checkout-input"
                      type="email"
                      placeholder="Email *"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="input-with-icon">
                    <Phone className="field-icon" size={20} />
                    <input
                      className="checkout-input"
                      placeholder="Phone *"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="input-with-icon">
                    <MapPin className="field-icon" size={20} />
                    <input
                      className="checkout-input"
                      placeholder="Address *"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <input
                      className="checkout-input"
                      placeholder="City *"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      className="checkout-input"
                      placeholder="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          zipCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <input
                    className="checkout-input"
                    placeholder="State/Province"
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        state: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="checkout-section">
                  <h2 className="section-title">Payment Method</h2>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                      { value: "cash", label: "💵 Cash on Delivery", desc: "Pay when you receive" },
                      { value: "card", label: "💳 Credit/Debit Card", desc: "Secure card payment" },
                      { value: "online", label: "🌐 Online Payment", desc: "UPI, Wallets, etc." },
                    ].map((method) => (
                      <label
                        key={method.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "1rem",
                          background: paymentMethod === method.value ? "#FFF3E0" : "#FFF9F0",
                          border: `2px solid ${paymentMethod === method.value ? "#FF6B35" : "#FFE0D0"}`,
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => handlePaymentMethodChange(e.target.value)}
                          style={{ marginRight: "1rem", accentColor: "#FF6B35" }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "15px", color: "#1a1a1a" }}>
                            {method.label}
                          </div>
                          <div style={{ fontSize: "13px", color: "#666" }}>{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT - Order Summary */}
              <div>
                <div className="order-summary-card">
                  <h2 className="summary-title">Order Summary</h2>

                  <div className="summary-items">
                    {cartItems.map((item: CartItem) => (
                      <div className="summary-item" key={item.id}>
                        <img
                          src={item.image}
                          className="summary-item-image"
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop";
                          }}
                        />

                        <div className="summary-item-details">
                          <h4 className="summary-item-name">{item.name}</h4>
                          <p>${item.price.toFixed(2)}</p>
                        </div>

                        <div className="summary-item-controls">
                          <button
                            type="button"
                            className="control-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus size={14} />
                          </button>

                          <span className="item-quantity">{item.quantity}</span>

                          <button
                            type="button"
                            className="control-btn"
                            onClick={() => updateQuantity(item.id, 1)}
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
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="total-row">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grand-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button 
                    type="submit" 
                    className="place-order-btn"
                    disabled={loading}
                    style={{
                      opacity: loading ? 0.7 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                        <span style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid white",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}></span>
                        Placing Order...
                      </span>
                    ) : (
                      "Place Order"
                    )}
                  </button>

                  {!isLoggedIn && (
                    <p style={{ 
                      textAlign: "center", 
                      marginTop: "1rem", 
                      fontSize: "14px", 
                      color: "#666" 
                    }}>
                      Please{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#FF6B35",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        login
                      </button>{" "}
                      to place an order
                    </p>
                  )}
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