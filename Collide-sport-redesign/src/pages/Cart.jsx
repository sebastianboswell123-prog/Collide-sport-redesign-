import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { api } from '../api'

const FREE_SHIPPING_THRESHOLD = 1000

function ShippingEstimate(subtotal, coupon) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  if (coupon?.type === 'shipping') return 0
  return 99
}

function applyDiscount(subtotal, coupon) {
  if (!coupon) return 0
  if (coupon.type === 'percent') return Math.round(subtotal * coupon.value / 100)
  if (coupon.type === 'fixed') return Math.min(coupon.value, subtotal)
  return 0
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
}

function CartItemRow({ item }) {
  const { updateQty, removeFromCart } = useCart()
  const { formatPrice } = useCurrency()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className="flex gap-4 py-5 border-b border-navy/8 last:border-0"
    >
      {/* Image */}
      <Link to={`/catalogue/${item.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-lavender">
          <AppImage src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/catalogue/${item.id}`} className="block">
              <h3 className="font-display font-semibold text-sm text-navy leading-snug hover:text-blue transition-colors truncate">
                {item.name}
              </h3>
            </Link>
            <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mt-0.5">
              {item.category?.replace(/-/g, ' ')}
            </p>
          </div>
          {/* Line total — desktop */}
          <p className="hidden sm:block font-display font-bold text-navy text-sm flex-shrink-0">
            {formatPrice(item.price * item.qty)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Unit price */}
          <p className="text-xs text-navy/50">{formatPrice(item.price)} each</p>

          <div className="flex items-center gap-3">
            {/* Qty control */}
            <div className="flex items-center border border-navy/15 rounded-xl overflow-hidden">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                disabled={item.qty <= 1}
                aria-label="Decrease quantity"
                className="w-8 h-8 flex items-center justify-center text-navy/40 hover:text-navy hover:bg-lavender transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base"
              >−</button>
              <span className="w-8 h-8 flex items-center justify-center font-display font-bold text-navy text-sm select-none">
                {item.qty}
              </span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 flex items-center justify-center text-navy/40 hover:text-navy hover:bg-lavender transition-colors text-base"
              >+</button>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item.id)}
              aria-label={`Remove ${item.name}`}
              className="p-1.5 text-navy/25 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Line total — mobile */}
        <p className="sm:hidden font-display font-bold text-navy text-sm mt-2">
          {formatPrice(item.price * item.qty)}
        </p>
      </div>
    </motion.div>
  )
}

