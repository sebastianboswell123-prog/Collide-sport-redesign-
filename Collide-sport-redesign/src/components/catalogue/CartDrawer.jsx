import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'

const fmt = (n) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)

export default function CartDrawer() {
  const { items, removeFromCart, clearCart, totalPrice, totalItems, open, setOpen } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy/8">
              <h2 className="font-display font-extrabold text-navy">
                Cart{' '}
                {totalItems > 0 && (
                  <span className="text-blue">({totalItems})</span>
                )}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-lavender text-navy/50 hover:text-navy transition-colors flex items-center justify-center text-sm"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="text-center mt-16">
                  <p className="text-3xl mb-3">🛒</p>
                  <p className="font-semibold text-navy/50 text-sm">Your cart is empty.</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 text-blue text-sm font-medium hover:text-blue-light transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex gap-3 items-start"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-lavender flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-navy truncate">{item.name}</p>
                      <p className="text-xs text-navy/40 font-mono mt-0.5 capitalize">{item.category}</p>
                      <p className="text-xs text-navy/40 font-mono">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-bold text-sm text-navy">{fmt(item.price * item.qty)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-navy/30 hover:text-red-400 transition-colors mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-navy/8">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-navy/60">Total</span>
                  <span className="font-display font-extrabold text-xl text-navy">{fmt(totalPrice)}</span>
                </div>
                <p className="text-[10px] text-navy/35 font-mono mb-4">All prices include 15% VAT</p>
                <button className="w-full bg-blue text-white font-semibold py-3 rounded-full hover:bg-blue-light transition-colors active:scale-95">
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-xs text-navy/35 hover:text-navy/60 transition-colors mt-3 py-1"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
