import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useCartFly } from '../CartFlyAnimation'
import AppImage from '../ui/AppImage'

const COLOUR_MAP = {
  Black: '#1a1a1a', White: '#f5f5f5', Blue: '#4770db', Navy: '#0e1b4d',
  Turquoise: '#40E0D0', Green: '#47db71', Gold: '#FFD700', Grey: '#808080',
  Red: '#DC2626', Maroon: '#800000', Camo: '#4a5a3a',
}

const BADGE_STYLES = {
  New: 'bg-green text-navy',
  Premium: 'bg-blue text-white',
  'Low Stock': 'bg-orange-500 text-white',
}

/**
 * Accepts either a `product` object (legacy) or individual named props.
 * Named props take precedence when provided.
 *
 * Props: image, name, price, salePrice, inStock, slug
 */
export default function ProductCard({
  // Named props (new API)
  image,
  name,
  price,
  salePrice,
  inStock,
  slug,
  badge,
  colours,
  category,
  stock,
  // Legacy object prop
  product,
  // Shared
  index = 0,
  onQuickView,
}) {
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()
  const cartFly = useCartFly()
  const [imgLoaded, setImgLoaded] = useState(false)

  // Normalise — named props win, fall back to product object fields
  const _image    = image    ?? product?.image
  const _name     = name     ?? product?.name
  const _price    = price    ?? product?.price
  const _sale     = salePrice ?? product?.salePrice
  const _inStock  = inStock  !== undefined ? inStock : (product?.stock ?? 1) > 0
  const _slug     = slug     ?? product?.slug ?? String(product?.id ?? '')
  const _colours  = colours  ?? product?.colours
  const _category = category ?? product?.category
  const _badge    = badge    ?? product?.badge
  const _stock    = stock    ?? product?.stock

  const outOfStock  = !_inStock
  const hasDiscount = _sale !== undefined && _sale !== null && _sale < _price
  const discountPct = hasDiscount ? Math.round((1 - _sale / _price) * 100) : 0

  // Resolve destination URL — prefer /catalogue/:slug, fall back to /catalogue/:id
  const detailUrl = `/catalogue/${_slug}`

  // Build the cart item shape that CartContext expects
  const cartItem = product ?? { image: _image, name: _name, price: _price, id: _slug }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex flex-col h-full"
    >
      {/* ── Image block ── */}
      <Link to={detailUrl} className="block relative aspect-square rounded-2xl overflow-hidden bg-lavender mb-3 flex-shrink-0">

        {/* Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-lavender-dark/60 animate-pulse" />
        )}

        <AppImage
          src={_image}
          alt={_name}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imgLoaded ? '' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Out of stock overlay — covers the whole image */}
        {outOfStock && (
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center gap-2">
            <svg className="w-8 h-8 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span className="text-white font-bold text-sm tracking-wide">Out of Stock</span>
          </div>
        )}

        {/* Sale badge — top left */}
        {hasDiscount && !outOfStock && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white">
            -{discountPct}%
          </span>
        )}

        {/* Product badge (New / Premium / Low Stock) — only when no sale badge */}
        {!hasDiscount && _badge && !outOfStock && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${BADGE_STYLES[_badge] || 'bg-navy text-white'}`}>
            {_badge}
          </span>
        )}

        {/* Low stock pill — when no other badge */}
        {!outOfStock && !hasDiscount && !_badge && _stock !== undefined && _stock <= 5 && _stock > 0 && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500 text-white">
            Only {_stock} left
          </span>
        )}

        {/* Live viewing indicator */}
        {!outOfStock && _stock !== undefined && _stock <= 10 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] text-navy font-medium">{3 + ((product?.id ?? 0) % 7)} viewing</span>
          </div>
        )}

        {/* Quick view hint (only when onQuickView handler provided) */}
        {onQuickView && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={e => { e.preventDefault(); onQuickView(product) }}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-navy text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              Quick View
            </span>
          </div>
        )}
      </Link>

      {/* ── Colour swatches ── */}
      {_colours && _colours.length > 1 && (
        <div className="flex items-center gap-1.5 mb-2">
          {_colours.slice(0, 5).map((c) => (
            <span
              key={c}
              title={c}
              className={`w-4 h-4 rounded-full border ${c === 'White' ? 'border-navy/20' : 'border-transparent'}`}
              style={{ background: COLOUR_MAP[c] || '#ccc' }}
            />
          ))}
          {_colours.length > 5 && (
            <span className="text-[10px] text-navy/40">+{_colours.length - 5}</span>
          )}
        </div>
      )}

      {/* ── Category label ── */}
      {_category && (
        <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-1">
          {_category.replace(/-/g, ' ')}
        </p>
      )}

      {/* ── Name — links to detail page ── */}
      <Link to={detailUrl} className="block group/name mb-1.5">
        <h3 className="font-display font-semibold text-sm text-navy leading-snug group-hover/name:text-blue transition-colors">
          {_name}
        </h3>
      </Link>

      {/* ── Price — push to bottom with mt-auto ── */}
      <div className="mt-auto pt-2">
        <div className="flex items-baseline gap-2 mb-0.5">
          {hasDiscount ? (
            <>
              <p className="text-red-600 font-bold text-sm leading-tight">{formatPrice(_sale)}</p>
              <p className="text-navy/35 font-medium text-xs line-through leading-tight">{formatPrice(_price)}</p>
            </>
          ) : (
            <p className="text-blue font-bold text-sm leading-tight">{formatPrice(_price)}</p>
          )}
        </div>
        <p className="text-[10px] text-navy/35 font-mono mb-3">incl. 15% VAT</p>

        {/* ── Add to Cart ── */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (outOfStock) return
            addToCart(cartItem)
            cartFly?.triggerFly(e, cartItem)
          }}
          disabled={outOfStock}
          className={`w-full py-3 text-xs font-black uppercase tracking-widest transition-colors ${
            outOfStock
              ? 'bg-lavender text-navy/30 cursor-not-allowed'
              : 'bg-navy-dark text-white hover:bg-blue active:scale-[0.98]'
          }`}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  )
}
