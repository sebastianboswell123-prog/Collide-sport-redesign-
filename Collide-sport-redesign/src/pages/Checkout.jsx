import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { generateOrderNumber, saveOrder } from '../lib/orders'
import { redirectToPayfast, getPayfastConfig } from '../lib/payfast'
import ReturnsPolicyModal from '../components/ReturnsPolicyModal'

// ── Constants ────────────────────────────────────────────────────────────────
const SHIPPING_THRESHOLD = 1000
const SHIPPING_RATE      = 99
const VAT_RATE           = 0.15

// All 9 South African provinces
const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
]

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard Delivery', eta: '3–5 business days', rate: SHIPPING_RATE, freeOverThreshold: true },
  { id: 'express',  label: 'Express Delivery',  eta: '1–2 business days', rate: 149, freeOverThreshold: false },
]

const STEPS = ['Delivery', 'Shipping', 'Payment']

const fmt = (n) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const vatContent = (inclusive) => Math.round((inclusive * VAT_RATE) / (1 + VAT_RATE))

// ── Form helpers ──────────────────────────────────────────────────────────────
function inputClass(hasError) {
  return `w-full bg-white border rounded-xl px-4 py-3.5 text-navy placeholder-navy/30 focus:outline-none transition-colors text-sm ${
    hasError ? 'border-red-400 focus:border-red-400 ring-1 ring-red-200' : 'border-navy/10 focus:border-blue focus:ring-2 focus:ring-blue/10'
  }`
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

// ── Step indicator ──────────────────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = n < step
        const active = n === step
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                done ? 'bg-green text-navy' : active ? 'bg-blue text-white' : 'bg-navy/10 text-navy/40'
              }`}>
                {done ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : n}
              </div>
              <span className={`text-sm font-semibold truncate ${active ? 'text-navy' : 'text-navy/40'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? 'bg-green' : 'bg-navy/10'}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { items, totalPrice, totalItems, clearCart } = useCart()

  const [step, setStep] = useState(1)
  const [delivery, setDelivery] = useState({
    name: '', email: '', phone: '', address: '', city: '', province: '', postalCode: '',
  })
  const [errors, setErrors] = useState({})
  const [shippingId, setShippingId] = useState('standard')
  const [returnsAck, setReturnsAck] = useState(false)
  const [returnsOpen, setReturnsOpen] = useState(false)
  const [payError, setPayError] = useState('')
  const [processing, setProcessing] = useState(false)

  const cancelled = params.get('cancelled')
  const pf = getPayfastConfig()

  // Redirect to cart if there's nothing to check out (but not while redirecting to PayFast)
  useEffect(() => {
    if (items.length === 0 && !processing) navigate('/cart', { replace: true })
  }, [items.length, processing, navigate])

  const method = SHIPPING_METHODS.find(m => m.id === shippingId) || SHIPPING_METHODS[0]
  const shippingCost = method.freeOverThreshold && totalPrice >= SHIPPING_THRESHOLD ? 0 : method.rate
  const grandTotal = totalPrice + shippingCost
  const vatAmount = vatContent(grandTotal)

  const totals = useMemo(() => ({
    subtotal: totalPrice, shipping: shippingCost, vat: vatAmount, total: grandTotal,
  }), [totalPrice, shippingCost, vatAmount, grandTotal])

  function setField(e) {
    const { name, value } = e.target
    setDelivery(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validateDelivery() {
    const e = {}
    if (!delivery.name.trim())   e.name = 'Full name is required'
    if (!delivery.email.trim())  e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.email)) e.email = 'Enter a valid email'
    if (!delivery.phone.trim())  e.phone = 'Phone number is required'
    else if (!/^[0-9+\s()-]{7,15}$/.test(delivery.phone)) e.phone = 'Enter a valid phone number'
    if (!delivery.address.trim()) e.address = 'Street address is required'
    if (!delivery.city.trim())    e.city = 'City / town is required'
    if (!delivery.province)       e.province = 'Select a province'
    if (!delivery.postalCode.trim()) e.postalCode = 'Postal code is required'
    else if (!/^\d{4}$/.test(delivery.postalCode.trim())) e.postalCode = 'SA postal codes are 4 digits'
    return e
  }

  function continueFromDelivery() {
    const e = validateDelivery()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(2)
  }

  function handlePay() {
    if (!returnsAck) { setPayError('Please confirm you have read the returns policy.'); return }
    setPayError('')
    setProcessing(true)

    const order = {
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      customer: { ...delivery },
      shipping: { method: method.id, label: method.label, eta: method.eta, cost: shippingCost },
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
      totals,
      payment: { gateway: 'payfast', mode: pf.mode },
    }

    saveOrder(order)
    // Cart is cleared on the confirmation page (after the PayFast round-trip),
    // so a cancelled payment returns the buyer to a populated cart.
    redirectToPayfast(order)
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-lavender pt-14 pb-24 lg:pb-16">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-12 py-8 lg:py-12">

        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">Checkout</h1>
          <Link to="/cart" className="text-sm text-blue font-semibold hover:text-blue-light transition-colors">← Back to cart</Link>
        </div>

        {/* Sandbox notice */}
        {pf.mode === 'sandbox' && (
          <div className="mb-5 flex items-center gap-2 bg-blue/8 border border-blue/20 rounded-xl px-4 py-2.5 text-xs text-navy/70">
            <span className="font-mono font-bold text-blue uppercase tracking-wide">Sandbox</span>
            <span>Test mode — no real payment will be taken. Live PayFast activates in production.</span>
          </div>
        )}

        {/* Cancelled banner */}
        {cancelled && (
          <div className="mb-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-800">
            Payment was cancelled — your cart is still here. You can try again when ready.
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── LEFT — steps ── */}
          <div className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <StepBar step={step} />

              <AnimatePresence mode="wait">
                {/* STEP 1 — Delivery details */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h2 className="font-display font-extrabold text-lg text-navy mb-5">Delivery details</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Full name" error={errors.name}>
                          <input name="name" value={delivery.name} onChange={setField} placeholder="Jane Doe" className={inputClass(errors.name)} autoComplete="name" />
                        </Field>
                        <Field label="Email" error={errors.email}>
                          <input type="email" name="email" value={delivery.email} onChange={setField} placeholder="you@email.com" className={inputClass(errors.email)} autoComplete="email" />
                        </Field>
                      </div>
                      <Field label="Phone" error={errors.phone}>
                        <input name="phone" value={delivery.phone} onChange={setField} placeholder="082 123 4567" className={inputClass(errors.phone)} autoComplete="tel" />
                      </Field>
                      <Field label="Street address" error={errors.address}>
                        <input name="address" value={delivery.address} onChange={setField} placeholder="12 Rugby Road, Bellville" className={inputClass(errors.address)} autoComplete="street-address" />
                      </Field>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field label="City / town" error={errors.city}>
                          <input name="city" value={delivery.city} onChange={setField} placeholder="Cape Town" className={inputClass(errors.city)} autoComplete="address-level2" />
                        </Field>
                        <Field label="Province" error={errors.province}>
                          <select name="province" value={delivery.province} onChange={setField} className={inputClass(errors.province)} autoComplete="address-level1">
                            <option value="">Select province…</option>
                            {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </Field>
                        <Field label="Postal code" error={errors.postalCode}>
                          <input name="postalCode" value={delivery.postalCode} onChange={setField} placeholder="7530" inputMode="numeric" maxLength={4} className={inputClass(errors.postalCode)} autoComplete="postal-code" />
                        </Field>
                      </div>
                    </div>

                    <button onClick={continueFromDelivery} className="mt-7 w-full sm:w-auto bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors active:scale-[0.98]">
                      Continue to shipping
                    </button>
                  </motion.div>
                )}

                {/* STEP 2 — Shipping method */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h2 className="font-display font-extrabold text-lg text-navy mb-5">Shipping method</h2>
                    <div className="space-y-3">
                      {SHIPPING_METHODS.map(m => {
                        const free = m.freeOverThreshold && totalPrice >= SHIPPING_THRESHOLD
                        const cost = free ? 0 : m.rate
                        const selected = shippingId === m.id
                        return (
                          <button
                            key={m.id}
                            onClick={() => setShippingId(m.id)}
                            className={`w-full text-left flex items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-all ${
                              selected ? 'border-blue bg-blue/5' : 'border-navy/10 hover:border-navy/25 bg-white'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'border-blue' : 'border-navy/25'}`}>
                              {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-display font-bold text-navy text-sm">{m.label}</p>
                              <p className="text-xs text-navy/50 mt-0.5">{m.eta}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {cost === 0
                                ? <span className="font-bold text-green text-sm">Free</span>
                                : <span className="font-bold text-navy text-sm">{fmt(cost)}</span>}
                              {free && <p className="text-[10px] text-navy/35">over {fmt(SHIPPING_THRESHOLD)}</p>}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-7 flex items-center gap-3">
                      <button onClick={() => setStep(1)} className="text-sm text-navy/50 font-semibold hover:text-navy transition-colors px-4 py-3.5">← Back</button>
                      <button onClick={() => setStep(3)} className="flex-1 sm:flex-none bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors active:scale-[0.98]">
                        Continue to payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — Payment */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h2 className="font-display font-extrabold text-lg text-navy mb-5">Payment</h2>

                    {/* Delivery recap */}
                    <div className="rounded-2xl bg-lavender p-5 mb-4 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono tracking-widest text-navy/40 uppercase">Delivering to</span>
                        <button onClick={() => setStep(1)} className="text-xs text-blue font-semibold hover:text-blue-light">Edit</button>
                      </div>
                      <p className="font-semibold text-navy">{delivery.name}</p>
                      <p className="text-navy/60">{delivery.address}</p>
                      <p className="text-navy/60">{delivery.city}, {delivery.province}, {delivery.postalCode}</p>
                      <p className="text-navy/60 mt-1">{delivery.phone} · {delivery.email}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy/8">
                        <span className="text-navy/60">{method.label} <span className="text-navy/35">({method.eta})</span></span>
                        <span className="font-semibold text-navy">{shippingCost === 0 ? 'Free' : fmt(shippingCost)}</span>
                      </div>
                    </div>

                    {/* PayFast card */}
                    <div className="rounded-2xl border-2 border-blue bg-blue/5 p-5 flex items-center gap-4">
                      <div className="flex items-center flex-shrink-0">
                        <span style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontWeight: 800, fontSize: 18, color: '#0066CC' }}>Pay</span>
                        <span style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontWeight: 800, fontSize: 18, color: '#FF6600' }}>Fast</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-navy text-sm">Pay securely with PayFast</p>
                        <p className="text-xs text-navy/50 mt-0.5">Card, Instant EFT, Apple Pay, SnapScan & more. You'll be redirected to PayFast to complete payment.</p>
                      </div>
                    </div>

                    {/* CPA — returns policy acknowledgement */}
                    <label className="flex items-start gap-3 mt-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={returnsAck}
                        onChange={e => { setReturnsAck(e.target.checked); if (payError) setPayError('') }}
                        className="mt-0.5 w-4 h-4 accent-blue flex-shrink-0"
                      />
                      <span className="text-xs text-navy/60 leading-relaxed">
                        I have read and accept the{' '}
                        <button type="button" onClick={(e) => { e.preventDefault(); setReturnsOpen(true) }} className="text-blue font-semibold underline hover:text-blue-light">
                          Returns Policy
                        </button>{' '}
                        and understand my rights under the Consumer Protection Act.
                      </span>
                    </label>

                    {payError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">{payError}</p>}

                    <div className="mt-6 flex items-center gap-3">
                      <button onClick={() => setStep(2)} disabled={processing} className="text-sm text-navy/50 font-semibold hover:text-navy transition-colors px-4 py-4 disabled:opacity-40">← Back</button>
                      <button
                        onClick={handlePay}
                        disabled={processing}
                        className="flex-1 py-4 rounded-2xl bg-green text-navy font-extrabold text-base tracking-wide hover:bg-green-dim active:scale-[0.98] transition-all shadow-lg shadow-green/20 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            Redirecting to PayFast…
                          </>
                        ) : `Pay ${fmt(grandTotal)} with PayFast`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-5 mt-5 text-[11px] text-navy/40 font-medium">
              <span className="flex items-center gap-1.5">🔒 Secure checkout</span>
              <span className="flex items-center gap-1.5">↩️ 14-day returns</span>
              <span className="flex items-center gap-1.5">🇿🇦 South African brand</span>
            </div>
          </div>

          {/* ── RIGHT — order summary ── */}
          <div className="w-full lg:w-[360px] flex-shrink-0 lg:sticky lg:top-[6.5rem]">
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <h2 className="font-display font-extrabold text-lg text-navy">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto -mr-2 pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-lavender">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy line-clamp-2 leading-snug">{item.name}</p>
                      <p className="text-xs text-navy/45 mt-0.5">{fmt(item.price)}</p>
                    </div>
                    <p className="text-xs font-bold text-navy whitespace-nowrap">{fmt(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-navy/6" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-navy/60">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-navy">{fmt(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-navy/60">
                  <span>Shipping {step >= 2 && <span className="text-navy/35">· {method.label}</span>}</span>
                  {shippingCost === 0 ? <span className="font-semibold text-green">Free</span> : <span className="font-semibold text-navy">{fmt(shippingCost)}</span>}
                </div>
              </div>

              <div className="border-t border-navy/6" />

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-display font-extrabold text-base text-navy">Total</span>
                  <motion.span key={grandTotal} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-display font-extrabold text-2xl text-navy">
                    {fmt(grandTotal)}
                  </motion.span>
                </div>
                <p className="text-[11px] text-navy/40 text-right mt-0.5">Includes {fmt(vatAmount)} VAT (15%)</p>
              </div>

              {/* CPA link always available at checkout */}
              <button onClick={() => setReturnsOpen(true)} className="w-full text-center text-xs text-navy/40 hover:text-blue transition-colors pt-1">
                Returns Policy & your CPA rights
              </button>
            </div>
          </div>
        </div>
      </div>

      {returnsOpen && <ReturnsPolicyModal onClose={() => setReturnsOpen(false)} />}
    </div>
  )
}