// ── Coupon field ─────────────────────────────────────────────────────────────
function CouponField({ subtotal, onApply }) {
  const [value, setValue]     = useState('')
  const [state, setState]     = useState(null) // null | 'loading' | 'applied' | 'invalid'
  const [applied, setApplied] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [savingMsg, setSavingMsg] = useState('')

  async function handleApply(e) {
    e.preventDefault()
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setState('loading')
    setErrorMsg('')
    try {
      const res = await api.validateDiscount(code, subtotal)
      setApplied(code)
      setSavingMsg(res.message || `${res.discount_percent}% off applied`)
      setState('applied')
      onApply({ code, savingRands: res.saving / 100 })
    } catch (err) {
      setErrorMsg(err.data?.error || 'Invalid or expired code')
      setState('invalid')
      onApply(null)
    }
  }

  function handleRemove() {
    setValue('')
    setApplied('')
    setErrorMsg('')
    setSavingMsg('')
    setState(null)
    onApply(null)
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="pt-14 min-h-screen bg-lavender flex items-center justify-center px-6">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="text-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0e1b4d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-navy mb-2">Your cart is empty</h1>
          <p className="text-navy/50 mb-8">Add some caps and gear to get started.</p>
          <Link to="/catalogue" className="inline-block bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors">
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setState(null); setErrorMsg('') }}
            placeholder="Enter code"
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm text-navy placeholder-navy/30 bg-white focus:outline-none focus:ring-2 transition font-mono tracking-wider uppercase ${
              state === 'invalid'
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-navy/12 focus:border-blue focus:ring-blue/10'
            }`}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={!value.trim() || state === 'loading'}
            className="px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            {state === 'loading' ? '…' : 'Apply'}
          </button>
        </form>
      )}

      {state === 'invalid' && (
        <p className="text-[11px] text-red-500 mt-1.5">{errorMsg}</p>
      )}
      {state === 'applied' && savingMsg && (
        <p className="text-[11px] text-green font-semibold mt-1.5">{savingMsg}</p>
      )}
    </div>
  )
}

  return (
    <div className="pt-14 min-h-screen bg-lavender">

      {/* Header */}
      <div className="bg-navy-dark py-10 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <div>
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-1">Your Order</p>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-white tracking-tight">
              Shopping Cart
              <span className="text-blue ml-3 text-2xl">({items.reduce((s,i)=>s+i.qty,0)} items)</span>
            </h1>
          </div>
          <button onClick={clearCart} className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
            Clear cart
          </button>
        </div>
      </div>

// ── Main page ────────────────────────────────────────────────────────────────
export default function Cart() {
  const { items, updateQty, removeFromCart, totalPrice, totalItems } = useCart()
  const [discount, setDiscount] = useState(null) // { code, savingRands } | null

  const discountAmount = discount ? discount.savingRands : 0
  const discountedSubtotal = Math.max(0, totalPrice - discountAmount)
  const shipping   = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE
  const grandTotal = discountedSubtotal + shipping
  const vatAmount  = vatContent(grandTotal)
  const toFreeShip = Math.max(0, SHIPPING_THRESHOLD - discountedSubtotal)

            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 pb-3 border-b border-navy/8 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-navy/40 uppercase">Product</span>
              <span className="text-[10px] font-mono tracking-widest text-navy/40 uppercase text-right">Total</span>
            </div>

            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </AnimatePresence>

            {/* Coupon code */}
            <div className="mt-6 pt-6 border-t border-navy/8">
              <p className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                <TagIcon />
                Coupon Code
              </p>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green/10 border border-green/30 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-green-700">{couponSuccess}</p>
                    <p className="text-xs text-navy/40 mt-0.5">Code: {appliedCoupon.code}</p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-navy/40 hover:text-red-500 transition-colors font-medium">Remove ×</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value); setCouponError('') }}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-navy/15 rounded-xl px-4 py-2.5 text-sm text-navy outline-none focus:border-blue transition-colors bg-lavender/40 font-mono uppercase placeholder:normal-case placeholder:font-sans"
                  />
                  <button type="submit" className="bg-navy text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-navy-dark transition-colors whitespace-nowrap">
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <span>⚠</span> {couponError}
                </motion.p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {['COLLIDE10', 'NEWPLAYER', 'SCHOOL20'].map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => { setCouponInput(code); setCouponError('') }}
                    className="text-[10px] font-mono border border-navy/10 text-navy/40 hover:border-blue hover:text-blue px-2.5 py-1 rounded-full transition-colors"
                  >
                    {code}
                  </button>
                ))}
                <span className="text-[10px] text-navy/25 self-center">← demo codes</span>
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-display font-bold text-navy text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-navy/60">Subtotal ({items.reduce((s,i)=>s+i.qty,0)} items)</span>
                  <span className="font-semibold text-navy">{formatPrice(subtotal)}</span>
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({appliedCoupon.label})</span>
                    <span className="font-semibold">−{formatPrice(discount)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-navy/60">Estimated Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-700' : 'text-navy'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>

                <div className="border-t border-navy/6" />

                {/* Discount line — shown once a code is applied */}
                {discount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-green font-semibold flex items-center gap-1">
                      <TagIcon /> {discount.code}
                    </span>
                    <span className="font-semibold text-green">−{fmt(discount.savingRands)}</span>
                  </motion.div>
                )}

                {/* Coupon */}
                <CouponField subtotal={totalPrice} onApply={setDiscount} />

                <div className="border-t border-navy/6" />

                {/* VAT breakdown */}
                <div className="border-t border-navy/8 pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-navy/40 font-mono">
                    <span>Total ex-VAT</span>
                    <span>{formatPrice(totalExVat)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-navy/40 font-mono">
                    <span>VAT (15%)</span>
                    <span>{formatPrice(vatAmount)}</span>
                  </div>
                </div>

                {/* Grand total */}
                <div className="border-t-2 border-navy/15 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-bold text-navy text-base">Total (incl. VAT)</span>
                    <span className="font-display font-extrabold text-navy text-2xl">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 py-4 bg-green text-navy font-extrabold text-base rounded-full hover:bg-green-dim active:scale-[0.98] transition-all shadow-lg shadow-green/20"
              >
                Proceed to Checkout →
              </button>

              <Link
                to="/catalogue"
                className="block text-center text-sm text-blue font-semibold mt-3 hover:text-blue-light transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Trust signals */}
            <div className="bg-white rounded-2xl p-5 space-y-3">
              {[
                { icon:'🔒', text:'Secure checkout — SSL encrypted' },
                { icon:'↩️', text:'30-day returns on all orders' },
                { icon:'🚚', text:'Ships across South Africa' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-navy/50">
                  <span className="text-base">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
