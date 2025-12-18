import React, { useState } from 'react';
import { X, Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './MenuPage.css';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalItems, getSubtotal } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['All', 'Burgers', 'Pizzas', 'Chicken', 'Tacos'];

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Cheeseburger',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'Burgers'
    },
    {
      id: 2,
      name: 'Double Cheeseburger',
      price: 10.99,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
      category: 'Burgers'
    },
    {
      id: 3,
      name: 'Chicken Burger',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
      category: 'Burgers'
    },
    {
      id: 4,
      name: 'Chicken Burger',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop',
      category: 'Burgers'
    },
    {
      id: 5,
      name: 'Pepperoni Pizza',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
      category: 'Pizzas'
    },
    {
      id: 6,
      name: 'Veggie Pizza',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop',
      category: 'Pizzas'
    },
    {
      id: 7,
      name: 'Crispy Fried Chicken',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
      category: 'Chicken'
    },
    {
      id: 9,
      name: 'Spicy Chicken Wings',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
      category: 'Chicken'
    },
    {
      id: 8,
      name: 'Spicy Tacos',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      category: 'Tacos'
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({ ...item, category: item.category });
  };

  const subtotal = getSubtotal();
  const cartCount = getTotalItems();

  return (
    <div className="menu-page">
      {/* Decorative Background */}
      <div className="menu-bg-decoration"></div>

      {/* Header */}


      {/* Main Content */}
      <main className="menu-main">
        <div className="container">
          {/* Page Title */}
          <h1 className="menu-page-title">Our Menu</h1>

          {/* Filters and Search */}
          <div className="menu-controls">
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
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

          {/* Menu Items by Category */}
          <div className="menu-content">
            {Object.entries(groupedItems).map(([category, items]) => (
              <section key={category} className="menu-category-section">
                <h2 className="category-title">{category}</h2>
                <div className="menu-items-grid">
                  {items.map(item => (
                    <div key={item.id} className="menu-item-card">
                      <div className="menu-item-image-wrapper">
                        <img src={item.image} alt={item.name} className="menu-item-image" />
                      </div>
                      <div className="menu-item-info">
                        <div className="menu-item-details">
                          <h3 className="menu-item-name">{item.name}</h3>
                          <p className="menu-item-price">${item.price.toFixed(2)}</p>
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
        </div>
      </main>

      {/* Cart Sidebar */}
      <aside className={`menu-cart-sidebar ${isCartOpen ? 'cart-open' : ''}`}>
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
        <div className="cart-content">
          <div className="cart-header">
            <h3 className="cart-title">Your Cart</h3>
            <button className="cart-close" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
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
              <button className="checkout-btn">Checkout</button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default MenuPage;
