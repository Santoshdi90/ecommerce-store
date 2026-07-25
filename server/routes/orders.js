const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');
const ordersFile = path.join(__dirname, '../data/orders.json');
const productsFile = path.join(__dirname, '../data/products.json');

function getUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}
function saveUsers(u) {
  fs.writeFileSync(usersFile, JSON.stringify(u, null, 2));
}
function getOrders() {
  return JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
}
function saveOrders(o) {
  fs.writeFileSync(ordersFile, JSON.stringify(o, null, 2));
}
function getProducts() {
  return JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
}

// POST /api/orders/checkout — place order (dummy, no real payment)
router.post('/checkout', verifyToken, (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const cart = users[userIndex].cart || [];
  if (cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const products = getProducts();

  // Build order items with product snapshot
  const items = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      name: product ? product.name : 'Unknown',
      price: product ? product.price : 0,
      quantity: item.quantity,
      image: product ? product.image : ''
    };
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = {
    id: uuidv4(),
    userId: req.user.id,
    items,
    address,
    total: parseFloat(total.toFixed(2)),
    status: 'confirmed',
    placedAt: new Date().toISOString()
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  // Clear cart after successful order
  users[userIndex].cart = [];
  saveUsers(users);

  res.status(201).json({ message: 'Order placed successfully!', order });
});

// GET /api/orders — get current user's orders
router.get('/', verifyToken, (req, res) => {
  const orders = getOrders();
  const userOrders = orders.filter(o => o.userId === req.user.id);
  // Return newest first
  userOrders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  res.json(userOrders);
});

module.exports = router;
