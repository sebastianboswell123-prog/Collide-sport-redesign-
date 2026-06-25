const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

// GET /api/wishlist
router.get('/', requireAuth, (req, res) => {
  const items = db.prepare(`
    SELECT w.id, w.added_at, p.id as product_id, p.name, p.slug, p.price, p.badge, p.in_stock, p.category
    FROM wishlist w JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ? ORDER BY w.added_at DESC
  `).all(req.user.id);
  res.json({ items: items.map(i => ({ ...i, price_zar: (i.price / 100).toFixed(2) })) });
});

// POST /api/wishlist
router.post('/', requireAuth, (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });

  const product = db.prepare('SELECT id, name FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
  if (existing) return res.status(409).json({ message: `${product.name} is already on your wishlist` });

  db.prepare('INSERT INTO wishlist (id, user_id, product_id) VALUES (?, ?, ?)').run(uuidv4(), req.user.id, product_id);
  res.status(201).json({ message: `${product.name} added to your wishlist ❤️` });
});

// DELETE /api/wishlist/:product_id
router.delete('/:product_id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, req.params.product_id);
  res.json({ message: 'Removed from wishlist' });
});

module.exports = router;
