const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'collide.db'));

// Performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Migrations — run once on startup ────────────────────────────────────────
const migrations = [
  // Add payment_status column to orders if it doesn't exist
  `ALTER TABLE orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending'`,
  // Password reset tokens table
  `CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used       INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  // Add image_url column to products
  `ALTER TABLE products ADD COLUMN image_url TEXT`,
  // Backfill image_url for existing seeded products
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/ScrumCap-Turquoise_White.jpg?v=1689063382&width=533' WHERE slug = 'classic-turquoise-white' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/ScrumCap-Black.jpg?v=1689015482&width=533' WHERE slug = 'heritage-black-gold' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/ScrumCap-Black_Grey.jpg?v=1689232549&width=533' WHERE slug = 'stealth-midnight' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/0fa2da60fdc932d655d4a4d0ec1af3a7_48c2aac8-0c5f-4f98-8843-00c8d9a329ed.png?v=1719768481&width=533' WHERE slug = 'flame-red-white' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/1_165a1aff-9c87-41b8-b1c2-d8304dff7ab1.jpg?v=1722102398&width=533' WHERE slug = 'forest-green-black' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/ScrumCap-Navy_Gold.jpg?v=1689063348&width=533' WHERE slug = 'navy-gold-elite' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/Warrior_Scrum_Cap.jpg?v=1724349324&width=533' WHERE slug = 'springbok-green-gold' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/ScrumCap-RoyalBlue_Black_1.jpg?v=1689015686&width=533' WHERE slug = 'storm-grey-pro' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/SabreCompressionTop-Black.jpg?v=1689063664&width=533' WHERE slug = 'pro-compression-top-black' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/SabreCompressionTop-White.jpg?v=1689016014&width=533' WHERE slug = 'pro-compression-top-navy' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/SabreRunningTop-Black_1.jpg?v=1689063515&width=533' WHERE slug = 'trail-running-top-white' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/SabreRunningTop-Black_1.jpg?v=1689063515&width=533' WHERE slug = 'trail-running-top-charcoal' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/editedblackundershorts.jpg?v=1689431134&width=533' WHERE slug = 'core-undershorts-black' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/editedblackundershorts.jpg?v=1689431134&width=533' WHERE slug = 'core-undershorts-navy' AND image_url IS NULL`,
  `UPDATE products SET image_url = 'https://collidesport.co.za/cdn/shop/files/SabreCompressionTop-Black.jpg?v=1689063664&width=533' WHERE slug = 'club-kit-bundle-black' AND image_url IS NULL`,
];

for (const sql of migrations) {
  try { db.exec(sql); } catch { /* column already exists — safe to ignore */ }
}

