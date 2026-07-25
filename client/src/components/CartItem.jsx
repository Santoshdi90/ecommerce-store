import React from 'react';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  if (!item.product) return null;

  function handleDecrease() {
    if (item.quantity <= 1) {
      removeFromCart(item.productId);
    } else {
      updateQuantity(item.productId, item.quantity - 1);
    }
  }

  function handleIncrease() {
    updateQuantity(item.productId, item.quantity + 1);
  }

  return (
    <div className="cart-item">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="cart-item-img"
        onError={e => { e.target.src = 'https://via.placeholder.com/80?text=?'; }}
      />
      <div className="cart-item-info">
        <div className="cart-item-name">{item.product.name}</div>
        <div className="cart-item-price">${item.product.price.toFixed(2)} each</div>
        <div className="cart-item-controls">
          <button className="qty-btn" onClick={handleDecrease}>−</button>
          <span className="cart-item-qty">{item.quantity}</span>
          <button className="qty-btn" onClick={handleIncrease}>+</button>
          <button
            className="btn btn-danger"
            style={{ padding: '4px 10px', fontSize: '0.8rem', marginLeft: '8px' }}
            onClick={() => removeFromCart(item.productId)}
          >
            Remove
          </button>
        </div>
      </div>
      <div style={{ fontWeight: '600', color: '#1e293b', minWidth: '80px', textAlign: 'right' }}>
        ${(item.product.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}

export default CartItem;
