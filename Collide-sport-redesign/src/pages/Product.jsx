import { useState, useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { useCartFly } from '../components/CartFlyAnimation'
import ProductCard from '../components/catalogue/ProductCard'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

const COLOUR_MAP = {
  Black:'#1a1a1a', White:'#f5f5f5', Blue:'#4770db', Navy:'#0e1b4d',
  Turquoise:'#40E0D0', Green:'#47db71', Gold:'#FFD700', Grey:'#808080',
  Red:'#DC2626', Maroon:'#800000', Camo:'#4a5a3a',
}

// Size options for caps (head circumference)
const SIZES = [
  { label:'S',  desc:'52–54 cm', surcharge: 0 },
  { label:'M',  desc:'55–57 cm', surcharge: 0 },
  { label:'L',  desc:'58–60 cm', surcharge: 0 },
  { label:'XL', desc:'59–61 cm', surcharge: 50 },
]

// Premium colour surcharge
const PREMIUM_COLOURS = ['Gold']

// Build a 3-image gallery from the product's main image + lifestyle shots
function buildGallery(product) {
  const main = product.image.replace('&width=533', '&width=900')
  if (product.category === 'activewear') {
    return [
      main,
      `${CDN}/SabreCompressionTop-White.jpg?v=1689016014&width=900`,
      `${CDN}/Sabre_Sport_Banner_2_02d6cd8e-fd57-410e-baac-c9e18c9daaa4.jpg?v=1689090191&width=900`,
    ]
  }
  return [
    main,
    `${CDN}/Sabre_Sport_Banner_3_48fe279e-896b-4f4f-8ecc-42d42a6427a3.jpg?v=1689316782&width=900`,
    `${CDN}/Sabre_Sport_Banner_2_02d6cd8e-fd57-410e-baac-c9e18c9daaa4.jpg?v=1689090191&width=900`,
  ]
}

// Descriptions keyed by category
const DESCRIPTIONS = {
  'scrum-caps': 'Engineered with closed-cell foam padding and dual expansion technology, this scrum cap delivers superior cranial protection without compromising fit or comfort. The flexible outer shell conforms to all head shapes, while the inner foam absorbs impact during scrums, rucks, and collisions. Meets IRB/World Rugby regulations for all levels of play.',
  'premium-caps': 'Our Predator Series represents the pinnacle of scrum cap engineering. Premium closed-cell foam, reinforced ear protection, and an adjustable chin strap deliver pro-level performance. Designed in collaboration with provincial coaches and tested by semi-professional players across South Africa.',
  'activewear': 'Designed for the demands of rugby training and match play. Moisture-wicking fabric pulls sweat away from the body while the four-way stretch allows unrestricted movement. Flatlock seaming eliminates chafe on high-friction zones. Machine washable — built to last a full season.',
}

// Basic delivery estimate based on navigator.language / timezone
function getDeliveryEstimate() {
  const now = new Date()
  // Add business days (skip weekends)
  function addBusinessDays(date, days) {
    const d = new Date(date)
    let added = 0
    while (added < days) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0 && d.getDay() !== 6) added++
    }
    return d
  }
  const fmt = (d) => d.toLocaleDateString('en-ZA', { weekday:'short', month:'short', day:'numeric' })
  const stdMin = addBusinessDays(now, 3)
  const stdMax = addBusinessDays(now, 5)
  const expMax = addBusinessDays(now, 2)

  // Detect region from timezone or language
  let region = 'South Africa'
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz.includes('Johannesburg') || tz.includes('Africa')) region = 'South Africa'
    else if (tz.includes('London') || tz.includes('Europe')) region = 'International'
    else region = 'International'
  } catch { /* ignore */ }

  return {
    region,
    standard: { label:`${fmt(stdMin)} – ${fmt(stdMax)}`, price:'Free over R1,000', days:'3–5 business days' },
    express:  { label:`By ${fmt(expMax)}`,                price:'R99',             days:'1–2 business days' },
  }
}

