import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    clearCart();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🛍️ ShopEase</Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/cart" className="cart-link">
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/orders">Orders</Link>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Hi, {user.name.split(' ')[0]}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
