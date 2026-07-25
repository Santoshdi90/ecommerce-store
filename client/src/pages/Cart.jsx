import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

function Cart() {
  const { isLoggedIn } = useAuth();
  const { cartItems, cartTotal, loading } = useCart();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="empty-state">
        <h3>Please login to view your cart</h3>
        <br />
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <h3>Your cart is empty</h3>
        <p>Browse our products and add something you like!</p>
        <br />
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const finalTotal = cartTotal + shipping;

  return (
    <div>
      <h1 className="page-title">Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items-list">
          <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </h3>
          {cartItems.map(item => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
              Add ${(50 - cartTotal).toFixed(2)} more for free shipping
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
          <br />
          <button
            className="btn btn-primary btn-full"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <br />
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '10px', fontSize: '0.88rem', color: '#2563eb' }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
