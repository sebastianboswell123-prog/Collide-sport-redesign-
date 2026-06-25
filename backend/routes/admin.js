const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { requireAdmin, signToken } = require('../middleware/auth');
const { sendShippingUpdate } = require('../email');

// Bootstrap admin account (one-time, if no admin exists)
router.post('/bootstrap', async (req, res) => {
  const existing = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
  if (existing) return res.status(403).json({ error: 'Admin account already exists' });

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });

  const hashed = await bcrypt.hash(password, 12);
  const id = uuidv4();
  db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(id, email.toLowerCase(), hashed, name, 'admin');
  const token = signToken({ id, email: email.toLowerCase(), name, role: 'admin' });
  res.status(201).json({ message: '✅ Admin account created', token });
});

// All routes below require admin
router.use(requireAdmin);

// GET /api/admin/dashboard
router.get('/dashboard', (req, res) => {
  const stats = {
    total_orders: db.prepare("SELECT COUNT(*) as c FROM orders").get().c,
    pending_orders: db.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'pending' OR status = 'confirmed'").get().c,
    total_revenue: db.prepare("SELECT SUM(total) as s FROM orders WHERE status != 'cancelled'").get().s || 0,
    total_customers: db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").get().c,
    newsletter_subscribers: db.prepare("SELECT COUNT(*) as c FROM newsletter_subscribers").get().c,
    total_reviews: db.prepare("SELECT COUNT(*) as c FROM reviews").get().c,
    low_stock_products: db.prepare("SELECT id, name, stock_count FROM products WHERE stock_count < 10 AND in_stock = 1").all(),
    top_products: db.prepare(`
      SELECT p.name, p.slug, COUNT(ae.id) as views
      FROM products p
      LEFT JOIN analytics_events ae ON ae.product_id = p.id AND ae.event_type = 'product_view'
      GROUP BY p.id ORDER BY views DESC LIMIT 5
    `).all(),
    recent_orders: db.prepare("SELECT id, email, status, total, created_at FROM orders ORDER BY created_at DESC LIMIT 10").all().map(o => ({ ...o, total_zar: (o.total / 100).toFixed(2) })),
  };
  stats.total_revenue_zar = (stats.total_revenue / 100).toFixed(2);
  res.json(stats);
});

// GET /api/admin/orders
router.get('/orders', (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  let sql = 'SELECT * FROM orders';
  const params = [];
  if (status) { sql += ' WHERE status = ?'; params.push(status); }
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
  const orders = db.prepare(sql).all(...params).map(o => ({ ...o, total_zar: (o.total / 100).toFixed(2), shipping_address: (() => { try { return JSON.parse(o.shipping_address); } catch { return o.shipping_address; } })() }));
  res.json({ orders });
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });

  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);

  // Send customer email for meaningful status changes
  const emailStatuses = ['packed', 'shipped', 'delivered', 'cancelled'];
  if (emailStatuses.includes(status)) {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (order) {
      sendShippingUpdate(order).catch(err => console.error('📧  Status email error:', err));
    }
  }

  res.json({ message: `Order status updated to "${status}"` });
});

// POST /api/admin/products — create a new product
router.post('/products', (req, res) => {
  const { name, slug, category, subcategory, price, description, badge, in_stock = 1, stock_count = 0, featured = 0, image_url } = req.body;

  if (!name || !slug || !category || price === undefined) {
    return res.status(400).json({ error: 'name, slug, category and price are required' });
  }

  const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
  if (existing) return res.status(409).json({ error: `A product with slug "${slug}" already exists` });

  const id = uuidv4();
  db.prepare(`
    INSERT INTO products (id, name, slug, category, subcategory, price, description, badge, in_stock, stock_count, featured, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    name,
    slug.toLowerCase().replace(/\s+/g, '-'),
    category.toUpperCase(),
    subcategory ? subcategory.toUpperCase() : null,
    Math.round(parseFloat(price) * 100),   // rands → cents
    description || null,
    badge || null,
    in_stock ? 1 : 0,
    parseInt(stock_count),
    featured ? 1 : 0,
    image_url || null,
  );

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.status(201).json({ message: `Product "${name}" created successfully`, product: { ...product, price_zar: (product.price / 100).toFixed(2) } });
});

// GET /api/admin/products
router.get('/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY category, name').all().map(p => ({
    ...p, price_zar: (p.price / 100).toFixed(2),
    variants: db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(p.id),
  }));
  res.json({ products });
});

// PATCH /api/admin/products/:id
router.patch('/products/:id', (req, res) => {
  const { price, stock_count, in_stock, badge, featured } = req.body;
  const updates = [];
  const params = [];
  if (price !== undefined) { updates.push('price = ?'); params.push(Math.round(price * 100)); }
  if (stock_count !== undefined) { updates.push('stock_count = ?'); params.push(stock_count); }
  if (in_stock !== undefined) { updates.push('in_stock = ?'); params.push(in_stock ? 1 : 0); }
  if (badge !== undefined) { updates.push('badge = ?'); params.push(badge || null); }
  if (featured !== undefined) { updates.push('featured = ?'); params.push(featured ? 1 : 0); }
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  params.push(req.params.id);
  db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  res.json({ message: 'Product updated' });
});

// GET /api/admin/subscribers
router.get('/subscribers', (req, res) => {
  const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
  res.json({ subscribers, total: subscribers.length });
});

// GET /api/admin/analytics
router.get('/analytics', (req, res) => {
  const daysInt = Math.min(Math.max(parseInt(req.query.days) || 30, 1), 365);
  const events = db.prepare(`
    SELECT event_type, COUNT(*) as count, DATE(created_at) as date
    FROM analytics_events
    WHERE created_at >= datetime('now', ? || ' days')
    GROUP BY event_type, DATE(created_at)
    ORDER BY date DESC
  `).all(`-${daysInt}`);
  const topSearches = db.prepare(`
    SELECT json_extract(meta, '$.q') as query, COUNT(*) as count
    FROM analytics_events WHERE event_type = 'search' AND meta IS NOT NULL
    GROUP BY query ORDER BY count DESC LIMIT 10
  `).all();
  res.json({ events, top_searches: topSearches });
});

module.exports = router;
