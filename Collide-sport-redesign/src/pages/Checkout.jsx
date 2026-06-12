import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

// ─── PayFast configuration ────────────────────────────────────────────────────
// Sandbox in dev, live in prod. Replace env vars with real credentials before go-live.
const IS_PROD = import.meta.env.PROD
const PAYFAST_URL = IS_PROD
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process'
const MERCHANT_ID  = import.meta.env.VITE_PAYFAST_MERCHANT_ID  || '10000100'
const MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694581a'

// ─── SA Provinces ─────────────────────────────────────────────────────────────
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

// ─── Shipping options ─────────────────────────────────────────────────────────
const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    desc: '3–5 business days',
    price: (subtotal) => subtotal >= 1000 ? 0 : 99,
    carrier: 'Courier Guy / Fastway',
  },
  {
    id: 'express',
    label: 'Express Delivery',
    desc: '1–2 business days',
    price: () => 199,
    carrier: 'DHL Express',
  },
]

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ['Delivery', 'Shipping', 'Payment']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'pending'
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                state === 'done' ? 'bg-green text-navy'
                : state === 'active' ? 'bg-blue text-white'
                : 'bg-lavender text-navy/30'}`}
              >
                {state === 'done' ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] font-mono mt-1.5 tracking-wider ${state === 'active' ? 'text-navy' : 'text-navy/40'}`}>
                {label.toUpperCase()}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors ${i < current ? 'bg-green' : 'bg-navy/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateStep1(d) {
  const errors = {}
  if (!d.firstName.trim()) errors.firstName = 'Required'
  if (!d.lastName.trim()) errors.lastName = 'Required'
  if (!d.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.email = 'Valid email required'
  if (!d.phone.trim() || !/^[\d\s+()-]{9,15}$/.test(d.phone)) errors.phone = 'Valid phone required'
  if (!d.address.trim()) errors.address = 'Required'
  if (!d.city.trim()) errors.city = 'Required'
  if (!d.province) errors.province = 'Select a province'
  if (!d.postalCode.trim() || !/^\d{4}$/.test(d.postalCode)) errors.postalCode = '4-digit postal code required'
  return errors
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/70 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  )
}

const inputClass = (hasError) =>
  `w-full border rounded-xl px-4 py-3 text-sm text-navy outline-none transition-colors bg-white ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-navy/15 focus:border-blue'
  }`

