import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

// ── Constants ────────────────────────────────────────────────────────────────
const SHIPPING_THRESHOLD = 1000
const SHIPPING_RATE      = 99
const VAT_RATE           = 0.15

const fmt = (n) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

// VAT is already included in SA retail prices — extract the component
const vatContent = (inclusive) => Math.round((inclusive * VAT_RATE) / (1 + VAT_RATE))

// ── Icons ────────────────────────────────────────────────────────────────────
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

// ── Quantity control ─────────────────────────────────────────────────────────
function QtyControl({ qty, onIncrease, onDecrease }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-navy/12 overflow-hidden bg-white">
      <button
        onClick={onDecrease}
        disabled={qty <= 1}
        className="w-10 h-10 flex items-center justify-center text-lg font-medium text-navy/40 hover:text-navy hover:bg-lavender disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 h-10 flex items-center justify-center font-semibold text-navy text-sm select-none border-x border-navy/8">
        {qty}
      </span>
      <button
        onClick={onIncrease}
        className="w-10 h-10 flex items-center justify-center text-lg font-medium text-navy/40 hover:text-navy hover:bg-lavender transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

// ── Cart item row ────────────────────────────────────────────────────────────
function CartRow({ item, onUpdateQty, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="flex gap-4 sm:gap-6 py-5 border-b border-navy/6 last:border-0"
    >
      {/* Image */}
      <Link to="/catalogue" className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-lavender">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to="/catalogue" className="font-display font-semibold text-sm sm:text-base text-navy hover:text-blue transition-colors line-clamp-2 leading-snug">
              {item.name}
            </Link>
            {item.colours?.length > 0 && (
              <p className="text-xs text-navy/40 mt-0.5">{item.colours.join(' / ')}</p>
            )}
            <p className="text-blue font-bold text-sm mt-1">{fmt(item.price)}</p>
          </div>
          {/* Line total — desktop */}
          <p className="hidden sm:block font-display font-extrabold text-base text-navy flex-shrink-0 whitespace-nowrap">
            {fmt(item.price * item.qty)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QtyControl
            qty={item.qty}
            onIncrease={() => onUpdateQty(item.id, item.qty + 1)}
            onDecrease={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
          />
          <div className="flex items-center gap-3">
            {/* Line total — mobile */}
            <p className="sm:hidden font-display font-extrabold text-sm text-navy whitespace-nowrap">
              {fmt(item.price * item.qty)}
            </p>
            <button
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-1.5 text-xs text-navy/35 hover:text-red-500 transition-colors group"
              aria-label={`Remove ${item.name} from cart`}
            >
              <TrashIcon />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Coupon field ─────────────────────────────────────────────────────────────
function CouponField({ onApply }) {
  const [value, setValue]   = useState('')
  const [state, setState]   = useState(null) // null | 'applied' | 'invalid'
  const [applied, setApplied] = useState('')

  function handleApply(e) {
    e.preventDefault()
    const code = value.trim().toUpperCase()
    if (!code) return
    // Validation TBD by client — accept any non-empty code for now
    setApplied(code)
    setState('applied')
    onApply(code)
  }

  function handleRemove() {
    setValue('')
    setApplied('')
    setState(null)
    onApply(null)
  }

  return (
    <div>
      <p className="text-xs font-semibold text-navy/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <TagIcon /> Coupon Code
      </p>

      {state === 'applied' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between bg-green/10 border border-green/30 rounded-xl px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-navy">
            <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center text-navy flex-shrink-0">
              <CheckIcon />
            </span>
            <span className="font-mono tracking-widest">{applied}</span>
            <span className="text-navy/50 font-normal text-xs">applied</span>
          </span>
          <button
            onClick={handleRemove}
            className="text-xs text-navy/40 hover:text-red-500 transition-colors"
          >
            Remove
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setState(null) }}
            placeholder="Enter code"
            className="flex-1 px-4 py-2.5 rounded-xl border border-navy/12 text-sm text-navy placeholder-navy/30 bg-white focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition font-mono tracking-wider uppercase"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            Apply
          </button>
        </form>
      )}

      <p className="text-[11px] text-navy/35 mt-1.5">
        Discount calculated at checkout. Validation pending client configuration.
      </p>
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-32 px-6 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-lavender flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0e1b4d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <h2 className="font-display font-extrabold text-2xl text-navy mb-2">Your cart is empty</h2>
      <p className="text-navy/50 text-base max-w-xs leading-relaxed mb-8">
        Browse our catalogue and find your next scrum cap.
      </p>
      <Link
        to="/catalogue"
        className="inline-flex items-center gap-2 bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors"
      >
        Start Shopping
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </motion.div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Cart() {
  const { items, updateQty, removeFromCart, totalPrice, totalItems } = useCart()
  const [couponCode, setCouponCode] = useState(null)

  const shipping   = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE
  const grandTotal = totalPrice + shipping
  const vatAmount  = vatContent(grandTotal)
  const toFreeShip = Math.max(0, SHIPPING_THRESHOLD - totalPrice)

  return (
    <div className="min-h-screen bg-lavender pt-14 pb-24 lg:pb-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-8 lg:py-12">

        {/* ── Page heading ── */}
        <div className="flex items-baseline gap-3 mb-8">
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">
            Your Cart
          </h1>
          {totalItems > 0 && (
            <span className="text-blue font-bold text-xl">
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* ── LEFT — Item list ──────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Free shipping progress banner */}
              {toFreeShip > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center gap-3 bg-blue/8 border border-blue/15 rounded-2xl px-5 py-3"
                >
                  <span className="text-blue flex-shrink-0"><TruckIcon /></span>
                  <p className="text-sm text-navy/70">
                    Add <span className="font-bold text-navy">{fmt(toFreeShip)}</span> more to unlock{' '}
                    <span className="font-bold text-blue">free delivery</span>
                  </p>
                </motion.div>
              )}
              {toFreeShip === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center gap-3 bg-green/10 border border-green/25 rounded-2xl px-5 py-3"
                >
                  <span className="text-green flex-shrink-0"><TruckIcon /></span>
                  <p className="text-sm font-semibold text-navy">
                    🎉 You qualify for <span className="text-green">free delivery!</span>
                  </p>
                </motion.div>
              )}

              {/* Items */}
              <div className="bg-white rounded-2xl px-5 sm:px-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartRow
                      key={item.id}
                      item={item}
                      onUpdateQty={updateQty}
                      onRemove={removeFromCart}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue shopping */}
              <div className="mt-4">
                <Link
                  to="/catalogue"
                  className="inline-flex items-center gap-2 text-sm text-blue font-semibold hover:text-blue-light transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── RIGHT — Order summary ─────────────────────────── */}
            <div className="w-full lg:w-[380px] flex-shrink-0 lg:sticky lg:top-[6.5rem]">
              <div className="bg-white rounded-2xl p-6 space-y-5">
                <h2 className="font-display font-extrabold text-lg text-navy">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-navy/60">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold text-navy">{fmt(totalPrice)}</span>
                  </div>

                  <div className="flex justify-between text-navy/60">
                    <span className="flex items-center gap-1.5">
                      <TruckIcon />
                      Estimated shipping
                    </span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green">Free</span>
                    ) : (
                      <span className="font-semibold text-navy">{fmt(shipping)}</span>
                    )}
                  </div>

                  {shipping > 0 && (
                    <p className="text-[11px] text-navy/35 -mt-1">
                      Free on orders over {fmt(SHIPPING_THRESHOLD)}
                    </p>
                  )}
                </div>

                <div className="border-t border-navy/6" />

                {/* Coupon */}
                <CouponField onApply={setCouponCode} />

                <div className="border-t border-navy/6" />

                {/* Total */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-extrabold text-base text-navy">Total</span>
                    <motion.span
                      key={grandTotal}
                      initial={{ opacity: 0.5, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display font-extrabold text-2xl text-navy"
                    >
                      {fmt(grandTotal)}
                    </motion.span>
                  </div>
                  <p className="text-[11px] text-navy/40 text-right">
                    Includes {fmt(vatAmount)} VAT (15%)
                  </p>
                </div>

                {/* Checkout CTA */}
                <button
                  className="w-full py-4 rounded-2xl bg-green text-navy font-extrabold text-base tracking-wide hover:bg-green-dim active:scale-[0.98] transition-all shadow-lg shadow-green/20"
                >
                  Proceed to Checkout
                </button>

                {/* Trust micro-signals */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { icon: '🔒', label: 'Secure checkout' },
                    { icon: '↩️', label: '30-day returns' },
                    { icon: '⭐', label: '5★ on Takealot' },
                    { icon: '🇿🇦', label: 'South African brand' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-[11px] text-navy/45 font-medium">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
