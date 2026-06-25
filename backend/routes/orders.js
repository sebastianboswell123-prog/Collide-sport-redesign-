const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { sendOrderConfirmation, sendShippingUpdate } = require('../email');

function calcShipping(method, subtotal) {
  // Free shipping over R800
  if (subtotal >= 80000) return 0;
  const rates = { standard: 5000, express: 9900, overnight: 14900, collect: 0 };
  return rates[method] || 5000;
}

function generateTracking() {
  return `CS${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

// POST /api/orders — create order from cart or direct payload
router.post('/', optionalAuth, (req, res) => {
  const { email, shipping_address, shipping_method = 'standard', discount_code, items, notes } = req.body;

  if (!email || !shipping_address) return res.status(400).json({ error: 'email and shipping_address are required' });
  if (!items || items.length === 0) return res.status(400).json({ error: 'Order must contain at least one item' });

  // Validate and price each item
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (!product) return res.status(400).json({ error: `Product ${item.product_id} not found` });
    if (!product.in_stock) return res.status(400).json({ error: `${product.name} is out of stock` });

    let variantLabel = null;
    if (item.variant_id) {
      const v = db.prepare('SELECT * FROM product_variants WHERE id = ?').get(item.variant_id);
      if (v) variantLabel = [v.color_name, v.size].filter(Boolean).join(' / ');
    }

    const lineTotal = product.price * (item.quantity || 1);
    subtotal += lineTotal;
    orderItems.push({
      id: uuidv4(),
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      product_name: product.name,
      variant_label: variantLabel,
      quantity: item.quantity || 1,
      price_at_purchase: product.price,
    });
  }

  // Discount code
  let discountAmount = 0;
  let usedCode = null;
  if (discount_code) {
    const code = db.prepare('SELECT * FROM discount_codes WHERE code = ? AND active = 1').get(discount_code.toUpperCase());
    if (!code) return res.status(400).json({ error: 'Invalid or inactive discount code' });
    if (code.expires_at && new Date(code.expires_at) < new Date()) return res.status(400).json({ error: 'Discount code has expired' });
    if (code.max_uses && code.uses_count >= code.max_uses) return res.status(400).json({ error: 'Discount code usage limit reached' });
    discountAmount = Math.round(subtotal * code.discount_percent / 100);
    usedCode = code.code;
    db.prepare('UPDATE discount_codes SET uses_count = uses_count + 1 WHERE id = ?').run(code.id);
  }

  const shippingCost = calcShipping(shipping_method, subtotal - discountAmount);
  const total = subtotal - discountAmount + shippingCost;
  const orderId = uuidv4();
  const tracking = generateTracking();

  const createOrder = db.transaction(() => {
    db.prepare(`
      INSERT INTO orders (id, user_id, email, status, subtotal, shipping_cost, discount_amount, total, discount_code, shipping_method, shipping_address, tracking_number, notes)
      VALUES (?, ?, ?, 'confirmed', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(orderId, req.user?.id || null, email.toLowerCase(), subtotal, shippingCost, discountAmount, total, usedCode, shipping_method, JSON.stringify(shipping_address), tracking, notes || null);

    for (const oi of orderItems) {
      db.prepare('INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, variant_label, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(oi.id, orderId, oi.product_id, oi.variant_id, oi.product_name, oi.variant_label, oi.quantity, oi.price_at_purchase);

      // Decrement stock on both the product and variant
      db.prepare('UPDATE products SET stock_count = MAX(0, stock_count - ?), in_stock = CASE WHEN stock_count - ? <= 0 THEN 0 ELSE 1 END WHERE id = ?').run(oi.quantity, oi.quantity, oi.product_id);
      if (oi.variant_id) {
        db.prepare('UPDATE product_variants SET stock_count = MAX(0, stock_count - ?) WHERE id = ?').run(oi.quantity, oi.variant_id);
      }
    }

    // Clear user cart if logged in
    if (req.user?.id) {
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
    }
  });

  createOrder();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

  // Send confirmation email (non-blocking — don't fail the response if email errors)
  sendOrderConfirmation(order, orderItems).catch(err => console.error('📧  Confirmation email error:', err));

  res.status(201).json({
    message: '🎉 Order confirmed! Thank you for choosing Collide Sport.',
    order: {
      ...order,
      subtotal_zar: (subtotal / 100).toFixed(2),
      shipping_cost_zar: (shippingCost / 100).toFixed(2),
      discount_amount_zar: (discountAmount / 100).toFixed(2),
      total_zar: (total / 100).toFixed(2),
      items: orderItems,
      tracking_number: tracking,
      estimated_delivery: shipping_method === 'overnight' ? '1 business day' : shipping_method === 'express' ? '2-3 business days' : '3-5 business days',
    },
  });
});

// GET /api/orders/:id — track order (public with order ID)
router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const statusMap = {
    pending:   { label: 'Order Received', icon: '📦', step: 1 },
    confirmed: { label: 'Confirmed & Processing', icon: '✅', step: 2 },
    packed:    { label: 'Packed & Ready to Ship', icon: '📫', step: 3 },
    shipped:   { label: 'Out for Delivery', icon: '🚚', step: 4 },
    delivered: { label: 'Delivered', icon: '🏉', step: 5 },
    cancelled: { label: 'Cancelled', icon: '❌', step: 0 },
  };

  res.json({
    id: order.id,
    email: order.email,
    status: order.status,
    status_info: statusMap[order.status] || statusMap.pending,
    tracking_number: order.tracking_number,
    total_zar: (order.total / 100).toFixed(2),
    shipping_method: order.shipping_method,
    created_at: order.created_at,
    items,
    message: `Your order is ${statusMap[order.status]?.label || 'being processed'}. Tracking: ${order.tracking_number}`,
  });
});

// POST /api/orders/:id/cancel — customer cancels their own order
router.post('/:id/cancel', requireAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.user_id !== req.user.id) return res.status(403).json({ error: 'You can only cancel your own orders' });

  const cancellable = ['pending', 'confirmed'];
  if (!cancellable.includes(order.status)) {
    return res.status(400).json({
      error: `This order cannot be cancelled — it is already "${order.status}". Please contact us on 082 780 4116 for help.`,
    });
  }

  // Restore stock for each item
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  db.transaction(() => {
    db.prepare(`UPDATE orders SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?`).run(order.id);

    for (const item of items) {
      db.prepare(`
        UPDATE products
        SET stock_count = stock_count + ?,
            in_stock = 1
        WHERE id = ?
      `).run(item.quantity, item.product_id);

      if (item.variant_id) {
        db.prepare('UPDATE product_variants SET stock_count = stock_count + ? WHERE id = ?').run(item.quantity, item.variant_id);
      }
    }
  })();

  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
  sendShippingUpdate(updatedOrder).catch(err => console.error('📧  Cancellation email error:', err));

  res.json({ message: 'Your order has been cancelled. Stock has been restored.' });
});

module.exports = router;