// Zoom hook — tracks mouse and shifts image position
function useImageZoom() {
  const containerRef = useRef(null)
  const [zoom, setZoom] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  function onMove(e) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return { containerRef, zoom, setZoom, pos, onMove }
}

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()
  const cartFly = useCartFly()

  const product = PRODUCTS.find(p => p.id === Number(id))

  const [activeImg, setActiveImg] = useState(0)
  const [selectedColour, setSelectedColour] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [delivery] = useState(getDeliveryEstimate)
  const addBtnRef = useRef(null)
  const { containerRef, zoom, setZoom, pos, onMove } = useImageZoom()

  useEffect(() => {
    if (product) {
      setSelectedColour(product.colours?.[0] || null)
      setActiveImg(0)
      setQty(1)
      setAdded(false)
    }
  }, [id, product])

  if (!product) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center bg-lavender">
        <div className="text-center">
          <p className="font-display font-extrabold text-6xl text-navy/10 mb-4">404</p>
          <h1 className="font-display font-bold text-2xl text-navy mb-3">Product not found</h1>
          <Link to="/catalogue" className="text-blue font-semibold hover:text-blue-light transition-colors">← Back to Catalogue</Link>
        </div>
      </div>
    )
  }

  const gallery = buildGallery(product)
  const outOfStock = product.stock === 0
  const sizeSurcharge = SIZES.find(s => s.label === selectedSize)?.surcharge || 0
  const colourSurcharge = PREMIUM_COLOURS.includes(selectedColour) ? 50 : 0
  const totalPrice = product.price + sizeSurcharge + colourSurcharge
  const priceExVat = Math.round(totalPrice / 1.15)
  const vatAmount = totalPrice - priceExVat

  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  function handleAddToCart(e) {
    if (outOfStock) return
    const cartProduct = {
      ...product,
      name: `${product.name}${selectedColour ? ` (${selectedColour})` : ''}${selectedSize !== 'M' ? ` — ${selectedSize}` : ''}`,
      price: totalPrice,
      id: product.id * 100 + (selectedSize === 'XL' ? 1 : 0),
    }
    for (let i = 0; i < qty; i++) addToCart(cartProduct)
    if (addBtnRef.current) {
      cartFly?.triggerFly({ currentTarget: addBtnRef.current }, cartProduct)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const BADGE_STYLES = { New:'bg-green text-navy', Premium:'bg-blue text-white', 'Low Stock':'bg-orange-500 text-white' }

  return (
    <div className="pt-14 min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-4">
        <nav className="flex items-center gap-2 text-xs text-navy/40 font-mono">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-navy transition-colors">Catalogue</Link>
          <span>/</span>
          <Link to={`/catalogue?categories=${product.category}`} className="hover:text-navy transition-colors capitalize">{product.category.replace(/-/g, ' ')}</Link>
          <span>/</span>
          <span className="text-navy/70 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Image Gallery ── */}
          <div className="lg:sticky lg:top-20 space-y-3">

            {/* Main image with zoom */}
            <div
              ref={containerRef}
              className="relative aspect-square rounded-2xl overflow-hidden bg-lavender cursor-zoom-in select-none"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={onMove}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={gallery[activeImg]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`w-full h-full object-cover transition-transform duration-100 ease-out ${zoom ? 'scale-[1.9]' : 'scale-100'} ${outOfStock ? 'opacity-60 grayscale' : ''}`}
                  style={zoom ? { transformOrigin: `${pos.x}% ${pos.y}%` } : {}}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Zoom hint */}
              {!zoom && (
                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  <span className="text-[10px] font-medium text-navy/60">Hover to zoom</span>
                </div>
              )}

              {/* Badges */}
              {product.badge && !outOfStock && (
                <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${BADGE_STYLES[product.badge] || 'bg-navy text-white'}`}>
                  {product.badge}
                </span>
              )}
              {outOfStock && (
                <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-red-600 text-white">
                  Sold Out
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImg === i ? 'border-blue scale-105' : 'border-transparent hover:border-navy/20'}`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Details ── */}
          <div className="space-y-6">

            {/* Name + category */}
            <div>
              <p className="text-xs font-mono tracking-widest text-blue uppercase mb-2">
                {product.category.replace(/-/g, ' ')}
              </p>
              <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight leading-[1.1] mb-2">
                {product.name}
              </h1>

              {/* Stock indicator */}
              {!outOfStock && (
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.stock <= 5 ? 'bg-orange-500' : 'bg-green'}`} />
                  <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-orange-600' : 'text-green-700'}`}>
                    {product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In Stock'}
                  </span>
                </div>
              )}
              {outOfStock && <p className="text-sm font-medium text-red-600">Out of Stock</p>}
            </div>

            {/* Price + VAT breakdown */}
            <div className="bg-lavender rounded-2xl p-5">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-display font-extrabold text-3xl text-navy">{formatPrice(totalPrice)}</span>
                {(sizeSurcharge > 0 || colourSurcharge > 0) && (
                  <span className="text-sm text-navy/40 line-through">{formatPrice(product.price)}</span>
                )}
              </div>
              <div className="space-y-1 text-xs text-navy/50 font-mono">
                <div className="flex justify-between">
                  <span>Price ex VAT</span>
                  <span>{formatPrice(priceExVat)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%)</span>
                  <span>{formatPrice(vatAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-navy/70 border-t border-navy/10 pt-1 mt-1">
                  <span>Total incl. VAT</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {sizeSurcharge > 0 && <p className="text-orange-600 mt-1">+{formatPrice(sizeSurcharge)} for XL size</p>}
                {colourSurcharge > 0 && <p className="text-blue mt-1">+{formatPrice(colourSurcharge)} premium colour</p>}
              </div>
            </div>

            {/* Colour selector */}
            {product.colours && product.colours.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-navy mb-3">
                  Colour: <span className="font-normal text-navy/60">{selectedColour}</span>
                  {PREMIUM_COLOURS.includes(selectedColour) && <span className="ml-2 text-xs text-blue">(+{formatPrice(50)} premium)</span>}
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colours.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColour(c)}
                      title={c}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColour === c ? 'ring-2 ring-blue ring-offset-2 scale-110 border-blue' : c === 'White' ? 'border-navy/20 hover:scale-105' : 'border-transparent hover:scale-105'}`}
                      style={{ background: COLOUR_MAP[c] || '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.category !== 'activewear' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-navy">Head Size</p>
                  <button className="text-xs text-blue hover:text-blue-light transition-colors">Size guide →</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map(s => (
                    <button
                      key={s.label}
                      onClick={() => setSelectedSize(s.label)}
                      title={s.desc}
                      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${selectedSize === s.label ? 'border-blue bg-blue/5 text-blue' : 'border-navy/15 text-navy/60 hover:border-navy/40'}`}
                    >
                      {s.label}
                      <span className="block text-[10px] font-normal mt-0.5 opacity-60">{s.desc}</span>
                      {s.surcharge > 0 && <span className="block text-[10px] text-orange-500">+{formatPrice(s.surcharge)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-navy mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-navy/15 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-navy/60 hover:bg-lavender transition-colors text-lg font-light disabled:opacity-30"
                    disabled={qty <= 1}
                  >−</button>
                  <span className="w-10 text-center font-display font-bold text-navy text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-navy/60 hover:bg-lavender transition-colors text-lg font-light disabled:opacity-30"
                    disabled={qty >= product.stock || outOfStock}
                  >+</button>
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-xs text-orange-500">Max {product.stock} available</p>
                )}
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3">
              <button
                ref={addBtnRef}
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 py-4 rounded-full font-semibold text-base transition-all ${
                  outOfStock ? 'bg-lavender text-navy/30 cursor-not-allowed'
                  : added ? 'bg-green text-navy scale-[0.98]'
                  : 'bg-blue text-white hover:bg-blue-light active:scale-[0.98]'
                }`}
              >
                {outOfStock ? 'Out of Stock' : added ? '✓ Added to Cart!' : `Add to Cart — ${formatPrice(totalPrice * qty)}`}
              </button>
              <Link
                to="/team-kit"
                className="px-5 py-4 rounded-full border-2 border-navy/15 text-navy/60 text-sm font-semibold hover:border-blue hover:text-blue transition-colors whitespace-nowrap"
                title="Order for a team"
              >
                Team Order
              </Link>
            </div>

            {/* Delivery estimate */}
            <div className="border border-navy/10 rounded-2xl overflow-hidden">
              <div className="bg-lavender px-5 py-3 flex items-center gap-2 border-b border-navy/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <span className="text-xs font-semibold text-navy">Delivery to <span className="text-blue">{delivery.region}</span></span>
              </div>
              <div className="divide-y divide-navy/5">
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy">Standard Delivery</p>
                    <p className="text-xs text-navy/40 mt-0.5">{delivery.standard.label}</p>
                    <p className="text-xs text-navy/40">{delivery.standard.days}</p>
                  </div>
                  <span className="text-sm font-bold text-green-700">{delivery.standard.price}</span>
                </div>
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy">Express Delivery</p>
                    <p className="text-xs text-navy/40 mt-0.5">{delivery.express.label}</p>
                    <p className="text-xs text-navy/40">{delivery.express.days}</p>
                  </div>
                  <span className="text-sm font-bold text-navy">{delivery.express.price}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-display font-bold text-navy mb-3">Product Description</h3>
              <p className="text-navy/60 text-sm leading-relaxed">
                {DESCRIPTIONS[product.category] || DESCRIPTIONS['scrum-caps']}
              </p>
            </div>

            {/* Features list */}
            <ul className="space-y-2">
              {[
                'Closed-cell foam design for maximum protection',
                'Flexible & durable — fits all head shapes',
                'Dual expansion foam technology',
                'World Rugby approved',
                'Machine washable',
              ].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-navy/60">
                  <span className="text-green mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Share / wishlist row */}
            <div className="flex items-center gap-4 pt-2 border-t border-navy/8">
              <Link to="/compare" className="flex items-center gap-1.5 text-xs text-navy/40 hover:text-navy transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                Compare
              </Link>
              <button
                onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
                className="flex items-center gap-1.5 text-xs text-navy/40 hover:text-navy transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share
              </button>
              <Link to="/fit-finder" className="flex items-center gap-1.5 text-xs text-navy/40 hover:text-navy transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Not sure of your size?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-lavender py-16 lg:py-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-navy">You Might Also Like</h2>
              <Link to={`/catalogue?categories=${product.category}`} className="text-blue text-sm font-semibold hover:text-blue-light transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <div key={p.id} onClick={() => navigate(`/catalogue/${p.id}`)} className="cursor-pointer">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
