import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

const API = 'https://re-eat-backend.onrender.com';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface BackendCartItem {
  _id: string;
  menuItem: {
    _id: string;
    name: string;
    finalPrice: number;
    image: string;
    category: string;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, change: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { token, isLoggedIn } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync cart with backend when user logs in
  useEffect(() => {
    if (isLoggedIn && token && isInitialized) {
      syncCartWithBackend();
    }
  }, [isLoggedIn, token, isInitialized]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Convert backend cart item to CartItem format
  const convertBackendItem = (backendItem: BackendCartItem): CartItem => {
    return {
      id: backendItem.menuItem._id,
      name: backendItem.menuItem.name,
      price: backendItem.menuItem.finalPrice,
      quantity: backendItem.quantity,
      image: backendItem.menuItem.image,
      category: backendItem.menuItem.category,
    };
  };

  // Sync cart with backend
  const syncCartWithBackend = async () => {
    try {
      // Get cart from backend
      const response = await axios.get(`${API}/api/orders/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const backendCartItems: BackendCartItem[] = response.data.items || [];
      const backendCart: CartItem[] = backendCartItems.map(convertBackendItem);

      // Merge with local cart
      const localCart = cartItems;
      const mergedCart: CartItem[] = [...backendCart];

      // Add items from local cart that aren't in backend cart
      localCart.forEach((localItem) => {
        const existingIndex = mergedCart.findIndex(
          (item) => String(item.id) === String(localItem.id)
        );

        if (existingIndex === -1) {
          // Item not in backend, add it
          mergedCart.push(localItem);
        } else {
          // Item exists, increase quantity
          mergedCart[existingIndex].quantity += localItem.quantity;
        }
      });

      // Update backend cart with merged items
      if (mergedCart.length > 0) {
        await Promise.all(
          mergedCart.map((item) =>
            axios.post(
              `${API}/api/orders/cart`,
              {
                menuItemId: item.id,
                quantity: item.quantity,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
          )
        );
      }

      // Fetch updated cart from backend
      const updatedResponse = await axios.get(`${API}/api/orders/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedBackendItems: BackendCartItem[] = updatedResponse.data.items || [];
      const formattedCart: CartItem[] = updatedBackendItems.map(convertBackendItem);

      setCartItems(formattedCart);
    } catch (error: any) {
      console.error('Error syncing cart:', error);
      // If sync fails, keep local cart
    }
  };

  // Add to cart
  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    const newItem: CartItem = { ...item, quantity: 1 };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => String(i.id) === String(item.id));
      if (existingItem) {
        return prevItems.map((i) =>
          String(i.id) === String(item.id) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, newItem];
    });

    // Sync with backend if logged in
    if (isLoggedIn && token) {
      try {
        await axios.post(
          `${API}/api/orders/cart`,
          {
            menuItemId: item.id,
            quantity: 1,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error: any) {
        console.error('Error adding to cart:', error);
        // Don't show error to user - local cart still works
      }
    }
  };

  // Remove from cart
  const removeFromCart = async (id: string | number) => {
    const itemToRemove = cartItems.find((item) => String(item.id) === String(id));

    setCartItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(id)));

    // Sync with backend if logged in
    if (isLoggedIn && token && itemToRemove) {
      try {
        // Find the backend cart item ID
        const backendResponse = await axios.get(`${API}/api/orders/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const backendItems: BackendCartItem[] = backendResponse.data.items || [];
        const backendItem = backendItems.find(
          (item) => String(item.menuItem._id) === String(id)
        );

        if (backendItem) {
          await axios.delete(`${API}/api/orders/cart/${backendItem._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (error: any) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  // Update quantity
  const updateQuantity = async (id: string | number, change: number) => {
    let updatedQuantity = 0;

    setCartItems((prevItems) => {
      const updated = prevItems
        .map((item) => {
          if (String(item.id) === String(id)) {
            const newQuantity = item.quantity + change;
            updatedQuantity = newQuantity;
            return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);

      return updated;
    });

    // Sync with backend if logged in
    if (isLoggedIn && token) {
      try {
        if (updatedQuantity <= 0) {
          // Remove item
          const backendResponse = await axios.get(`${API}/api/orders/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const backendItems: BackendCartItem[] = backendResponse.data.items || [];
          const backendItem = backendItems.find(
            (item) => String(item.menuItem._id) === String(id)
          );

          if (backendItem) {
            await axios.delete(`${API}/api/orders/cart/${backendItem._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        } else {
          // Update quantity
          const backendResponse = await axios.get(`${API}/api/orders/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const backendItems: BackendCartItem[] = backendResponse.data.items || [];
          const backendItem = backendItems.find(
            (item) => String(item.menuItem._id) === String(id)
          );

          if (backendItem) {
            await axios.put(
              `${API}/api/orders/cart/${backendItem._id}`,
              { quantity: updatedQuantity },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
        }
      } catch (error: any) {
        console.error('Error updating cart:', error);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCartItems([]);

    // Sync with backend if logged in
    if (isLoggedIn && token) {
      try {
        await axios.delete(`${API}/api/orders/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error: any) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Get total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get subtotal
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Manual sync function
  const syncCart = async () => {
    if (isLoggedIn && token) {
      await syncCartWithBackend();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};