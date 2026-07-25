const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');
const productsFile = path.join(__dirname, '../data/products.json');

function getUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function getProducts() {
  return JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
}

// GET /api/cart — get current user's cart
router.get('/', verifyToken, (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Attach product details to each cart item
  const products = getProducts();
  const cartWithDetails = user.cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  });

  res.json(cartWithDetails);
});

// POST /api/cart/add
router.post('/add', verifyToken, (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'productId and quantity required' });
  }

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const cart = users[userIndex].cart || [];
  const existingIndex = cart.findIndex(item => item.productId === productId);

  if (existingIndex !== -1) {
    // Update quantity if already in cart
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  users[userIndex].cart = cart;
  saveUsers(users);

  res.json({ message: 'Added to cart', cart });
});

// PUT /api/cart/update
router.put('/update', verifyToken, (req, res) => {
  const { productId, quantity } = req.body;

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const cart = users[userIndex].cart || [];
  const itemIndex = cart.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not in cart' });
  }

  if (quantity <= 0) {
    // Remove if quantity is 0
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = quantity;
  }

  users[userIndex].cart = cart;
  saveUsers(users);

  res.json({ message: 'Cart updated', cart });
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', verifyToken, (req, res) => {
  const productId = parseInt(req.params.productId);

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  users[userIndex].cart = (users[userIndex].cart || []).filter(
    item => item.productId !== productId
  );
  saveUsers(users);

  res.json({ message: 'Item removed from cart' });
});

module.exports = router;
