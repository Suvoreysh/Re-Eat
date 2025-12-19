import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './MyOrdersPage.css';

const API = "https://re-eat-backend.onrender.com";

interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  total: number;
}

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { token, isLoggedIn } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to view orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isLoggedIn, navigate]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: string; text: string; class: string }> = {
      pending: { icon: '⏳', text: 'Pending', class: 'status-pending' },
      confirmed: { icon: '✓', text: 'Confirmed', class: 'status-confirmed' },
      preparing: { icon: '👨‍🍳', text: 'Preparing', class: 'status-preparing' },
      out_for_delivery: { icon: '🚚', text: 'Out for Delivery', class: 'status-delivery' },
      delivered: { icon: '✓', text: 'Delivered', class: 'status-completed' },
      cancelled: { icon: '✕', text: 'Cancelled', class: 'status-cancelled' }
    };
    return badges[status] || badges.pending;
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

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
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      {/* Background Decoration */}
      <div className="orders-bg-decoration"></div>

      {/* Header */}
      <header className="orders-header">
        <div className="container">
          <div className="orders-header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <div className="logo-icon">🍔</div>
              <span className="logo-text">Re-Eat FastFood</span>
            </div>

            <nav className="orders-nav">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="nav-link">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }} className="nav-link">Menu</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="nav-link">About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="nav-link">Contact</a>
            </nav>

            <div className="orders-header-actions">
              <button className="cart-icon-btn">
                <span className="cart-emoji">🛒</span>
                {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
              </button>
              <button className="cart-button" onClick={() => navigate('/checkout')}>
                <ShoppingCart size={20} />
                <span>Cart</span>
                {getTotalItems() > 0 && <span className="cart-count-badge">{getTotalItems()}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="orders-main">
        <div className="container">
          <div className="orders-page-header">
            <h1 className="orders-page-title">My Orders</h1>
            <p className="orders-page-subtitle">Track and manage your orders</p>
          </div>

          {/* Empty State */}
          {orders.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}>
              <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>📦</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No Orders Yet</h3>
              <p style={{ color: "#666", marginBottom: "2rem" }}>
                Start shopping and your orders will appear here
              </p>
              <button
                onClick={() => navigate('/menu')}
                style={{
                  padding: "1rem 2rem",
                  background: "linear-gradient(135deg, #FF6B35, #ff8a50)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Orders List */}
              <div className="orders-list">
                {currentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3 className="order-number">Order {order.orderNumber}</h3>
                          <div className={`status-badge ${statusBadge.class}`}>
                            <span className="status-icon">{statusBadge.icon}</span>
                            <span className="status-text">{statusBadge.text}</span>
                          </div>
                        </div>
                        <div className="order-total">
                          <span className="total-label">Total:</span>
                          <span className="total-amount">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="order-meta">
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="order-separator">|</span>
                        <span className="order-status-label">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="order-items">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="order-item">
                            <img 
                              src={item.image ? `${API}${item.image}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'} 
                              alt={item.name} 
                              className="order-item-image"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';
                              }}
                            />
                            <p className="order-item-name">{item.name}</p>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="order-item" style={{ opacity: 0.7 }}>
                            <div style={{
                              width: "60px",
                              height: "60px",
                              background: "#FFF3E0",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#FF6B35",
                            }}>
                              +{order.items.length - 3}
                            </div>
                            <p className="order-item-name">More items</p>
                          </div>
                        )}
                      </div>

                      <button 
                        className="view-order-btn"
                        onClick={() => navigate(`/order-confirmation/${order._id}`)}
                      >
                        <Eye size={16} style={{ marginRight: "0.5rem" }} />
                        View Order Details
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="pagination-text">{currentPage} of {totalPages}</span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Decorative Wave */}
      <div className="orders-bottom-wave"></div>
    </div>
  );
};

export default MyOrdersPage;