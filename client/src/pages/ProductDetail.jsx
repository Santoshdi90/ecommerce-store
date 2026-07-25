import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  async function handleAddToCart() {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      alert(`Added ${quantity} x "${product.name}" to your cart!`);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  }

  const stars = product
    ? '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating))
    : '';

  if (loading) return <div className="loading">Loading product...</div>;

  if (!product) {
    return (
      <div className="empty-state">
        <h3>Product not found</h3>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="back-link">← Back to Products</Link>

      <div className="product-detail">
        <img
          src={product.image}
          alt={product.name}
          className="product-detail-img"
          onError={e => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
        />

        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
            {product.category}
          </div>
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-price">${product.price.toFixed(2)}</div>

          <div className="product-detail-meta">
            <span style={{ color: '#f59e0b' }}>{stars}</span>
            {' '}{product.rating} / 5 · {product.reviews} reviews · {product.stock} in stock
          </div>

          <p className="product-detail-desc">{product.description}</p>

          <div className="quantity-control">
            <span style={{ fontSize: '0.9rem', color: '#475569' }}>Qty:</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >−</button>
            <span className="qty-display">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            >+</button>
          </div>

          <button
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem' }}
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>

          {!isLoggedIn && (
            <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#64748b' }}>
              <Link to="/login" style={{ color: '#2563eb' }}>Login</Link> to add items to your cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
