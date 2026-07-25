import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart whenever user logs in
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
    // eslint-disable-next-line
  }, [isLoggedIn, token]);

  async function fetchCart() {
    try {
      setLoading(true);
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId, quantity = 1) {
    try {
      await axios.post('/api/cart/add', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart(); // refresh cart after adding
    } catch (err) {
      console.error('Add to cart error:', err);
      throw err;
    }
  }

  async function removeFromCart(productId) {
    try {
      await axios.delete(`/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  }

  async function updateQuantity(productId, quantity) {
    try {
      await axios.put('/api/cart/update', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error('Update qty error:', err);
    }
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
