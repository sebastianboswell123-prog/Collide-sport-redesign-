import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'

const fmt = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })

const COLOUR_MAP = {
  Black: '#1a1a1a', White: '#f5f5f5', Blue: '#4770db', Navy: '#0e1b4d',
  Turquoise: '#40E0D0', Green: '#47db71', Gold: '#FFD700', Grey: '#808080',
  Red: '#DC2626', Maroon: '#800000', Camo: '#4a5a3a',
}

const BADGE_STYLES = {
  New:        'bg-green text-navy',
  Premium:    'bg-blue text-white',
  'Low Stock':'bg-orange-500 text-white',
}

/**
 * Props
 *   image     string   — product image URL
 *   name      string   — product name
 *   price     number   — original price (ZAR, incl. VAT)
 *   salePrice number?  — when defined and < price, shows sale badge + % discount
 *   inStock   boolean  — false shows overlay and disables Add to Cart
 *   slug      string   — used to navigate to /product/:slug on click
 *
 * Optional extras from product data
 *   badge     string?  — 'New' | 'Premium' | 'Low Stock'
 *   colours   string[] — shown as swatches below the image
 *   category  string?  — displayed in small monospace above the name
 *   index     number   — stagger delay for entry animation
 *   onQuickView fn?    — if provided, Quick View button calls this
 */
export default function ProductCard({
  image,
  name,
  price,
  salePrice,
  inStock = true,
  slug,
  badge,
  colours,
  category,
  index = 0,
  onQuickView,
}) {
  const navigate  = useNavigate()
  const { addToCart } = useCart()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [adding, setAdding]       = useState(false)

  // ── Sale logic ─────────────────────────────────────────────────────────────
  const hasSale     = salePrice !== undefined && salePrice !== null && salePrice < price
  const discountPct = hasSale ? Math.round((1 - salePrice / price) * 100) : 0
  const activePrice = hasSale ? salePrice : price

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleCardClick() {
    if (slug) navigate(`/product/${slug}`)
  }

  async function handleAddToCart(e) {
    e.stopPropagation()
    if (!inStock) return
    addToCart({ id: slug, name, price: activePrice, image })
    setAdding(true)
    setTimeout(() => setAdding(false), 1200)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group flex flex-col h-full"
    >
      {/* ── Image area ── */}
      <div
        role="link"
        tabIndex={slug ? 0 : -1}
        aria-label={`View ${name}`}
        onClick={handleCardClick}
        onKeyDown={e => e.key === 'Enter' && handleCardClick()}
        className="relative aspect-square rounded-2xl overflow-hidden bg-lavender mb-3 cursor-pointer flex-shrink-0"
      >
        {/* Skeleton shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-lavender animate-pulse" />
        )}

        <img
          src={image}
          alt={name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!inStock ? 'opacity-50 grayscale' : ''} ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* ── Sale badge — top-left, above other badges ── */}
        {hasSale && inStock && (
          <span className="absolute top-3 left-3 z-20 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
            −{discountPct}%
          </span>
        )}

        {/* ── Product badge (New / Premium / Low Stock) — same slot as sale, below it ── */}
        {badge && inStock && !hasSale && (
          <span className={`absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${BADGE_STYLES[badge] || 'bg-navy text-white'}`}>
            {badge}
          </span>
        )}

        {/* ── Out of stock overlay — covers entire image ── */}
        {!inStock && (
          <div className="absolute inset-0 z-20 bg-navy-dark/65 flex flex-col items-center justify-center gap-2">
            <svg className="w-8 h-8 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span className="text-white text-xs font-bold uppercase tracking-widest">Out of Stock</span>
          </div>
        )}

        {/* ── Quick View button — appears on hover (desktop) ── */}
        {onQuickView && inStock && (
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 pb-3 px-3">
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onQuickView() }}
              className="w-full bg-white/90 backdrop-blur-sm text-navy text-xs font-bold py-2.5 rounded-xl hover:bg-white transition-colors shadow-lg"
            >
              Quick View
            </button>
          </div>
        )}

        {/* ── Low-stock live indicator ── */}
        {inStock && !hasSale && !badge && (
          <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* intentionally empty — can be extended */}
          </div>
        )}
      </div>

      {/* ── Card body — flex-col fills remaining height, button pins to bottom ── */}
      <div className="flex flex-col flex-1 px-0.5">

        {/* Category label */}
        {category && (
          <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-1">
            {category.replace(/-/g, ' ')}
          </p>
        )}

        {/* Colour swatches */}
        {colours && colours.length > 1 && (
          <div className="flex items-center gap-1.5 mb-2">
            {colours.slice(0, 5).map(c => (
              <span
                key={c}
                title={c}
                className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${c === 'White' ? 'border-navy/20' : 'border-transparent'}`}
                style={{ background: COLOUR_MAP[c] || '#ccc' }}
              />
            ))}
            {colours.length > 5 && (
              <span className="text-[10px] text-navy/35">+{colours.length - 5}</span>
            )}
          </div>
        )}

        {/* Product name — 2-line clamp keeps grid rows aligned */}
        <h3
          className="font-display font-semibold text-sm text-navy leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-blue transition-colors"
          onClick={handleCardClick}
        >
          {name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-3">
          {hasSale ? (
            <>
              <span className="font-bold text-sm text-red-500">{fmt.format(salePrice)}</span>
              <span className="text-sm text-navy/35 line-through">{fmt.format(price)}</span>
            </>
          ) : (
            <span className="font-bold text-sm text-blue">{fmt.format(price)}</span>
          )}
        </div>

        {/* Add to Cart — mt-auto pins it to the bottom of the card */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`mt-auto w-full py-2.5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] ${
            !inStock
              ? 'bg-lavender text-navy/30 cursor-not-allowed'
              : adding
              ? 'bg-green text-navy cursor-default'
              : 'bg-blue text-white hover:bg-blue-light'
          }`}
        >
          {!inStock ? 'Out of Stock' : adding ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </motion.article>
  )
}
