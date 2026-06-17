const router = require('express').Router();
const db = require('../database');
const { optionalAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/products — list with filtering, sorting, search
router.get('/', optionalAuth, (req, res) => {
  const {
    category, subcategory, badge, in_stock,
    sort = 'featured', order = 'desc',
    q, min_price, max_price,
    page = 1, limit = 20,
  } = req.query;

  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category)    { sql += ' AND category = ?';    params.push(category.toUpperCase()); }
  if (subcategory) { sql += ' AND subcategory = ?'; params.push(subcategory.toUpperCase()); }
  if (badge)       { sql += ' AND badge = ?';       params.push(badge.toUpperCase()); }
  if (in_stock !== undefined) { sql += ' AND in_stock = ?'; params.push(in_stock === 'true' ? 1 : 0); }
  if (min_price)   { sql += ' AND price >= ?';      params.push(parseInt(min_price)); }
  if (max_price)   { sql += ' AND price <= ?';      params.push(parseInt(max_price)); }
  if (q) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  const allowedSorts = ['price', 'featured', 'created_at', 'name', 'stock_count'];
  const sortCol = allowedSorts.includes(sort) ? sort : 'featured';
  const sortDir = order === 'asc' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sortCol} ${sortDir}`;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  sql += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const products = db.prepare(sql).all(...params);

  // Attach variants
  const withVariants = products.map(p => ({
    ...p,
    price_zar: (p.price / 100).toFixed(2),
    variants: db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(p.id),
    avg_rating: db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND approved = 1').get(p.id),
  }));

  // Track analytics
  if (q) {
    db.prepare('INSERT INTO analytics_events (id, event_type, session_id, meta) VALUES (?, ?, ?, ?)').run(uuidv4(), 'search', req.headers['x-session-id'] || null, JSON.stringify({ q }));
  }

  res.json({ products: withVariants, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/products/featured
router.get('/featured', (req, res) => {
  const products = db.prepare('SELECT * FROM products WHERE featured = 1 AND in_stock = 1 ORDER BY badge DESC LIMIT 8').all();
  const result = products.map(p => ({
    ...p,
    price_zar: (p.price / 100).toFixed(2),
    variants: db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(p.id),
    avg_rating: db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND approved = 1').get(p.id),
  }));
  res.json({ products: result });
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const cats = db.prepare(`
    SELECT category, subcategory, COUNT(*) as product_count,
           MIN(price) as min_price, MAX(price) as max_price
    FROM products GROUP BY category, subcategory
  `).all();
  res.json({ categories: cats });
});

// GET /api/products/:slug
router.get('/:slug', optionalAuth, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(product.id);
  const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? AND approved = 1 ORDER BY created_at DESC').all(product.id);
  const avgRating = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND approved = 1').get(product.id);
  const related = db.prepare('SELECT id, name, slug, price, badge, in_stock FROM products WHERE category = ? AND id != ? AND in_stock = 1 LIMIT 4').all(product.category, product.id);

  // Track product view
  db.prepare('INSERT INTO analytics_events (id, event_type, product_id, session_id, user_id) VALUES (?, ?, ?, ?, ?)').run(
    uuidv4(), 'product_view', product.id,
    req.headers['x-session-id'] || null,
    req.user?.id || null
  );

  res.json({
    ...product,
    price_zar: (product.price / 100).toFixed(2),
    variants,
    reviews,
    avg_rating: avgRating,
    related,
  });
});

module.exports = router;
