import React, { useState, useEffect } from 'react';
import { X, Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './MenuPage.css';

const API = "https://re-eat-backend.onrender.com";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  finalPrice: number;
  discount: number;
  image?: string;
  category: Category;
  isVeg: boolean;
  isSpicy: boolean;
  isBestSeller: boolean;
  preparationTime: number;
  calories: number;
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalItems, getSubtotal } = useCart();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API}/api/categories/public`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const params: any = {};
        
        if (activeCategory !== 'All') {
          params.category = activeCategory;
        }
        
        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await axios.get(`${API}/api/menu/public`, { params });
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory, searchQuery]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category?.slug === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const categoryName = item.category?.name || 'Other';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.finalPrice,
      image: item.image ? `${API}${item.image}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      category: item.category?.name || 'Other'
    });
    toast.success(`${item.name} added to cart!`);
  };

  const subtotal = getSubtotal();
  const cartCount = getTotalItems();

  return (
    <div className="menu-page">
      {/* Decorative Background */}
      <div className="menu-bg-decoration"></div>

      {/* Main Content */}
      <main className="menu-main">
        <div className="container">
          {/* Page Title */}
          <h1 className="menu-page-title">Our Menu</h1>

          {/* Filters and Search */}
          <div className="menu-controls">
            <div className="category-filters">
              <button
                className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category._id}
                  className={`category-btn ${activeCategory === category.slug ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>

            <div className="menu-search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search menu..."
                className="menu-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div 
                style={{ 
                  margin: '0 auto', 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #FFE0D0', 
                  borderTopColor: '#FF6B35', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }}
              ></div>
              <p style={{ marginTop: '1rem', color: '#666' }}>Loading menu...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🍽️</div>
              <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                No items found
              </h3>
              <p style={{ color: '#666' }}>Try adjusting your search or filters</p>
            </div>
          )}

          {/* Menu Items by Category */}
          {!loading && filteredItems.length > 0 && (
            <div className="menu-content">
              {Object.entries(groupedItems).map(([categoryName, items]) => (
                <section key={categoryName} className="menu-category-section">
                  <h2 className="category-title">{categoryName}</h2>
                  <div className="menu-items-grid">
                    {items.map(item => (
                      <div key={item._id} className="menu-item-card">
                        <div className="menu-item-image-wrapper">
                          <img 
                            src={item.image ? `${API}${item.image}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'} 
                            alt={item.name} 
                            className="menu-item-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                            }}
                          />
                          
                          {/* Badges */}
                          <div style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            left: '10px', 
                            display: 'flex', 
                            gap: '6px', 
                            flexWrap: 'wrap',
                            maxWidth: 'calc(100% - 80px)'
                          }}>
                            {item.isVeg && (
                              <span style={{ 
                                background: '#e8f5e9', 
                                color: '#2e7d32', 
                                padding: '4px 8px', 
                                borderRadius: '12px', 
                                fontSize: '11px', 
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}>
                                🌱 VEG
                              </span>
                            )}
                            {item.isSpicy && (
                              <span style={{ 
                                background: '#ffebee', 
                                color: '#c62828', 
                                padding: '4px 8px', 
                                borderRadius: '12px', 
                                fontSize: '11px', 
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}>
                                🌶️ SPICY
                              </span>
                            )}
                            {item.isBestSeller && (
                              <span style={{ 
                                background: '#fff3e0', 
                                color: '#e65100', 
                                padding: '4px 8px', 
                                borderRadius: '12px', 
                                fontSize: '11px', 
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}>
                                ⭐ BEST
                              </span>
                            )}
                          </div>

                          {/* Discount Badge */}
                          {item.discount > 0 && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              background: '#2e7d32',
                              color: 'white',
                              padding: '6px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 700
                            }}>
                              {item.discount}% OFF
                            </div>
                          )}
                        </div>

                        <div className="menu-item-info">
                          <div className="menu-item-details">
                            <h3 className="menu-item-name">{item.name}</h3>
                            
                            {item.description && (
                              <p style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                margin: '4px 0 8px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {item.description}
                              </p>
                            )}

                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              marginBottom: '8px' 
                            }}>
                              <p className="menu-item-price">
                                ${item.finalPrice.toFixed(2)}
                              </p>
                              {item.discount > 0 && (
                                <span style={{
                                  fontSize: '14px',
                                  color: '#999',
                                  textDecoration: 'line-through'
                                }}>
                                  ${item.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Additional Info */}
                            <div style={{ 
                              display: 'flex', 
                              gap: '12px', 
                              fontSize: '12px', 
                              color: '#999', 
                              marginBottom: '8px' 
                            }}>
                              {item.preparationTime > 0 && (
                                <span>⏱️ {item.preparationTime} min</span>
                              )}
                              {item.calories > 0 && (
                                <span>🔥 {item.calories} cal</span>
                              )}
                            </div>
                          </div>

                          <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      <aside className={`menu-cart-sidebar ${isCartOpen ? 'cart-open' : ''}`}>
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
        <div className="cart-content">
          <div className="cart-header">
            <h3 className="cart-title">Your Cart ({cartCount})</h3>
            <button className="cart-close" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>
                  🛒
                </div>
                <p>Your cart is empty</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #FF6B35, #ff8a50)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'} 
                    alt={item.name} 
                    className="cart-item-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';
                    }}
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                      title="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, 1)}
                      title="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success(`${item.name} removed from cart`);
                      }}
                      title="Remove from cart"
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
              <button 
                className="checkout-btn" 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Floating Cart Button */}
      <button 
        className="floating-cart-btn" 
        onClick={() => setIsCartOpen(true)}
        title="View Cart"
        style={{
          position: 'fixed',
          right: '2rem',
          bottom: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B35, #ff8a50)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
        }}
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#c62828',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default MenuPage;