const router = require('express').Router();

const db = require('../database');

// POST /api/discounts/validate — validate a code against a cart total
router.post('/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'code required' });

  const discount = db.prepare('SELECT * FROM discount_codes WHERE code = ? AND active = 1').get(code.toUpperCase());
  if (!discount) return res.status(404).json({ valid: false, error: 'Discount code not found or inactive' });
  if (discount.expires_at && new Date(discount.expires_at) < new Date()) return res.status(400).json({ valid: false, error: 'This code has expired' });
  if (discount.max_uses && discount.uses_count >= discount.max_uses) return res.status(400).json({ valid: false, error: 'This code has reached its usage limit' });

  const sub = parseInt(subtotal) || 0;
  const saving = Math.round(sub * discount.discount_percent / 100);

  res.json({
    valid: true,
    code: discount.code,
    discount_percent: discount.discount_percent,
    saving,
    saving_zar: (saving / 100).toFixed(2),
    message: `🎉 Code applied! You save R${(saving / 100).toFixed(2)} (${discount.discount_percent}% off)`,
  });
});

module.exports = router;
