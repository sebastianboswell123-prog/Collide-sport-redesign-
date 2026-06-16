import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import AppImage from '../components/ui/AppImage'

// ── Attempt to send a confirmation email via EmailJS REST API ─────────────────
// Configure these in .env: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
async function sendConfirmationEmail(order) {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    console.info('[Collide] EmailJS not configured — skipping confirmation email.')
    return false
  }

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  serviceId,
        template_id: templateId,
        user_id:     publicKey,
        template_params: {
          to_email:    order.delivery.email,
          to_name:     `${order.delivery.firstName} ${order.delivery.lastName}`,
          order_id:    order.orderId,
          order_total: `R ${Math.round(order.orderTotal).toLocaleString()}`,
          order_items: order.items.map(i => `${i.name} × ${i.qty}`).join(', '),
          shipping:    order.shippingOption,
          address:     `${order.delivery.address}, ${order.delivery.city}, ${order.delivery.province} ${order.delivery.postalCode}`,
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export default function OrderConfirmation() {
  const { clearCart } = useCart()
  const { formatPrice } = useCurrency()
  const [order, setOrder] = useState(null)
  const [emailSent, setEmailSent] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('collide_pending_order')
    if (!raw) return

    const parsed = JSON.parse(raw)
    setOrder(parsed)

    // Clear cart and pending order
    clearCart()
    sessionStorage.removeItem('collide_pending_order')

    // Attempt email
    sendConfirmationEmail(parsed).then(sent => setEmailSent(sent))
  }, [clearCart])

  // Demo order shown when arriving directly at this URL (e.g. PayFast sandbox redirect)
  const demo = !order ? {
    orderId: 'CS-DEMO-001',
    delivery: { firstName: 'Marco', lastName: 'P.', email: 'marco@example.co.za', address: '12 Main Road', city: 'Cape Town', province: 'Western Cape', postalCode: '8001' },
    items: [],
    shippingOption: 'Standard Delivery (3–5 business days)',
    orderTotal: 0,
    vatAmount: 0,
    placedAt: new Date().toISOString(),
  } : null

  const o = order || demo

  const placedDate = o?.placedAt ? new Date(o.placedAt) : new Date()
  const estDelivery = (() => {
    const d = new Date(placedDate)
    let added = 0
    const days = o?.shippingOption?.toLowerCase().includes('express') ? 2 : 5
    while (added < days) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0 && d.getDay() !== 6) added++
    }
    return d.toLocaleDateString('en-ZA', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  })()

  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <div className="mx-auto max-w-[680px] px-6 py-16">

        {/* Success badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center shadow-xl shadow-green/30">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0e1b4d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight mb-2">
            Order Confirmed! 🏉
          </h1>
          <p className="text-navy/50 text-base">
            Thank you{o?.delivery?.firstName ? `, ${o.delivery.firstName}` : ''}. Your order is on its way.
          </p>
        </motion.div>

        {/* Order number card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-navy text-white rounded-2xl p-6 text-center mb-6"
        >
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase mb-2">Order Number</p>
          <p className="font-display font-extrabold text-3xl tracking-widest text-green">{o?.orderId}</p>
          <p className="text-white/40 text-xs mt-2 font-mono">Save this number for your records</p>
        </motion.div>

        {/* Email confirmation banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${emailSent === true ? 'bg-green/10 border border-green/20' : emailSent === false ? 'bg-lavender border border-navy/10' : 'bg-lavender border border-navy/10'}`}
        >
          <span className="text-xl flex-shrink-0">
            {emailSent === true ? '📧' : '📬'}
          </span>
          <div>
            {emailSent === true ? (
              <>
                <p className="text-sm font-semibold text-green-700">Confirmation email sent!</p>
                <p className="text-xs text-navy/50 mt-0.5">Check your inbox at <strong>{o?.delivery?.email}</strong></p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-navy">Confirmation sent to {o?.delivery?.email || 'your email'}</p>
                <p className="text-xs text-navy/50 mt-0.5">
                  You'll receive a confirmation email shortly.{' '}
                  {emailSent === false && (
                    <span className="text-navy/40">
                      (Configure <span className="font-mono">VITE_EMAILJS_*</span> env vars for automated emails.)
                    </span>
                  )}
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-6 mb-6 space-y-4"
        >
          <h2 className="font-display font-bold text-navy text-lg">Order Details</h2>

          {/* Items */}
          {o?.items?.length > 0 && (
            <div className="space-y-3 border-b border-navy/8 pb-4">
              {o.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-lavender flex-shrink-0">
                    <AppImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{item.name}</p>
                    <p className="text-xs text-navy/40">Qty: {item.qty}</p>
                  </div>
                  <p className="text-xs font-bold text-navy">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Summary rows */}
          <div className="space-y-2 text-sm">
            {o?.orderTotal > 0 && (
              <div className="flex justify-between font-display font-extrabold text-navy text-base">
                <span>Total Paid</span>
                <span>{formatPrice(o.orderTotal)}</span>
              </div>
            )}
            {o?.vatAmount > 0 && (
              <div className="flex justify-between text-xs text-navy/40 font-mono">
                <span>Includes VAT (15%)</span>
                <span>{formatPrice(o.vatAmount)}</span>
              </div>
            )}
          </div>

          {/* Delivery info */}
          <div className="border-t border-navy/8 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy/50">Deliver to</span>
              <span className="text-navy font-medium text-right">
                {o?.delivery?.address}, {o?.delivery?.city}, {o?.delivery?.province}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/50">Shipping</span>
              <span className="text-navy font-medium">{o?.shippingOption}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/50">Estimated delivery</span>
              <span className="text-green-700 font-semibold">{estDelivery}</span>
            </div>
          </div>
        </motion.div>

        {/* CPA returns notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="bg-lavender rounded-xl p-4 mb-8 text-xs text-navy/50 leading-relaxed"
        >
          <strong className="text-navy/70">Returns &amp; CPA Rights:</strong> Under the Consumer Protection Act (CPA No. 68 of 2008), you have the right to return this product within <strong>5 business days</strong> if it does not conform to the product description, is defective, or was not delivered as described. Visit our{' '}
          <Link to="/returns-policy" className="text-blue hover:text-blue-light underline">Returns Policy</Link> or{' '}
          <Link to="/contact" className="text-blue hover:text-blue-light underline">contact us</Link> for assistance.
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link to="/catalogue" className="flex-1 bg-blue text-white font-bold py-4 rounded-full hover:bg-blue-light transition-colors text-center">
            Continue Shopping
          </Link>
          <Link to="/contact" className="flex-1 border-2 border-navy/15 text-navy/60 font-semibold py-4 rounded-full hover:border-navy/30 transition-colors text-center text-sm">
            Need Help?
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
