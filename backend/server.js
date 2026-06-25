require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { WebSocketServer } = require('ws');
const db = require('./database');
const errorHandler = require('./middleware/errorHandler');

const DIST = path.join(__dirname, '../dist');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// ── WebSocket (declared first so /health can reference wss.clients.size) ─────
const wss = new WebSocketServer({ server });

function broadcast(type, data) {
  const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(payload);
  });
}

wss.on('connection', (ws) => {
  console.log(`🔌 WebSocket client connected (${wss.clients.size} total)`);

  // Send full stock snapshot immediately on connect
  const stockSnapshot = db.prepare('SELECT id, name, slug, stock_count, in_stock FROM products').all();
  ws.send(JSON.stringify({ type: 'stock_snapshot', data: stockSnapshot, timestamp: new Date().toISOString() }));

  ws.on('message', (msg) => {
    try {
      const { action, product_id } = JSON.parse(msg);
      if (action === 'watch' && product_id) {
        const product = db.prepare('SELECT id, name, slug, stock_count, in_stock FROM products WHERE id = ?').get(product_id);
        if (product) ws.send(JSON.stringify({ type: 'stock_update', data: product, timestamp: new Date().toISOString() }));
      }
    } catch { /* ignore malformed messages */ }
  });

  ws.on('close', () => console.log(`🔌 WebSocket client disconnected (${wss.clients.size} remaining)`));
});

// Broadcast low-stock alert every 30 s
setInterval(() => {
  const lowStock = db.prepare('SELECT id, name, slug, stock_count, in_stock FROM products WHERE stock_count < 10').all();
  if (lowStock.length) broadcast('low_stock_alert', lowStock);
}, 30000);

// ── Security & core middleware ────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());

// Rate limiting
const apiLimiter  = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: { error: 'Too many requests — please try again shortly' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  message: { error: 'Too many auth attempts — please wait 15 minutes' } });
app.use('/api/', apiLimiter);
app.use('/api/users/login',    authLimiter);
app.use('/api/users/register', authLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/products',   require('./routes/products'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/shipping',   require('./routes/shipping'));
app.use('/api/wishlist',   require('./routes/wishlist'));
app.use('/api/discounts',  require('./routes/discounts'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/payments',   require('./routes/payments'));

// ── Health & API index ────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime().toFixed(1) + 's',
    products: db.prepare('SELECT COUNT(*) as c FROM products').get().c,
    orders: db.prepare('SELECT COUNT(*) as c FROM orders').get().c,
    subscribers: db.prepare('SELECT COUNT(*) as c FROM newsletter_subscribers').get().c,
    websocket_clients: wss.clients.size,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'Collide Sport API',
    version: '2.0.0',
    tagline: 'Play Hard. Built Tough. South African Made.',
    endpoints: {
      products:   'GET /api/products  |  GET /api/products/featured  |  GET /api/products/:slug',
      cart:       'GET/POST /api/cart  |  PATCH /api/cart/:id  |  DELETE /api/cart/:id  |  DELETE /api/cart',
      orders:     'POST /api/orders  |  GET /api/orders/:id',
      users:      'POST /api/users/register  |  POST /api/users/login  |  GET /api/users/me  |  PUT /api/users/me  |  GET /api/users/me/orders',
      reviews:    'GET /api/reviews  |  POST /api/reviews',
      newsletter: 'POST /api/newsletter/subscribe  |  DELETE /api/newsletter/unsubscribe',
      shipping:   'GET /api/shipping/rates?subtotal=&country=  |  GET /api/shipping/countries',
      wishlist:   'GET /api/wishlist  |  POST /api/wishlist  |  DELETE /api/wishlist/:product_id  [auth required]',
      discounts:  'POST /api/discounts/validate',
      admin:      'POST /api/admin/bootstrap  |  GET /api/admin/dashboard  |  GET /api/admin/orders  |  PATCH /api/admin/orders/:id/status  |  GET /api/admin/products  |  PATCH /api/admin/products/:id  |  GET /api/admin/subscribers  |  GET /api/admin/analytics',
      health:     'GET /health',
      websocket:  `ws://localhost:${PORT}  —  events: stock_snapshot | stock_update | low_stock_alert`,
    },
    demo_discount_codes: ['COLLIDE10 (10% off)', 'RUGBY20 (20% off)', 'FIRSTORDER (15% off)', 'CLUBKIT (25% off)'],
  });
});

// ── Serve frontend static files ───────────────────────────────────────────────
app.use(express.static(DIST));

// Any non-API route → serve index.html (SPA fallback)
app.get(/^(?!\/api|\/health).*$/, (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

// ── API 404 catch-all (only for /api/* misses) ────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log('');
  console.log('  ██████╗ ██████╗ ██╗     ██╗     ██╗██████╗ ███████╗');
  console.log('  ██╔════╝██╔═══██╗██║     ██║     ██║██╔══██╗██╔════╝');
  console.log('  ██║     ██║   ██║██║     ██║     ██║██║  ██║█████╗  ');
  console.log('  ██║     ██║   ██║██║     ██║     ██║██║  ██║██╔══╝  ');
  console.log('  ╚██████╗╚██████╔╝███████╗███████╗██║██████╔╝███████╗');
  console.log('   ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝');
  console.log('');
  console.log(`  🏉  Collide Sport API v2.0  |  http://localhost:${PORT}`);
  console.log(`  📖  API Docs               |  http://localhost:${PORT}/api`);
  console.log(`  💚  Health Check           |  http://localhost:${PORT}/health`);
  console.log(`  🔌  WebSocket              |  ws://localhost:${PORT}`);
  console.log('');
});

module.exports = { app, broadcast };
