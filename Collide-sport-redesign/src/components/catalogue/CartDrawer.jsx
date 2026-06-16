import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import AppImage from '../ui/AppImage'

const fmt = (n) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(n)

/* ── Inline SVG icons ─────────────────────────────────── */

function BagIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

/* ── Quantity control ─────────────────────────────────── */

function QtyControl({ qty, onUpdate }) {
  return (
    <div className="flex items-center rounded-lg border border-[#0e1b4d]/10 overflow-hidden">
      <button
        onClick={() => onUpdate(Math.max(1, qty - 1))}
        disabled={qty <= 1}
        className="w-8 h-8 flex items-center justify-center text-sm font-bold
                   text-[#0e1b4d]/50 hover:text-[#0e1b4d] hover:bg-[#eff0f5]
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-[#0e1b4d] select-none">
        {qty}
      </span>
      <button
        onClick={() => onUpdate(qty + 1)}
        className="w-8 h-8 flex items-center justify-center text-sm font-bold
                   text-[#0e1b4d]/50 hover:text-[#0e1b4d] hover:bg-[#eff0f5]
                   transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

/* ── Cart item row ────────────────────────────────────── */

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="flex gap-4 p-3 rounded-2xl bg-[#eff0f5]/50 hover:bg-[#eff0f5] transition-colors"
    >
      {/* Product image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#eff0f5]">
        <AppImage
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <p className="font-semibold text-sm text-[#0e1b4d] truncate leading-tight">
            {item.name}
          </p>
          <p className="text-sm font-bold text-[#4770db] mt-1">
            {fmt(item.price)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <QtyControl
            qty={item.qty}
            onUpdate={(newQty) => onUpdateQty(item.id, newQty)}
          />

          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg text-[#0e1b4d]/25 hover:text-red-500
                       hover:bg-red-50 transition-colors"
            aria-label={`Remove ${item.name} from cart`}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="flex-shrink-0 pt-0.5">
        <p className="font-bold text-sm text-[#0e1b4d] text-right whitespace-nowrap">
          {fmt(item.price * item.qty)}
        </p>
      </div>
    </motion.div>
  )
}

/* ── Empty state ──────────────────────────────────────── */

function EmptyState({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center px-8 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-[#eff0f5] flex items-center justify-center mb-5">
        <BagIcon className="w-9 h-9 text-[#0e1b4d]/30" />
      </div>
      <h3 className="text-lg font-bold text-[#0e1b4d] mb-1">
        Your cart is empty
      </h3>
      <p className="text-sm text-[#0e1b4d]/40 mb-6 max-w-[240px]">
        Browse our catalogue and find something you love.
      </p>
      <Link
        to="/catalogue"
        onClick={onClose}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                   bg-[#4770db] text-white font-semibold text-sm
                   hover:bg-[#4770db]/90 transition-colors active:scale-95"
      >
        Start Shopping
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </motion.div>
  )
}

/* ── Main drawer ──────────────────────────────────────── */

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQty,
    clearCart,
    totalPrice,
    totalItems,
    open,
    setOpen,
  } = useCart()

  const close = () => setOpen(false)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 bg-[#0e1b4d]/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50
                       flex flex-col shadow-[−20px_0_60px_rgba(14,27,77,0.15)]"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* ── Header ────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#0e1b4d]/8">
              <h2 className="text-lg font-extrabold text-[#0e1b4d] tracking-tight">
                Your Cart{' '}
                <span className="text-[#4770db] font-bold">
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              </h2>
              <button
                onClick={close}
                className="w-9 h-9 rounded-full bg-[#eff0f5] text-[#0e1b4d]/40
                           hover:bg-[#0e1b4d] hover:text-white transition-all
                           flex items-center justify-center text-sm"
                aria-label="Close cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Item list / empty state ────────────── */}
            {items.length === 0 ? (
              <EmptyState onClose={close} />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 overscroll-contain">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQty={updateQty}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* ── Footer ──────────────────────────── */}
                <div className="border-t border-[#0e1b4d]/8 px-6 py-5 space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-[#0e1b4d]/50 font-medium">
                      Subtotal
                    </span>
                    <span className="text-xl font-extrabold text-[#0e1b4d] tracking-tight">
                      {fmt(totalPrice)}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#0e1b4d]/35 font-medium">
                    All prices include 15% VAT
                  </p>

                  {/* View Cart page */}
                  <Link
                    to="/cart"
                    onClick={close}
                    className="w-full py-3.5 rounded-full bg-[#47db71] text-[#0e1b4d]
                               font-bold text-sm tracking-wide text-center block
                               hover:bg-[#47db71]/90 active:scale-[0.98]
                               transition-all shadow-lg shadow-[#47db71]/25"
                  >
                    View Cart &amp; Checkout
                  </Link>

                  {/* Continue shopping */}
                  <button
                    onClick={close}
                    className="w-full text-center text-sm text-[#4770db] font-semibold
                               hover:text-[#0e1b4d] transition-colors py-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
