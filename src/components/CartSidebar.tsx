import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../context/AuthContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginOpen: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  onLoginOpen,
}) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getSubtotal } = useCart();
  const { isLoggedIn } = useAuth();
  if (!isOpen) return null;

  return (
    <aside className="cart-sidebar cart-open">
      <div className="cart-overlay" onClick={onClose} />

      <div className="cart-content">
        {/* Header */}
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>

                <div className="cart-item-actions">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
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

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal</span>
              <strong>${getSubtotal().toFixed(2)}</strong>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={() => {
                if (!isLoggedIn) {
                  onClose();
                  onLoginOpen(); // pass this down from layout
                  return;
                }
                navigate("/checkout");
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CartSidebar;
