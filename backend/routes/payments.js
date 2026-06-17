const router   = require('express').Router();
const crypto   = require('crypto');
const https    = require('https');
const db       = require('../database');
const { sendOrderConfirmation, sendPaymentFailed } = require('../email');

// ── PayFast config ────────────────────────────────────────────────────────────
const SANDBOX = process.env.NODE_ENV !== 'production';
const PF_HOST = SANDBOX ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
const PF_URL  = `https://${PF_HOST}/eng/process`;

const MERCHANT_ID  = process.env.PAYFAST_MERCHANT_ID  || '10000100';   // sandbox default
const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a'; // sandbox default
const PASSPHRASE   = process.env.PAYFAST_PASSPHRASE   || '';

const CLIENT_URL   = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const API_URL      = process.env.API_URL        || 'http://localhost:3000';

// ── Helpers ───────────────────────────────────────────────────────────────────

// Build a sorted query string and MD5-hash it for signature
function buildSignature(data, passphrase = '') {
  const params = { ...data };
  if (passphrase) params.passphrase = passphrase;

  const query = Object.keys(params)
    .sort()
    .filter(k => params[k] !== '' && params[k] !== null && params[k] !== undefined)
    .map(k => `${k}=${encodeURIComponent(String(params[k]).trim()).replace(/%20/g, '+')}`)
    .join('&');

  return crypto.createHash('md5').update(query).digest('hex');
}

// Verify PayFast ITN by re-posting to their validation endpoint
function verifyITN(pfData) {
  return new Promise((resolve) => {
    const pfParamString = Object.keys(pfData)
      .filter(k => k !== 'signature')
      .map(k => `${k}=${encodeURIComponent(pfData[k]).replace(/%20/g, '+')}`)
      .join('&');

    const options = {
      hostname: PF_HOST,
      path: '/eng/query/validate',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': pfParamString.length },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve(body.trim() === 'VALID'));
    });
    req.on('error', () => resolve(false));
    req.write(pfParamString);
    req.end();
  });
}

// ── POST /api/payments/initiate ───────────────────────────────────────────────
// Call this with an order_id after the order is created.
// Returns the PayFast endpoint URL and all the form fields needed to redirect.
router.post('/initiate', (req, res) => {
  const { order_id } = req.body;
  if (!order_id) return res.status(400).json({ error: 'order_id required' });

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(order_id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.payment_status === 'paid') return res.status(400).json({ error: 'Order is already paid' });

  // PayFast expects ZAR with 2 decimal places
  const amount = (order.total / 100).toFixed(2);

  const pfData = {
    merchant_id:   MERCHANT_ID,
    merchant_key:  MERCHANT_KEY,
    return_url:    `${CLIENT_URL}/order-success?id=${order.id}`,
    cancel_url:    `${CLIENT_URL}/cart?payment=cancelled`,
    notify_url:    `${API_URL}/api/payments/notify`,
    m_payment_id:  order.id,
    amount,
    item_name:     `Collide Sport Order ${order.tracking_number}`,
    item_description: `${order.tracking_number} — ${order.email}`,
    email_address: order.email,
    custom_str1:   order.id,
  };

  pfData.signature = buildSignature(pfData, PASSPHRASE);

  console.log(`💳  PayFast payment initiated for order ${order.tracking_number} — ${SANDBOX ? 'SANDBOX' : 'LIVE'}`);

  res.json({
    payfast_url: PF_URL,
    fields: pfData,
    sandbox: SANDBOX,
    instructions: SANDBOX
      ? 'Sandbox mode — use test card details from https://developers.payfast.co.za/docs#step_4_test_your_integration'
      : 'Live mode — real payment will be processed',
  });
});

// ── POST /api/payments/notify (PayFast ITN webhook) ───────────────────────────
// PayFast calls this URL automatically after every payment attempt.
// Must return HTTP 200 for PayFast to consider the notification received.
router.post('/notify', async (req, res) => {
  // Always acknowledge immediately
  res.status(200).send('OK');

  const pfData    = req.body;
  const orderId   = pfData.custom_str1 || pfData.m_payment_id;
  const pfStatus  = pfData.payment_status; // 'COMPLETE' | 'FAILED' | 'CANCELLED'

  if (!orderId) return console.log('⚠️  PayFast ITN received with no order ID');

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!order) return console.log(`⚠️  PayFast ITN: order ${orderId} not found`);

  // ── Security checks ──────────────────────────────────────────────────────

  // 1. Verify signature
  const expectedSig = buildSignature(
    Object.fromEntries(Object.entries(pfData).filter(([k]) => k !== 'signature')),
    PASSPHRASE,
  );
  if (pfData.signature !== expectedSig) {
    return console.log(`🚨  PayFast ITN signature mismatch for order ${orderId}`);
  }

  // 2. Verify amount matches (prevent manipulation)
  const expectedAmount = (order.total / 100).toFixed(2);
  if (parseFloat(pfData.amount_gross) !== parseFloat(expectedAmount)) {
    return console.log(`🚨  PayFast ITN amount mismatch for order ${orderId}: expected ${expectedAmount}, got ${pfData.amount_gross}`);
  }

  // 3. Verify with PayFast server (skip in sandbox to avoid network issues)
  if (!SANDBOX) {
    const valid = await verifyITN(pfData);
    if (!valid) return console.log(`🚨  PayFast ITN server validation failed for order ${orderId}`);
  }

  // ── Update order ─────────────────────────────────────────────────────────
  if (pfStatus === 'COMPLETE') {
    db.prepare(`UPDATE orders SET payment_status = 'paid', status = 'confirmed', updated_at = datetime('now') WHERE id = ?`).run(orderId);
    console.log(`✅  Payment COMPLETE for order ${order.tracking_number}`);

    // Send confirmation email
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    sendOrderConfirmation(updatedOrder, items).catch(err => console.error('Email error:', err));

  } else if (pfStatus === 'FAILED' || pfStatus === 'CANCELLED') {
    db.prepare(`UPDATE orders SET payment_status = 'failed', status = 'cancelled', updated_at = datetime('now') WHERE id = ?`).run(orderId);
    console.log(`❌  Payment ${pfStatus} for order ${order.tracking_number}`);

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    sendPaymentFailed(updatedOrder).catch(err => console.error('Email error:', err));
  }
});

// ── GET /api/payments/status/:order_id ───────────────────────────────────────
// Frontend polls this to check payment status after returning from PayFast
router.get('/status/:order_id', (req, res) => {
  const order = db.prepare('SELECT id, status, payment_status, tracking_number, total FROM orders WHERE id = ?').get(req.params.order_id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({
    order_id:       order.id,
    payment_status: order.payment_status || 'pending',
    order_status:   order.status,
    tracking_number: order.tracking_number,
    total_zar:      (order.total / 100).toFixed(2),
    paid:           order.payment_status === 'paid',
  });
});

module.exports = router;
