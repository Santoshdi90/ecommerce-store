const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const productsFile = path.join(__dirname, '../data/products.json');

function getProducts() {
  const data = fs.readFileSync(productsFile, 'utf-8');
  return JSON.parse(data);
}

// GET /api/products — supports ?search= and ?category=
router.get('/', (req, res) => {
  let products = getProducts();
  const { search, category } = req.query;

  if (category && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

module.exports = router;
