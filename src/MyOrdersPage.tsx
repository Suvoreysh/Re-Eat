import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from './CartContext';
import './MyOrdersPage.css';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'completed' | 'processing' | 'cancelled';
  items: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  total: number;
  statusLabel: string;
}

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const orders: Order[] = [
    {
      id: '12345',
      orderNumber: '#12345',
      date: 'April 22, 2024',
      status: 'completed',
      statusLabel: 'Rempleted',
      items: [
        {
          id: 1,
          name: 'Cheeseburger',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop'
        },
        {
          id: 2,
          name: 'Spicy Tacos',
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop'
        }
      ],
      total: 18.34
    },
    {
      id: '12344',
      orderNumber: '#12344',
      date: 'April 20, 2024',
      status: 'processing',
      statusLabel: 'Rempleted',
      items: [
        {
          id: 3,
          name: 'Double Cheeseburger',
          image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=200&fit=crop'
        },
        {
          id: 4,
          name: 'Pepperoni Pizza',
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop'
        }
      ],
      total: 22.98
    },
    {
      id: '12343',
      orderNumber: '#12343',
      date: 'April 15, 2024',
      status: 'cancelled',
      statusLabel: 'Sales Total',
      items: [
        {
          id: 5,
          name: 'Spicy Tacos',
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop'
        }
      ],
      total: 7.99
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { icon: '✓', text: 'Completed', class: 'status-completed' },
      processing: { icon: '⟳', text: 'Processing', class: 'status-processing' },
      cancelled: { icon: '✕', text: 'Cancelled', class: 'status-cancelled' }
    };
    return badges[status as keyof typeof badges] || badges.completed;
  };

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
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="nav-link active">Contact</a>
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

          {/* Orders List */}
          <div className="orders-list">
            {orders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-number">Order {order.orderNumber}</h3>
                      <div className={`status-badge ${statusBadge.class}`}>
                        <span className="status-icon">{statusBadge.icon}</span>
                        <span className="status-text">{statusBadge.text}</span>
                      </div>
                    </div>
                    <div className="order-total">
                      <span className="total-label">Total :</span>
                      <span className="total-amount">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-meta">
                    <span className="order-date">{order.date}</span>
                    <span className="order-separator">|</span>
                    <span className="order-status-label">{order.statusLabel}</span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <img src={item.image} alt={item.name} className="order-item-image" />
                        <p className="order-item-name">{item.name}</p>
                      </div>
                    ))}
                  </div>

                  <button className="view-order-btn">View Order</button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
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
        </div>
      </main>

      {/* Decorative Wave */}
      <div className="orders-bottom-wave"></div>
    </div>
  );
};

export default MyOrdersPage;