// ── Schema ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'customer',
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    category    TEXT NOT NULL,
    subcategory TEXT,
    price       INTEGER NOT NULL,
    description TEXT,
    badge       TEXT,
    in_stock    INTEGER NOT NULL DEFAULT 1,
    stock_count INTEGER NOT NULL DEFAULT 50,
    featured    INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS product_variants (
    id          TEXT PRIMARY KEY,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color_name  TEXT,
    color_hex   TEXT,
    size        TEXT,
    stock_count INTEGER NOT NULL DEFAULT 20,
    sku         TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id          TEXT PRIMARY KEY,
    session_id  TEXT,
    user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
    product_id  TEXT NOT NULL REFERENCES products(id),
    variant_id  TEXT REFERENCES product_variants(id),
    quantity    INTEGER NOT NULL DEFAULT 1,
    added_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id               TEXT PRIMARY KEY,
    user_id          TEXT REFERENCES users(id),
    email            TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'pending',
    subtotal         INTEGER NOT NULL,
    shipping_cost    INTEGER NOT NULL DEFAULT 0,
    discount_amount  INTEGER NOT NULL DEFAULT 0,
    total            INTEGER NOT NULL,
    discount_code    TEXT,
    shipping_method  TEXT,
    shipping_address TEXT NOT NULL,
    tracking_number  TEXT,
    notes            TEXT,
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id                 TEXT PRIMARY KEY,
    order_id           TEXT NOT NULL REFERENCES orders(id),
    product_id         TEXT NOT NULL REFERENCES products(id),
    variant_id         TEXT REFERENCES product_variants(id),
    product_name       TEXT NOT NULL,
    variant_label      TEXT,
    quantity           INTEGER NOT NULL,
    price_at_purchase  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id          TEXT PRIMARY KEY,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id     TEXT REFERENCES users(id),
    name        TEXT NOT NULL,
    role        TEXT,
    rating      INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    text        TEXT NOT NULL,
    verified    INTEGER NOT NULL DEFAULT 0,
    approved    INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id            TEXT PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    confirmed     INTEGER NOT NULL DEFAULT 0,
    subscribed_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at   TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS discount_codes (
    id               TEXT PRIMARY KEY,
    code             TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL,
    max_uses         INTEGER,
    uses_count       INTEGER NOT NULL DEFAULT 0,
    expires_at       TEXT,
    active           INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id          TEXT PRIMARY KEY,
    event_type  TEXT NOT NULL,
    product_id  TEXT REFERENCES products(id),
    session_id  TEXT,
    user_id     TEXT REFERENCES users(id),
    meta        TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Seed Data ────────────────────────────────────────────────────────────────

function seed() {
  const existingProducts = db.prepare('SELECT COUNT(*) as c FROM products').get();
  if (existingProducts.c > 0) return;

  const { v4: uuidv4 } = require('uuid');

  const CDN = 'https://collidesport.co.za/cdn/shop/files';

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, slug, category, subcategory, price, description, badge, in_stock, stock_count, featured, image_url)
    VALUES (@id, @name, @slug, @category, @subcategory, @price, @description, @badge, @in_stock, @stock_count, @featured, @image_url)
  `);

  const insertVariant = db.prepare(`
    INSERT INTO product_variants (id, product_id, color_name, color_hex, size, stock_count, sku)
    VALUES (@id, @product_id, @color_name, @color_hex, @size, @stock_count, @sku)
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (id, product_id, user_id, name, role, rating, text, verified)
    VALUES (@id, @product_id, @user_id, @name, @role, @rating, @text, @verified)
  `);

  // Scrum Caps
  const scrumCaps = [
    {
      name: 'Classic Turquoise/White',
      slug: 'classic-turquoise-white',
      price: 55000,
      description: 'Our best-selling scrum cap built for match day. Closed-cell foam padding with dual expansion zones provides maximum protection without sacrificing comfort. Endorsed by SA Rugby.',
      badge: 'POPULAR',
      in_stock: 1, stock_count: 34, featured: 1,
      image_url: `${CDN}/ScrumCap-Turquoise_White.jpg?v=1689063382&width=533`,
      colors: [{ name: 'Turquoise', hex: '#00BCD4' }, { name: 'White', hex: '#FFFFFF' }],
    },
    {
      name: 'Heritage Black/Gold',
      slug: 'heritage-black-gold',
      price: 55000,
      description: 'A tribute to South African rugby heritage. Premium double-knit outer with gold trim. Suitable for all positions, IRB compliant.',
      badge: null,
      in_stock: 1, stock_count: 22, featured: 0,
      image_url: `${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533`,
      colors: [{ name: 'Black', hex: '#212121' }, { name: 'Gold', hex: '#FFC107' }],
    },
    {
      name: 'Stealth Midnight',
      slug: 'stealth-midnight',
      price: 58000,
      description: 'Engineered for the modern forward. Triple-layer foam construction with moisture-wicking inner lining. The choice of professional players across the Currie Cup.',
      badge: 'PREMIUM',
      in_stock: 1, stock_count: 15, featured: 1,
      image_url: `${CDN}/ScrumCap-Black_Grey.jpg?v=1689232549&width=533`,
      colors: [{ name: 'Midnight', hex: '#1A1A2E' }, { name: 'Dark Blue', hex: '#16213E' }],
    },
    {
      name: 'Flame Red/White',
      slug: 'flame-red-white',
      price: 55000,
      description: 'Bold on the field, built to last. Reinforced ear guards with ventilation channels. Machine washable, quick-dry fabric.',
      badge: 'NEW',
      in_stock: 1, stock_count: 40, featured: 0,
      image_url: `${CDN}/0fa2da60fdc932d655d4a4d0ec1af3a7_48c2aac8-0c5f-4f98-8843-00c8d9a329ed.png?v=1719768481&width=533`,
      colors: [{ name: 'Red', hex: '#F44336' }, { name: 'White', hex: '#FFFFFF' }],
    },
    {
      name: 'Forest Green/Black',
      slug: 'forest-green-black',
      price: 55000,
      description: 'Inspired by the Highveld. Durable Cordura® outer shell, fully adjustable strap system. Great for youth and senior players alike.',
      badge: null,
      in_stock: 1, stock_count: 18, featured: 0,
      image_url: `${CDN}/1_165a1aff-9c87-41b8-b1c2-d8304dff7ab1.jpg?v=1722102398&width=533`,
      colors: [{ name: 'Green', hex: '#2E7D32' }, { name: 'Black', hex: '#212121' }],
    },
    {
      name: 'Navy/Gold Elite',
      slug: 'navy-gold-elite',
      price: 62000,
      description: 'The pinnacle of scrum cap engineering. Custom-moulded foam inserts, embroidered Collide logo, gift-boxed. Limited run each season.',
      badge: 'PREMIUM',
      in_stock: 1, stock_count: 8, featured: 1,
      image_url: `${CDN}/ScrumCap-Navy_Gold.jpg?v=1689063348&width=533`,
      colors: [{ name: 'Navy', hex: '#0D47A1' }, { name: 'Gold', hex: '#FFC107' }],
    },
    {
      name: 'Springbok Green/Gold',
      slug: 'springbok-green-gold',
      price: 57500,
      description: 'Pay tribute to the greatest team on earth. Official colourway, moisture-management technology, UV-resistant outer fabric.',
      badge: 'POPULAR',
      in_stock: 1, stock_count: 60, featured: 1,
      image_url: `${CDN}/Warrior_Scrum_Cap.jpg?v=1724349324&width=533`,
      colors: [{ name: 'Green', hex: '#007749' }, { name: 'Gold', hex: '#FFB612' }],
    },
    {
      name: 'Storm Grey Pro',
      slug: 'storm-grey-pro',
      price: 55000,
      description: 'Training-first design. Breathable mesh panels, reinforced seams, easy-clean finish. The workhorse of the Collide range.',
      badge: null,
      in_stock: 0, stock_count: 0, featured: 0,
      image_url: `${CDN}/ScrumCap-RoyalBlue_Black_1.jpg?v=1689015686&width=533`,
      colors: [{ name: 'Grey', hex: '#607D8B' }],
    },
  ];

  // Activewear
  const activewear = [
    {
      name: 'Pro Compression Top — Black',
      slug: 'pro-compression-top-black',
      subcategory: 'COMPRESSION',
      price: 29900,
      description: '80% Polyamide, 20% Elastane. Graduated compression improves blood circulation and reduces muscle vibration. Flatlock seams prevent chafing during 80+ minute matches.',
      badge: 'POPULAR',
      in_stock: 1, stock_count: 80, featured: 1,
      image_url: `${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533`,
      colors: [{ name: 'Black', hex: '#212121' }],
    },
    {
      name: 'Pro Compression Top — Navy',
      slug: 'pro-compression-top-navy',
      subcategory: 'COMPRESSION',
      price: 29900,
      description: 'Same elite compression technology as our Black edition. Team orders available — ask about our club discount.',
      badge: null,
      in_stock: 1, stock_count: 55, featured: 0,
      image_url: `${CDN}/SabreCompressionTop-White.jpg?v=1689016014&width=533`,
      colors: [{ name: 'Navy', hex: '#0D47A1' }],
    },
    {
      name: 'Trail Running Top — White',
      slug: 'trail-running-top-white',
      subcategory: 'RUNNING',
      price: 24900,
      description: 'Ultra-lightweight 95g/m² fabric with laser-cut ventilation zones. Reflective Collide logo for low-light safety. Suitable for trail and road.',
      badge: null,
      in_stock: 1, stock_count: 40, featured: 0,
      image_url: `${CDN}/SabreRunningTop-Black_1.jpg?v=1689063515&width=533`,
      colors: [{ name: 'White', hex: '#FAFAFA' }],
    },
    {
      name: 'Trail Running Top — Charcoal',
      slug: 'trail-running-top-charcoal',
      subcategory: 'RUNNING',
      price: 24900,
      description: 'Performance running tee with anti-odour silver-ion treatment. Articulated cut for unrestricted arm drive.',
      badge: 'NEW',
      in_stock: 1, stock_count: 35, featured: 0,
      image_url: `${CDN}/SabreRunningTop-Black_1.jpg?v=1689063515&width=533`,
      colors: [{ name: 'Charcoal', hex: '#455A64' }],
    },
    {
      name: 'Core Undershorts — Black',
      slug: 'core-undershorts-black',
      subcategory: 'SHORTS',
      price: 19900,
      description: '10" inseam compression shorts. Padded hip guards optional. Silicone gripper waistband, key pocket. The base layer every rugby player needs.',
      badge: null,
      in_stock: 1, stock_count: 100, featured: 1,
      image_url: `${CDN}/editedblackundershorts.jpg?v=1689431134&width=533`,
      colors: [{ name: 'Black', hex: '#212121' }],
    },
    {
      name: 'Core Undershorts — Navy',
      slug: 'core-undershorts-navy',
      subcategory: 'SHORTS',
      price: 19900,
      description: 'Same award-winning design as our Black Undershorts in a clean navy colourway. Pairs with the Pro Compression Top for a full base layer kit.',
      badge: null,
      in_stock: 1, stock_count: 75, featured: 0,
      image_url: `${CDN}/editedblackundershorts.jpg?v=1689431134&width=533`,
      colors: [{ name: 'Navy', hex: '#0D47A1' }],
    },
    {
      name: 'Club Kit Bundle — Black',
      slug: 'club-kit-bundle-black',
      subcategory: 'BUNDLE',
      price: 44900,
      description: 'Compression Top + Undershorts in matching Black. Save R50 on the bundle. Perfect match-day base layer combo — trusted by 50+ South African clubs.',
      badge: 'POPULAR',
      in_stock: 1, stock_count: 30, featured: 1,
      image_url: `${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533`,
      colors: [{ name: 'Black', hex: '#212121' }],
    },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const seedMany = db.transaction(() => {
    for (const cap of scrumCaps) {
      const pid = uuidv4();
      insertProduct.run({ id: pid, name: cap.name, slug: cap.slug, category: 'SCRUM_CAP', subcategory: null, price: cap.price, description: cap.description, badge: cap.badge, in_stock: cap.in_stock, stock_count: cap.stock_count, featured: cap.featured, image_url: cap.image_url });
      for (const color of cap.colors) {
        const vid = uuidv4();
        insertVariant.run({ id: vid, product_id: pid, color_name: color.name, color_hex: color.hex, size: null, stock_count: Math.floor(cap.stock_count / cap.colors.length), sku: `SC-${vid.substring(0,8).toUpperCase()}` });
      }
    }

    for (const item of activewear) {
      const pid = uuidv4();
      insertProduct.run({ id: pid, name: item.name, slug: item.slug, category: 'ACTIVEWEAR', subcategory: item.subcategory, price: item.price, description: item.description, badge: item.badge, in_stock: item.in_stock, stock_count: item.stock_count, featured: item.featured, image_url: item.image_url });
      const color = item.colors[0];
      for (const size of sizes) {
        const vid = uuidv4();
        insertVariant.run({ id: vid, product_id: pid, color_name: color.name, color_hex: color.hex, size, stock_count: Math.floor(item.stock_count / sizes.length), sku: `AW-${vid.substring(0,8).toUpperCase()}` });
      }
    }
  });

  seedMany();

  // Seed reviews
  const products = db.prepare('SELECT id, name FROM products').all();
  const reviewPool = [
    { name: 'Thabo M.', role: 'Club Rugby Player', rating: 5, text: 'Best scrum cap I\'ve ever worn. Took a serious hit in a lineout and felt nothing. My teammates have all ordered one.' },
    { name: 'Lize van der Berg', role: 'University Rugby Captain', rating: 5, text: 'The compression top is a game-changer. I wear it every match and every gym session. The fit is perfect and it washes well after a muddy weekend.' },
    { name: 'Sipho Dlamini', role: 'Currie Cup Prop', rating: 5, text: 'Premium quality, feels like professional kit. The padding is thick but doesn\'t restrict movement at all. Worth every rand.' },
    { name: 'Corné Joubert', role: 'High School Coach', rating: 5, text: 'Ordered for the whole squad — 24 players. The club discount was excellent and delivery to Bloemfontein was faster than expected. Kids love them.' },
    { name: 'Nandi Khumalo', role: 'Women\'s Rugby Player', rating: 5, text: 'Finally a brand that makes proper gear for women\'s rugby. The fit runs true to size and the quality rivals anything I\'ve seen from UK brands at half the price.' },
    { name: 'Marco Swart', role: 'Weekend Club Player', rating: 4, text: 'Really happy with the undershorts. Good compression, comfortable for 80 minutes, and the stitching held up after many washes. Would have given 5 stars if delivery was a day faster.' },
    { name: 'Dumisani Khoza', role: 'Rugby Academy Coach', rating: 5, text: 'Collide is the real deal. South African-made quality at a fair price. My academy exclusively uses Collide now — we\'ve tried the big international brands and this is better.' },
    { name: 'Anri Botha', role: 'Fitness Trainer', rating: 5, text: 'I\'ve been using the running tops for CrossFit and trail running. The fabric is incredible — barely feels like you\'re wearing anything but gives you that snug, supported feeling.' },
  ];

  const seedReviews = db.transaction(() => {
    for (let i = 0; i < reviewPool.length; i++) {
      const r = reviewPool[i];
      const product = products[i % products.length];
      insertReview.run({ id: uuidv4(), product_id: product.id, user_id: null, name: r.name, role: r.role, rating: r.rating, text: r.text, verified: 1 });
    }
  });
  seedReviews();

  // Seed discount codes
  const insertCode = db.prepare(`
    INSERT INTO discount_codes (id, code, discount_percent, max_uses, expires_at, active)
    VALUES (@id, @code, @discount_percent, @max_uses, @expires_at, @active)
  `);
  const seedCodes = db.transaction(() => {
    insertCode.run({ id: uuidv4(), code: 'COLLIDE10', discount_percent: 10, max_uses: 500, expires_at: '2027-12-31', active: 1 });
    insertCode.run({ id: uuidv4(), code: 'RUGBY20', discount_percent: 20, max_uses: 100, expires_at: '2026-12-31', active: 1 });
    insertCode.run({ id: uuidv4(), code: 'FIRSTORDER', discount_percent: 15, max_uses: null, expires_at: null, active: 1 });
    insertCode.run({ id: uuidv4(), code: 'CLUBKIT', discount_percent: 25, max_uses: 50, expires_at: '2026-09-30', active: 1 });
  });
  seedCodes();

  console.log('✅  Database seeded with products, reviews and discount codes');
}

seed();

module.exports = db;
