import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Checkout() {
  const { isLoggedIn, token } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();


  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(null);

  if (!isLoggedIn) {
    return (
      <div className="empty-state">
        <h3>Please login to checkout</h3>
        <br />
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="empty-state">
        <h3>Your cart is empty</h3>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { fullName, email, address, city, pincode, state } = form;

    if (!fullName || !email || !address || !city || !pincode || !state) {
      setError('Please fill in all required fields.');
      return;
    }

    const addressStr = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

    setPlacing(true);
    try {
      const res = await axios.post('/api/orders/checkout',
        { address: addressStr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearCart();
      setOrderPlaced(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order <strong>#{orderPlaced.id.slice(0, 8).toUpperCase()}</strong> has been confirmed.</p>
          <p style={{ marginBottom: '8px' }}>Total paid: <strong>${orderPlaced.total}</strong></p>
          <p>Shipping to: {orderPlaced.address}</p>
          <br />
          <Link to="/orders" className="btn btn-primary" style={{ marginRight: '10px' }}>View My Orders</Link>
          <Link to="/" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        <div className="checkout-container" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Shipping Details</h3>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  className="form-input"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-input"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                className="form-input"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  className="form-input"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  className="form-input"
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            <div className="form-group">
              <label>PIN Code *</label>
              <input
                className="form-input"
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="400001"
                maxLength={6}
              />
            </div>

            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '12px', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                💳 <strong>Payment:</strong> This is a demo checkout. No real payment is processed.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={placing}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* order summary sidebar */}
        <div className="cart-summary">
          <h3>Your Order ({cartItems.length} items)</h3>
          {cartItems.map(item => (
            <div key={item.productId} className="summary-row">
              <span style={{ fontSize: '0.85rem' }}>
                {item.product?.name?.substring(0, 22)}... × {item.quantity}
              </span>
              <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
