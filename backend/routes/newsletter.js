const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// POST /api/newsletter/subscribe
router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email address required' });

  const existing = db.prepare('SELECT * FROM newsletter_subscribers WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    if (existing.confirmed) return res.status(200).json({ message: "You're already subscribed — stay tuned for drops! 🏉" });
    return res.status(200).json({ message: 'Check your inbox to confirm your subscription.' });
  }

  db.prepare('INSERT INTO newsletter_subscribers (id, email, confirmed) VALUES (?, ?, 1)').run(uuidv4(), email.toLowerCase());
  res.status(201).json({
    message: "You're in! 🎉 Welcome to the Collide Sport inner circle. Expect exclusive drops, early access, and rugby content you won't find anywhere else.",
    reward: 'Use code FIRSTORDER for 15% off your first purchase!',
  });
});

// DELETE /api/newsletter/unsubscribe
router.delete('/unsubscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  db.prepare('DELETE FROM newsletter_subscribers WHERE email = ?').run(email.toLowerCase());
  res.json({ message: 'You have been unsubscribed. We\'re sorry to see you go.' });
});

module.exports = router;
