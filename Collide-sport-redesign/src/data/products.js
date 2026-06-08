const PH = 'https://placehold.co/400x400'

export const CATEGORIES = [
  { value: 'jerseys',     label: 'Jerseys' },
  { value: 'footwear',    label: 'Footwear' },
  { value: 'equipment',   label: 'Equipment' },
  { value: 'accessories', label: 'Accessories' },
]

export const PRODUCTS = [
  // Jerseys
  { id:  1, name: 'Pro Match Jersey',        category: 'jerseys',     price:  899, stock: 15, createdAt: '2024-03-10', image: `${PH}/4770db/ffffff?text=JERSEY` },
  { id:  2, name: 'Team Training Jersey',    category: 'jerseys',     price:  649, stock:  8, createdAt: '2024-02-20', image: `${PH}/5a82e8/ffffff?text=JERSEY` },
  { id:  3, name: 'Home Kit Jersey',         category: 'jerseys',     price: 1199, stock:  0, createdAt: '2024-01-15', image: `${PH}/3a5fc0/ffffff?text=HOME+KIT` },
  { id:  4, name: 'Away Kit Jersey',         category: 'jerseys',     price: 1199, stock:  3, createdAt: '2024-01-20', image: `${PH}/6090f0/ffffff?text=AWAY+KIT` },
  { id:  5, name: 'Goalkeeper Jersey',       category: 'jerseys',     price:  799, stock:  6, createdAt: '2024-02-05', image: `${PH}/4770db/ffffff?text=GK+JERSEY` },
  { id:  6, name: 'Youth Match Jersey',      category: 'jerseys',     price:  549, stock: 20, createdAt: '2024-03-01', image: `${PH}/7aa0f5/ffffff?text=YOUTH` },
  // Footwear
  { id:  7, name: 'Sprint Pro Cleats',       category: 'footwear',    price: 1899, stock: 12, createdAt: '2024-03-15', image: `${PH}/0e1b4d/ffffff?text=CLEATS` },
  { id:  8, name: 'Training Sneakers',       category: 'footwear',    price: 1299, stock:  7, createdAt: '2024-02-28', image: `${PH}/0e1b4d/eeeeee?text=SNEAKERS` },
  { id:  9, name: 'Turf Shoes',              category: 'footwear',    price:  999, stock:  0, createdAt: '2024-01-10', image: `${PH}/1a2b5d/ffffff?text=TURF` },
  { id: 10, name: 'Indoor Court Shoes',      category: 'footwear',    price: 1099, stock:  5, createdAt: '2024-02-15', image: `${PH}/1e3070/ffffff?text=INDOOR` },
  { id: 11, name: 'Elite Speed Boots',       category: 'footwear',    price: 2499, stock:  2, createdAt: '2024-03-20', image: `${PH}/080f2e/ffffff?text=ELITE` },
  { id: 12, name: 'Junior Cleats',           category: 'footwear',    price:  749, stock: 11, createdAt: '2024-03-05', image: `${PH}/0e1b4d/aaaaff?text=JUNIOR` },
  // Equipment
  { id: 13, name: 'Match Ball Pro',          category: 'equipment',   price:  599, stock: 30, createdAt: '2024-03-18', image: `${PH}/47db71/0e1b4d?text=BALL` },
  { id: 14, name: 'Training Cones (20pk)',   category: 'equipment',   price:  299, stock: 50, createdAt: '2024-01-25', image: `${PH}/3bc260/0e1b4d?text=CONES` },
  { id: 15, name: 'Speed Agility Ladder',    category: 'equipment',   price:  449, stock: 14, createdAt: '2024-02-10', image: `${PH}/47db71/0e1b4d?text=LADDER` },
  { id: 16, name: 'Resistance Band Kit',     category: 'equipment',   price:  349, stock:  0, createdAt: '2024-01-05', image: `${PH}/3bc260/0e1b4d?text=BANDS` },
  { id: 17, name: 'Pop-Up Goal Set',         category: 'equipment',   price:  899, stock:  8, createdAt: '2024-02-22', image: `${PH}/55e080/0e1b4d?text=GOAL` },
  { id: 18, name: 'Tackle Shield',           category: 'equipment',   price:  749, stock:  4, createdAt: '2024-03-08', image: `${PH}/47db71/0e1b4d?text=SHIELD` },
  // Accessories
  { id: 19, name: 'Team Duffel Bag',         category: 'accessories', price:  799, stock: 11, createdAt: '2024-03-12', image: `${PH}/dfe0e8/0e1b4d?text=BAG` },
  { id: 20, name: 'Compression Socks',       category: 'accessories', price:  199, stock: 40, createdAt: '2024-02-18', image: `${PH}/dfe0e8/0e1b4d?text=SOCKS` },
  { id: 21, name: 'Sport Shin Guards',       category: 'accessories', price:  299, stock:  0, createdAt: '2024-01-30', image: `${PH}/c5c6d0/0e1b4d?text=GUARDS` },
  { id: 22, name: 'Moisture-Wicking Cap',    category: 'accessories', price:  249, stock: 25, createdAt: '2024-03-22', image: `${PH}/dfe0e8/0e1b4d?text=CAP` },
  { id: 23, name: 'Water Bottle 750ml',      category: 'accessories', price:  179, stock: 60, createdAt: '2024-02-08', image: `${PH}/eff0f5/0e1b4d?text=BOTTLE` },
  { id: 24, name: 'Grip Tape Roll',          category: 'accessories', price:   89, stock:  0, createdAt: '2024-01-18', image: `${PH}/d0d1db/0e1b4d?text=TAPE` },
]

export const PRICE_MIN = Math.min(...PRODUCTS.map(p => p.price))
export const PRICE_MAX = Math.max(...PRODUCTS.map(p => p.price))
