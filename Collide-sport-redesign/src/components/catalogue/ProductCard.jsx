import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'

const fmt = (n) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock <= 5

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group bg-white rounded-2xl border border-navy/8 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-navy/8 transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-lavender overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!inStock ? 'opacity-40' : ''}`}
        />
        {!inStock && (
          <span className="absolute top-3 left-3 bg-navy text-white text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
            Out of Stock
          </span>
        )}
        {lowStock && (
          <span className="absolute top-3 left-3 bg-green text-navy text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-blue/60 uppercase mb-1">{product.category}</p>
          <h3 className="font-display font-bold text-navy text-sm leading-snug">{product.name}</h3>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="font-display font-extrabold text-lg text-navy leading-none">{fmt(product.price)}</p>
            <p className="text-[10px] text-navy/35 font-mono mt-0.5">incl. VAT</p>
          </div>

          <button
            onClick={() => inStock && addToCart(product)}
            disabled={!inStock}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap
              ${inStock
                ? 'bg-blue text-white hover:bg-blue-light active:scale-95'
                : 'bg-lavender text-navy/30 cursor-not-allowed'}`}
          >
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
