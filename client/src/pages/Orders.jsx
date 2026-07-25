import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Orders() {
  const { isLoggedIn, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  async function fetchOrders() {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="empty-state">
        <h3>Please login to view your orders</h3>
        <br />
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h3>No orders yet</h3>
        <p>When you place an order it will appear here.</p>
        <br />
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </div>
                <div className="order-id">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
              </div>
              <span className="order-status">{order.status}</span>
            </div>

            <div className="order-items-preview">
              {order.items.map((item, idx) => (
                <div key={idx} title={item.name}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/60?text=?'; }}
                  />
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '6px' }}>
              📦 Ships to: {order.address}
            </div>

            <div className="order-total">${order.total.toFixed(2)}</div>
            <div className="order-date">
              Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
