const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { optionalAuth } = require('../middleware/auth');

// GET /api/reviews — all approved reviews (optionally filter by product)
router.get('/', (req, res) => {
  const { product_id, product_slug, rating, limit = 20, page = 1 } = req.query;
  let sql = 'SELECT r.*, p.name as product_name, p.slug as product_slug FROM reviews r JOIN products p ON r.product_id = p.id WHERE r.approved = 1';
  const params = [];

  if (product_id) { sql += ' AND r.product_id = ?'; params.push(product_id); }
  if (product_slug) { sql += ' AND p.slug = ?'; params.push(product_slug); }
  if (rating) { sql += ' AND r.rating = ?'; params.push(parseInt(rating)); }

  sql += ' ORDER BY r.verified DESC, r.created_at DESC';
  sql += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  const reviews = db.prepare(sql).all(...params);

  const stats = db.prepare(`
    SELECT COUNT(*) as total, AVG(rating) as avg_rating,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM reviews WHERE approved = 1
  `).get();

  res.json({ reviews, stats });
});

// POST /api/reviews — submit a review
router.post('/', optionalAuth, (req, res) => {
  const { product_id, name, role, rating, text } = req.body;
  if (!product_id || !name || !rating || !text) return res.status(400).json({ error: 'product_id, name, rating and text are required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  if (text.length < 20) return res.status(400).json({ error: 'Review must be at least 20 characters' });

  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const id = uuidv4();
  db.prepare('INSERT INTO reviews (id, product_id, user_id, name, role, rating, text, verified, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, product_id, req.user?.id || null, name, role || null, parseInt(rating), text, req.user?.id ? 1 : 0, 1);

  res.status(201).json({ message: 'Review submitted — thank you for your feedback!', review_id: id });
});

module.exports = router;
