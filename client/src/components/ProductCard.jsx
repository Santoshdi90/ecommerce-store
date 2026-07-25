import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  async function handleAddToCart() {
    if (!isLoggedIn) {
      alert('Please login to add items to your cart');
      return;
    }
    try {
      await addToCart(product.id, 1);
      // quick little feedback - could use a toast library later
      alert(`"${product.name}" added to cart!`);
    } catch (err) {
      alert('Failed to add to cart. Try again.');
    }
  }

  // generate star display
  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          onError={e => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
        />
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product.id}`}>
          <div className="product-card-name" title={product.name}>{product.name}</div>
        </Link>
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-rating">
          <span>{stars}</span> ({product.reviews} reviews)
        </div>
        <div className="product-card-price">${product.price.toFixed(2)}</div>
        <button className="btn btn-primary btn-full" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