// ─── Main component ───────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()
  const payfastFormRef = useRef(null)

  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})

  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', address2: '', city: '', province: '', postalCode: '',
    saveAddress: false,
  })

  const [shippingId, setShippingId] = useState('standard')
  const [agreedCPA, setAgreedCPA] = useState(false)

  const shippingOption = SHIPPING_OPTIONS.find(s => s.id === shippingId)
  const shippingCost   = shippingOption?.price(totalPrice) ?? 99
  const orderTotal     = totalPrice + shippingCost
  const vatAmount      = Math.round(orderTotal - orderTotal / 1.15)

  // Generate a stable order ID for this session
  const orderId = useRef(`CS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`).current

  if (items.length === 0) {
    return (
      <div className="pt-14 min-h-screen bg-lavender flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-2xl text-navy mb-3">Your cart is empty</h1>
          <Link to="/catalogue" className="text-blue font-semibold hover:text-blue-light transition-colors">← Browse Products</Link>
        </div>
      </div>
    )
  }

  // ── Step 1: Submit ────────────────────────────────────────────────────────
  function handleDeliveryNext(e) {
    e.preventDefault()
    const errs = validateStep1(delivery)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(1)
    window.scrollTo(0, 0)
  }

  // ── Step 2: Submit ────────────────────────────────────────────────────────
  function handleShippingNext(e) {
    e.preventDefault()
    setStep(2)
    window.scrollTo(0, 0)
  }

  // ── Step 3: Submit to PayFast ─────────────────────────────────────────────
  function handlePayNow(e) {
    e.preventDefault()
    if (!agreedCPA) { alert('Please agree to the returns policy to proceed.'); return }

    // Store order in sessionStorage so confirmation page can read it
    const order = {
      orderId,
      items,
      delivery,
      shippingOption: shippingOption?.label,
      shippingCost,
      orderTotal,
      vatAmount,
      placedAt: new Date().toISOString(),
    }
    sessionStorage.setItem('collide_pending_order', JSON.stringify(order))

    // Trigger the hidden PayFast form
    payfastFormRef.current?.submit()
  }

  const baseUrl = window.location.origin

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="pt-14 min-h-screen bg-lavender">

      {/* Header */}
      <div className="bg-navy-dark py-10 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-1">Checkout</p>
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-white tracking-tight">Secure Checkout</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── Left: Steps ── */}
          <div>
            <AnimatePresence mode="wait">

              {/* STEP 1: Delivery details */}
              {step === 0 && (
                <motion.div key="step1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.25 }}>
                  <form onSubmit={handleDeliveryNext} className="bg-white rounded-2xl p-6 lg:p-8 space-y-5">
                    <h2 className="font-display font-bold text-navy text-xl mb-2">Delivery Details</h2>

                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="First Name" error={errors.firstName} required>
                        <input value={delivery.firstName} onChange={e => setDelivery(p => ({...p, firstName: e.target.value}))} className={inputClass(errors.firstName)} placeholder="Marco" />
                      </Field>
                      <Field label="Last Name" error={errors.lastName} required>
                        <input value={delivery.lastName} onChange={e => setDelivery(p => ({...p, lastName: e.target.value}))} className={inputClass(errors.lastName)} placeholder="Peters" />
                      </Field>
                    </div>

                    {/* Contact row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Email Address" error={errors.email} required>
                        <input type="email" value={delivery.email} onChange={e => setDelivery(p => ({...p, email: e.target.value}))} className={inputClass(errors.email)} placeholder="marco@example.co.za" />
                      </Field>
                      <Field label="Phone Number" error={errors.phone} required>
                        <input type="tel" value={delivery.phone} onChange={e => setDelivery(p => ({...p, phone: e.target.value}))} className={inputClass(errors.phone)} placeholder="+27 82 000 0000" />
                      </Field>
                    </div>

                    {/* Address */}
                    <Field label="Street Address" error={errors.address} required>
                      <input value={delivery.address} onChange={e => setDelivery(p => ({...p, address: e.target.value}))} className={inputClass(errors.address)} placeholder="12 Main Road" />
                    </Field>

                    <Field label="Address Line 2" error={null}>
                      <input value={delivery.address2} onChange={e => setDelivery(p => ({...p, address2: e.target.value}))} className={inputClass(false)} placeholder="Apartment, suite, unit (optional)" />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="City / Town" error={errors.city} required>
                        <input value={delivery.city} onChange={e => setDelivery(p => ({...p, city: e.target.value}))} className={inputClass(errors.city)} placeholder="Cape Town" />
                      </Field>

                      {/* SA Provinces dropdown — all 9 */}
                      <Field label="Province" error={errors.province} required>
                        <select
                          value={delivery.province}
                          onChange={e => setDelivery(p => ({...p, province: e.target.value}))}
                          className={inputClass(errors.province) + ' cursor-pointer'}
                        >
                          <option value="">Select province</option>
                          {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </Field>

                      <Field label="Postal Code" error={errors.postalCode} required>
                        <input value={delivery.postalCode} onChange={e => setDelivery(p => ({...p, postalCode: e.target.value}))} className={inputClass(errors.postalCode)} placeholder="8000" maxLength={4} />
                      </Field>
                    </div>

                    {/* CPA compliance */}
                    <div className="border-t border-navy/8 pt-5 space-y-3">
                      <p className="text-xs text-navy/50 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <Link to="/returns-policy" className="text-blue hover:text-blue-light underline">Returns Policy</Link>
                        {' '}and{' '}
                        <Link to="/contact" className="text-blue hover:text-blue-light underline">Terms of Service</Link>
                        . Under the Consumer Protection Act (CPA), you have the right to return goods within 5 business days if they do not conform to the description.
                      </p>
                    </div>

                    <button type="submit" className="w-full bg-blue text-white font-bold py-4 rounded-full hover:bg-blue-light transition-colors text-base mt-2">
                      Continue to Shipping →
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: Shipping method */}
              {step === 1 && (
                <motion.div key="step2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.25 }}>
                  <form onSubmit={handleShippingNext} className="bg-white rounded-2xl p-6 lg:p-8 space-y-5">
                    <h2 className="font-display font-bold text-navy text-xl mb-2">Shipping Method</h2>

                    <p className="text-sm text-navy/50">
                      Delivering to <strong className="text-navy">{delivery.address}, {delivery.city}, {delivery.province} {delivery.postalCode}</strong>{' '}
                      <button type="button" onClick={() => setStep(0)} className="text-blue text-xs hover:text-blue-light transition-colors ml-1">Edit</button>
                    </p>

                    <div className="space-y-3">
                      {SHIPPING_OPTIONS.map(opt => {
                        const cost = opt.price(totalPrice)
                        const selected = shippingId === opt.id
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selected ? 'border-blue bg-blue/5' : 'border-navy/10 hover:border-navy/25'}`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={opt.id}
                              checked={selected}
                              onChange={() => setShippingId(opt.id)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-blue' : 'border-navy/20'}`}>
                              {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-display font-bold text-navy">{opt.label}</p>
                              <p className="text-xs text-navy/50 mt-0.5">{opt.desc} via {opt.carrier}</p>
                            </div>
                            <span className={`font-bold text-sm flex-shrink-0 ${cost === 0 ? 'text-green-700' : 'text-navy'}`}>
                              {cost === 0 ? 'FREE' : formatPrice(cost)}
                            </span>
                          </label>
                        )
                      })}
                    </div>

                    {shippingId === 'standard' && totalPrice < 1000 && (
                      <p className="text-xs text-navy/40 bg-lavender rounded-lg px-4 py-3">
                        Spend {formatPrice(1000 - totalPrice)} more to qualify for free standard shipping
                      </p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => { setStep(0); window.scrollTo(0,0) }} className="flex-1 border-2 border-navy/15 text-navy/60 font-semibold py-3.5 rounded-full hover:border-navy/30 transition-colors">
                        ← Back
                      </button>
                      <button type="submit" className="flex-[2] bg-blue text-white font-bold py-3.5 rounded-full hover:bg-blue-light transition-colors">
                        Continue to Payment →
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: Payment */}
              {step === 2 && (
                <motion.div key="step3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.25 }}>
                  <form onSubmit={handlePayNow} className="bg-white rounded-2xl p-6 lg:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <h2 className="font-display font-bold text-navy text-xl">Payment</h2>
                      <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green/10 px-3 py-1 rounded-full font-medium">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        Secured by PayFast
                      </span>
                      {!IS_PROD && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-mono">SANDBOX</span>}
                    </div>

                    {/* Delivery summary */}
                    <div className="bg-lavender rounded-xl p-4 text-sm space-y-1">
                      <div className="flex justify-between text-navy/60"><span>Delivering to</span><span className="text-navy font-medium text-right max-w-[200px] truncate">{delivery.firstName} {delivery.lastName}, {delivery.city}</span></div>
                      <div className="flex justify-between text-navy/60"><span>Shipping</span><span className="text-navy font-medium">{shippingOption?.label}</span></div>
                    </div>

                    {/* PayFast redirect notice */}
                    <div className="border border-blue/20 bg-blue/5 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <img src="https://www.payfast.co.za/assets/images/PayFast_Logo_Large.png" alt="PayFast" className="h-6 mt-0.5 object-contain" onError={e => e.target.style.display='none'} />
                        <div>
                          <p className="text-sm font-semibold text-navy">Pay securely via PayFast</p>
                          <p className="text-xs text-navy/50 mt-1">You'll be redirected to PayFast to complete payment. Accepts credit/debit cards, EFT, and Instant EFT.</p>
                        </div>
                      </div>
                    </div>

                    {/* CPA returns policy — must be agreed to */}
                    <div className="border-t border-navy/8 pt-4 space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div
                          onClick={() => setAgreedCPA(v => !v)}
                          className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${agreedCPA ? 'bg-blue border-blue' : 'border-navy/25 group-hover:border-blue/50'}`}
                        >
                          {agreedCPA && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <p className="text-xs text-navy/60 leading-relaxed">
                          I have read and agree to the{' '}
                          <Link to="/returns-policy" target="_blank" className="text-blue hover:text-blue-light underline">Returns &amp; Refund Policy</Link>
                          {' '}and{' '}
                          <Link to="/contact" className="text-blue hover:text-blue-light underline">Terms of Service</Link>.
                          Under the Consumer Protection Act (CPA No. 68 of 2008), you may return goods within 5 business days if they do not conform to the product description.
                        </p>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => { setStep(1); window.scrollTo(0,0) }} className="flex-1 border-2 border-navy/15 text-navy/60 font-semibold py-3.5 rounded-full hover:border-navy/30 transition-colors">
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={!agreedCPA}
                        className={`flex-[2] font-bold py-3.5 rounded-full transition-all ${agreedCPA ? 'bg-green text-navy hover:bg-green-dim shadow-lg shadow-green/20' : 'bg-lavender text-navy/30 cursor-not-allowed'}`}
                      >
                        Pay {formatPrice(orderTotal)} via PayFast →
                      </button>
                    </div>
                  </form>

                  {/* Hidden PayFast form — submitted programmatically */}
                  <form ref={payfastFormRef} action={PAYFAST_URL} method="POST" className="hidden">
                    <input type="hidden" name="merchant_id"    value={MERCHANT_ID} />
                    <input type="hidden" name="merchant_key"   value={MERCHANT_KEY} />
                    <input type="hidden" name="return_url"     value={`${baseUrl}/order-confirmation`} />
                    <input type="hidden" name="cancel_url"     value={`${baseUrl}/checkout`} />
                    <input type="hidden" name="notify_url"     value={`${baseUrl}/api/payfast-notify`} />
                    <input type="hidden" name="name_first"     value={delivery.firstName} />
                    <input type="hidden" name="name_last"      value={delivery.lastName} />
                    <input type="hidden" name="email_address"  value={delivery.email} />
                    <input type="hidden" name="cell_number"    value={delivery.phone.replace(/\D/g,'')} />
                    <input type="hidden" name="m_payment_id"   value={orderId} />
                    <input type="hidden" name="amount"         value={(orderTotal).toFixed(2)} />
                    <input type="hidden" name="item_name"      value={`Collide Sport Order ${orderId}`} />
                    <input type="hidden" name="item_description" value={items.slice(0,3).map(i=>`${i.name} x${i.qty}`).join(', ')} />
                    <input type="hidden" name="custom_str1"    value={JSON.stringify({ address: `${delivery.address}, ${delivery.city}, ${delivery.province} ${delivery.postalCode}`, shipping: shippingOption?.label })} />
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-display font-bold text-navy mb-4">Order Summary</h3>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-lavender flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-navy text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none w-5 h-5">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy truncate">{item.name}</p>
                      <p className="text-xs text-navy/40">{formatPrice(item.price)} each</p>
                    </div>
                    <p className="text-xs font-bold text-navy flex-shrink-0">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-navy/8 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-navy/60"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between text-navy/60"><span>Shipping</span><span className={shippingCost === 0 ? 'text-green-700 font-semibold' : ''}>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between text-xs text-navy/40 font-mono border-t border-navy/8 pt-2">
                  <span>VAT (15%)</span><span>{formatPrice(vatAmount)}</span>
                </div>
                <div className="flex justify-between font-display font-extrabold text-navy text-lg pt-1">
                  <span>Total</span><span>{formatPrice(orderTotal)}</span>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="bg-white rounded-2xl p-5 space-y-3">
              {[
                { icon:'🔒', text:'256-bit SSL encryption' },
                { icon:'🛡️', text:'PayFast secure payments' },
                { icon:'↩️', text:'CPA-compliant returns' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-navy/50">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
