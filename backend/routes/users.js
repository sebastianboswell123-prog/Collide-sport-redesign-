const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db      = require('../database');
const { signToken, requireAuth } = require('../middleware/auth');
const { sendPasswordReset } = require('../email');

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email address' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const hashed = await bcrypt.hash(password, 12);
  const id = uuidv4();
  db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(id, email.toLowerCase(), hashed, name, 'customer');

  const token = signToken({ id, email: email.toLowerCase(), name, role: 'customer' });
  res.status(201).json({ message: 'Account created — welcome to Collide Sport!', token, user: { id, name, email: email.toLowerCase(), role: 'customer' } });
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  res.json({ message: `Welcome back, ${user.name}!`, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/users/me
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const orders = db.prepare('SELECT id, status, total, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(user.id);
  const wishlistCount = db.prepare('SELECT COUNT(*) as c FROM wishlist WHERE user_id = ?').get(user.id);

  res.json({ ...user, recent_orders: orders, wishlist_count: wishlistCount.c });
});

// PUT /api/users/me
router.put('/me', requireAuth, async (req, res) => {
  const { name, current_password, new_password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

  if (new_password) {
    if (!current_password) return res.status(400).json({ error: 'current_password required to change password' });
    const valid = await bcrypt.compare(current_password, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    if (new_password.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });
    const hashed = await bcrypt.hash(new_password, 12);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, user.id);
  }

  if (name) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, user.id);

  res.json({ message: 'Profile updated successfully' });
});

// GET /api/users/me/orders
router.get('/me/orders', requireAuth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  const withItems = orders.map(o => ({
    ...o,
    total_zar: (o.total / 100).toFixed(2),
    items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id),
    shipping_address: (() => { try { return JSON.parse(o.shipping_address); } catch { return o.shipping_address; } })(),
  }));
  res.json({ orders: withItems });
});

// POST /api/users/forgot-password ─────────────────────────────────────────────
// User submits their email → we send a reset link (valid 1 hour, single use)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required' });

  // Always return the same response — don't reveal whether the email exists
  const genericResponse = { message: "If that email is registered, you'll receive a reset link shortly." };

  const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) return res.json(genericResponse);

  // Invalidate any existing unused tokens for this user
  db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0').run(user.id);

  // Generate a secure random token
  const rawToken  = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.prepare('INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)').run(uuidv4(), user.id, tokenHash, expiresAt);

  const clientUrl = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const resetUrl  = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

  sendPasswordReset(user.email, resetUrl).catch(err => console.error('📧  Reset email error:', err));

  console.log(`🔑  Password reset requested for ${user.email}`);
  res.json(genericResponse);
});

// POST /api/users/reset-password ──────────────────────────────────────────────
// User submits token + new password → verify token → update password
router.post('/reset-password', async (req, res) => {
  const { email, token, new_password } = req.body;
  if (!email || !token || !new_password) return res.status(400).json({ error: 'email, token and new_password are required' });
  if (new_password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) return res.status(400).json({ error: 'Invalid or expired reset link' });

  const tokenHash  = crypto.createHash('sha256').update(token).digest('hex');
  const resetToken = db.prepare(`
    SELECT * FROM password_reset_tokens
    WHERE user_id = ? AND token_hash = ? AND used = 0 AND expires_at > datetime('now')
  `).get(user.id, tokenHash);

  if (!resetToken) return res.status(400).json({ error: 'This reset link is invalid or has expired. Please request a new one.' });

  // Mark token as used and update password — both in one transaction
  const hashed = await bcrypt.hash(new_password, 12);
  db.transaction(() => {
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, user.id);
    db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?').run(resetToken.id);
  })();

  console.log(`🔑  Password reset successful for ${email}`);
  res.json({ message: 'Password updated successfully. You can now log in with your new password.' });
});

module.exports = router;
