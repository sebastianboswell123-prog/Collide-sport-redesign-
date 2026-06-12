import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useCartFly } from '../CartFlyAnimation'

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

export default function ProductCard({ product, index = 0, onQuickView }) {
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()
  const cartFly = useCartFly()
  const [imgLoaded, setImgLoaded] = useState(false)
  const outOfStock = product.stock === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group"
    >
      {/* Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-lavender mb-3 cursor-pointer"
        onClick={() => onQuickView?.(product)}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-lavender-dark/60 animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${outOfStock ? 'opacity-40 grayscale' : ''} ${imgLoaded ? '' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badge */}
        {product.badge && !outOfStock && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badge] || 'bg-navy text-white'}`}>
            {product.badge}
          </span>
        )}

        {outOfStock && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white">
            Sold Out
          </span>
        )}

        {/* Quick view hint */}
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-navy text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            Quick View
          </span>
        </div>

        {/* Low stock indicator */}
        {!outOfStock && product.stock <= 5 && !product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500 text-white">
            Only {product.stock} left
          </span>
        )}

        {/* Live viewing indicator */}
        {!outOfStock && product.stock <= 10 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] text-navy font-medium">{3 + (product.id % 7)} viewing</span>
          </div>
        )}
      </div>

      {/* Colour swatches */}
      {product.colours && product.colours.length > 1 && (
        <div className="flex items-center gap-1.5 mb-2">
          {product.colours.slice(0, 5).map((c) => (
            <span
              key={c}
              title={c}
              className={`w-4 h-4 rounded-full border ${c === 'White' ? 'border-navy/20' : 'border-transparent'}`}
              style={{ background: COLOUR_MAP[c] || '#ccc' }}
            />
          ))}
          {product.colours.length > 5 && (
            <span className="text-[10px] text-navy/40">+{product.colours.length - 5}</span>
          )}
        </div>
      )}

      {/* Category */}
      <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-1">
        {product.category.replace(/-/g, ' ')}
      </p>

      {/* Name */}
      <h3 className="font-display font-semibold text-sm text-navy leading-snug mb-1.5">
        {product.name}
      </h3>

      {/* Price */}
      <div className="mb-3">
        <p className="text-blue font-bold text-sm leading-tight">{formatPrice(product.price)}</p>
        <p className="text-[10px] text-navy/35 font-mono mt-0.5">incl. 15% VAT</p>
      </div>

      {/* Add to Cart */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (outOfStock) return
          addToCart(product)
          cartFly?.triggerFly(e, product)
        }}
        disabled={outOfStock}
        className={`w-full py-2.5 rounded-full text-sm font-semibold transition-colors ${
          outOfStock
            ? 'bg-lavender text-navy/30 cursor-not-allowed'
            : 'bg-blue text-white hover:bg-blue-light active:scale-[0.98]'
        }`}
      >
        {outOfStock ? 'Sold Out' : 'Add to Cart'}
      </button>
    </motion.div>
  )
}
