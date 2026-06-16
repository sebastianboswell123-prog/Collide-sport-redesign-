import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'
import AppImage from '../components/ui/AppImage'

const fmt = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })

const COLOUR_MAP = {
  Black: '#1a1a1a', White: '#f5f5f5', Blue: '#4770db', Navy: '#0e1b4d',
  Turquoise: '#40E0D0', Green: '#47db71', Gold: '#FFD700', Grey: '#808080',
  Red: '#DC2626', Maroon: '#800000', Camo: '#4a5a3a',
}

const BADGE_STYLES = {
  New:        { label: 'New',       cls: 'bg-green text-navy' },
  Premium:    { label: 'Premium',   cls: 'bg-blue text-white' },
  'Low Stock':{ label: 'Low Stock', cls: 'bg-orange-500 text-white' },
}

const VAT_RATE = 0.15
const vatOf = (price) => Math.round(price * VAT_RATE / (1 + VAT_RATE))

export default function ProductDetail() {
  const { slug }       = useParams()
  const navigate       = useNavigate()
  const { addToCart, setOpen } = useCart()

  // slug is the product id as a string
  const product = PRODUCTS.find(p => String(p.id) === slug)

  const [selectedColour, setSelectedColour] = useState(product?.colours?.[0] ?? null)
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center bg-lavender">
        <div className="text-center px-6">
          <p className="text-navy/40 text-sm mb-4">Product not found.</p>
          <Link to="/catalogue" className="text-blue font-semibold hover:text-blue-light transition-colors">
            ← Back to Catalogue
          </Link>
        </div>
      </div>
    )
  }

  const hasSale     = product.salePrice !== undefined && product.salePrice !== null && product.salePrice < product.price
  const activePrice = hasSale ? product.salePrice : product.price
  const discountPct = hasSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0
  const outOfStock  = product.stock === 0
  const badge       = BADGE_STYLES[product.badge]

  function handleAddToCart() {
    if (outOfStock) return
    addToCart({ id: String(product.id), name: product.name, price: activePrice, image: product.image }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  function handleBuyNow() {
    if (outOfStock) return
    addToCart({ id: String(product.id), name: product.name, price: activePrice, image: product.image }, qty)
    navigate('/cart')
  }

  return (
    <div className="pt-14 min-h-screen bg-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10 lg:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-navy/40 mb-8">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-navy transition-colors">Catalogue</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/catalogue?categories=${product.category}`} className="hover:text-navy transition-colors capitalize">
                {product.category.replace(/-/g, ' ')}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-navy/70 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-lavender"
          >
            <AppImage
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover ${outOfStock ? 'opacity-50 grayscale' : ''}`}
            />

            {/* Sale badge */}
            {hasSale && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                −{discountPct}%
              </span>
            )}

            {/* Product badge */}
            {badge && !hasSale && (
              <span className={`absolute top-4 left-4 text-sm font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${badge.cls}`}>
                {badge.label}
              </span>
            )}

            {/* Out of stock */}
            {outOfStock && (
              <div className="absolute inset-0 bg-navy-dark/60 flex items-center justify-center">
                <span className="bg-white text-navy font-bold px-6 py-3 rounded-full text-sm uppercase tracking-widest">
                  Out of Stock
                </span>
              </div>
            )}
          </motion.div>

          {/* ── Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category */}
            {product.category && (
              <Link
                to={`/catalogue?categories=${product.category}`}
                className="text-[10px] font-mono tracking-widest text-blue uppercase mb-2 hover:text-blue-light transition-colors"
              >
                {product.category.replace(/-/g, ' ')}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy tracking-tight leading-tight mb-5">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-6">
              {hasSale ? (
                <>
                  <span className="font-bold text-2xl text-red-500">{fmt.format(product.salePrice)}</span>
                  <span className="text-lg text-navy/35 line-through">{fmt.format(product.price)}</span>
                  <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full">
                    Save {fmt.format(product.price - product.salePrice)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-2xl text-blue">{fmt.format(product.price)}</span>
              )}
            </div>
            <p className="text-[11px] text-navy/35 -mt-4 mb-6">
              Includes VAT (R{vatOf(activePrice)} VAT content)
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              {outOfStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-400 font-medium">Out of stock</span>
                </>
              ) : product.stock <= 5 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
                  <span className="text-sm text-orange-500 font-medium">Only {product.stock} left</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-green flex-shrink-0" />
                  <span className="text-sm text-navy/50 font-medium">In stock</span>
                </>
              )}
            </div>

            {/* Colour selector */}
            {product.colours && product.colours.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">
                  Colour — <span className="text-navy/70 normal-case font-semibold tracking-normal">{selectedColour}</span>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colours.map(c => (
                    <button
                      key={c}
                      title={c}
                      onClick={() => setSelectedColour(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all focus:outline-none ${
                        selectedColour === c
                          ? 'border-blue scale-110 shadow-md'
                          : c === 'White' ? 'border-navy/20 hover:border-navy/40' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ background: COLOUR_MAP[c] || '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Qty selector */}
            <div className="mb-6">
              <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Quantity</p>
              <div className="flex items-center rounded-xl border border-navy/10 overflow-hidden w-fit">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="w-11 h-11 flex items-center justify-center text-navy/50 hover:text-navy hover:bg-lavender disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                >
                  −
                </button>
                <span className="w-12 h-11 flex items-center justify-center font-semibold text-navy text-sm select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  disabled={outOfStock || qty >= product.stock}
                  className="w-11 h-11 flex items-center justify-center text-navy/50 hover:text-navy hover:bg-lavender disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 py-4 rounded-full font-semibold text-sm transition-all active:scale-[0.98] ${
                  outOfStock
                    ? 'bg-lavender text-navy/30 cursor-not-allowed'
                    : added
                    ? 'bg-green text-navy'
                    : 'bg-blue text-white hover:bg-blue-light'
                }`}
              >
                {outOfStock ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              {!outOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-full font-semibold text-sm bg-navy text-white hover:bg-navy-dark transition-all active:scale-[0.98]"
                >
                  Buy Now
                </button>
              )}
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-navy/8">
              {[
                { icon: '🚚', label: 'Free shipping over R1 000' },
                { icon: '↩️', label: '14-day returns' },
                { icon: '🔒', label: 'Secure checkout' },
                { icon: '🛡️', label: 'VAT invoice included' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span className="text-xs text-navy/50">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Back link ── */}
        <div className="mt-12 pt-8 border-t border-navy/8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-navy/40 hover:text-navy transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
        </div>

      </div>
    </div>
  )
}
