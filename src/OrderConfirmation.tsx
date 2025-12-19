import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, Download, Printer, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const API = "http://localhost:5000";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
    state?: string;
  };
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!token) {
          toast.error("Please login to view order");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(response.data);
      } catch (error: any) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, navigate, token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFF9F0 0%, #FFE0D0 100%)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div 
            style={{
              margin: "0 auto",
              width: "50px",
              height: "50px",
              border: "5px solid #FFE0D0",
              borderTopColor: "#FF6B35",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ marginTop: "1rem", color: "#666", fontSize: "18px" }}>
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <h2>Order not found</h2>
        <button 
          onClick={() => navigate("/orders")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #FF6B35, #ff8a50)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF9F0 0%, #FFE0D0 100%)", padding: "2rem 1rem" }}>
      {/* Success Message */}
      <div style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto 2rem", padding: "3rem 2rem", background: "white", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}>
        <CheckCircle size={80} color="#2e7d32" style={{ marginBottom: "1.5rem" }} />
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.75rem", fontWeight: 800 }}>Order Placed Successfully!</h1>
        <p style={{ color: "#666", fontSize: "1.2rem" }}>Thank you for your order. Order #{order.orderNumber}</p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap", maxWidth: "900px", margin: "0 auto 3rem" }}>
        <button onClick={() => navigate("/orders")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", background: "white", color: "#FF6B35", border: "2px solid #FFE0D0", borderRadius: "14px", fontWeight: 600, cursor: "pointer" }}>
          <ArrowLeft size={18} /> My Orders
        </button>
        <button onClick={() => navigate("/menu")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", background: "white", color: "#FF6B35", border: "2px solid #FFE0D0", borderRadius: "14px", fontWeight: 600, cursor: "pointer" }}>
          <Home size={18} /> Continue Shopping
        </button>
        <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", background: "linear-gradient(135deg, #FF6B35, #ff8a50)", color: "white", border: "none", borderRadius: "14px", fontWeight: 600, cursor: "pointer" }}>
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      {/* Order Details */}
      <div style={{ maxWidth: "900px", margin: "0 auto", background: "white", padding: "3rem", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ color: "#FF6B35", marginBottom: "2rem", fontSize: "2rem" }}>Order Details</h2>
        
        {/* Customer Info */}
        <div style={{ padding: "2rem", background: "#FFF9F0", borderRadius: "16px", marginBottom: "2rem", borderLeft: "6px solid #FF6B35" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>📍 Delivery Address</h3>
          <p><strong>{order.shippingInfo.fullName}</strong></p>
          <p>📧 {order.shippingInfo.email}</p>
          <p>📱 {order.shippingInfo.phone}</p>
          <p>🏠 {order.shippingInfo.address}</p>
          <p>📍 {order.shippingInfo.city}</p>
        </div>

        {/* Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
          <thead style={{ background: "linear-gradient(135deg, #FF6B35, #ff8a50)", color: "white" }}>
            <tr>
              <th style={{ padding: "1rem", textAlign: "left" }}>Item</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Price</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #FFE0D0" }}>
                <td style={{ padding: "1rem" }}><strong>{item.name}</strong></td>
                <td style={{ padding: "1rem", textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: "1rem", textAlign: "right" }}>${item.price.toFixed(2)}</td>
                <td style={{ padding: "1rem", textAlign: "right" }}><strong>${item.subtotal.toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ maxWidth: "400px", marginLeft: "auto", padding: "1.5rem", background: "#FFF9F0", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #FFE0D0" }}>
            <span>Subtotal:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #FFE0D0" }}>
            <span>Delivery Fee:</span>
            <span>{order.deliveryFee === 0 ? "FREE" : `$${order.deliveryFee.toFixed(2)}`}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #FF6B35", marginBottom: "1rem" }}>
            <span>Tax (8%):</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", fontSize: "1.4rem" }}>
            <strong>Total:</strong>
            <strong style={{ color: "#FF6B35" }}>${order.total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
