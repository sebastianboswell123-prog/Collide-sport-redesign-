const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { optionalAuth } = require('../middleware/auth');

function getCart(user_id, session_id) {
  let sql, params;
  if (user_id) {
    sql = 'SELECT c.*, p.name, p.slug, p.price, p.in_stock, v.color_name, v.color_hex, v.size, v.stock_count as variant_stock FROM cart_items c JOIN products p ON c.product_id = p.id LEFT JOIN product_variants v ON c.variant_id = v.id WHERE c.user_id = ?';
    params = [user_id];
  } else {
    sql = 'SELECT c.*, p.name, p.slug, p.price, p.in_stock, v.color_name, v.color_hex, v.size, v.stock_count as variant_stock FROM cart_items c JOIN products p ON c.product_id = p.id LEFT JOIN product_variants v ON c.variant_id = v.id WHERE c.session_id = ? AND c.user_id IS NULL';
    params = [session_id];
  }
  const items = db.prepare(sql).all(...params);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return {
    items: items.map(i => ({ ...i, price_zar: (i.price / 100).toFixed(2), line_total_zar: ((i.price * i.quantity) / 100).toFixed(2) })),
    item_count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    subtotal_zar: (subtotal / 100).toFixed(2),
  };
}

// GET /api/cart
router.get('/', optionalAuth, (req, res) => {
  const sid = req.headers['x-session-id'];
  res.json(getCart(req.user?.id, sid));
});

// POST /api/cart — add item
router.post('/', optionalAuth, (req, res) => {
  const { product_id, variant_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!product.in_stock) return res.status(400).json({ error: 'Product is out of stock' });

  const sid = req.headers['x-session-id'] || uuidv4();

  // Check existing item
  let existing;
  if (req.user?.id) {
    existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))').get(req.user.id, product_id, variant_id, variant_id);
  } else {
    existing = db.prepare('SELECT * FROM cart_items WHERE session_id = ? AND user_id IS NULL AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))').get(sid, product_id, variant_id, variant_id);
  }

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
  } else {
    db.prepare('INSERT INTO cart_items (id, session_id, user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?, ?)').run(uuidv4(), sid, req.user?.id || null, product_id, variant_id || null, quantity);
  }

  res.json({ message: 'Added to cart', session_id: sid, cart: getCart(req.user?.id, sid) });
});

// PATCH /api/cart/:item_id — update quantity
router.patch('/:item_id', optionalAuth, (req, res) => {
  const quantity = parseInt(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: 'quantity must be a whole number >= 1' });
  db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.item_id);
  const sid = req.headers['x-session-id'];
  res.json({ message: 'Cart updated', cart: getCart(req.user?.id, sid) });
});

// DELETE /api/cart/:item_id — remove item
router.delete('/:item_id', optionalAuth, (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.item_id);
  const sid = req.headers['x-session-id'];
  res.json({ message: 'Item removed', cart: getCart(req.user?.id, sid) });
});

// DELETE /api/cart — clear entire cart
router.delete('/', optionalAuth, (req, res) => {
  const sid = req.headers['x-session-id'];
  if (req.user?.id) {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
  } else {
    db.prepare('DELETE FROM cart_items WHERE session_id = ? AND user_id IS NULL').run(sid);
  }
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
