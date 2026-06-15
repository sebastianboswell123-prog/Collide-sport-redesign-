import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { getOrder, markOrderPaid, sendConfirmationEmail } from '../lib/orders'
import ReturnsPolicyModal from '../components/ReturnsPolicyModal'

const fmt = (n) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

export default function OrderConfirmation() {
  const [params] = useSearchParams()
  const orderNumber = params.get('order')
  const { clearCart } = useCart()

  const [order, setOrder] = useState(() => getOrder(orderNumber))
  const [emailState, setEmailState] = useState('idle') // idle | sending | sent | skipped
  const [returnsOpen, setReturnsOpen] = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    // Buyer returned from PayFast → treat the order as paid, clear the cart,
    // and send the confirmation email (once).
    const paid = markOrderPaid(orderNumber)
    if (paid) setOrder(paid)
    clearCart()

    if (paid) {
      setEmailState('sending')
      sendConfirmationEmail(paid).then(ok => setEmailState(ok ? 'sent' : 'skipped'))
    }
  }, [orderNumber, clearCart])

  // ── Order not found (direct visit / cleared storage) ──
  if (!order) {
    return (
      <div className="min-h-screen bg-lavender pt-14 flex items-center justify-center px-6">
        <div className="text-center py-24">
          <h1 className="font-display font-extrabold text-2xl text-navy mb-2">Order not found</h1>
          <p className="text-navy/50 text-sm mb-8 max-w-sm">
            {orderNumber
              ? <>We couldn't find order <span className="font-mono font-semibold text-navy">{orderNumber}</span> on this device.</>
              : 'No order reference was provided.'}
          </p>
          <Link to="/catalogue" className="inline-block bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors">
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  const c = order.customer

  return (
    <div className="min-h-screen bg-lavender pt-14 pb-24 lg:pb-16">
      <div className="mx-auto max-w-[760px] px-4 sm:px-6 py-10 lg:py-14">

        {/* Success header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14, stiffness: 220, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-5"
          >
            <svg className="w-10 h-10 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight mb-2">Thank you{c.name ? `, ${c.name.split(' ')[0]}` : ''}!</h1>
          <p className="text-navy/55">Your order has been placed successfully.</p>
        </motion.div>

        {/* Order number */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-navy-dark rounded-2xl px-6 py-5 text-center mb-5">
          <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase mb-1">Order Number</p>
          <p className="font-display font-extrabold text-2xl lg:text-3xl text-white tracking-wide">{order.orderNumber}</p>
          {order.payment?.mode === 'sandbox' && (
            <p className="text-[10px] font-mono text-blue mt-1.5 uppercase tracking-widest">Sandbox test order</p>
          )}
        </motion.div>

        {/* Email status */}
        <div className="mb-5 flex items-center justify-center gap-2 text-sm">
          {emailState === 'sending' && <span className="text-navy/50">Sending confirmation to {c.email}…</span>}
          {emailState === 'sent' && (
            <span className="text-navy/60 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Confirmation email sent to <span className="font-semibold text-navy">{c.email}</span>
            </span>
          )}
          {emailState === 'skipped' && (
            <span className="text-navy/45 text-center">A confirmation for <span className="font-semibold text-navy">{c.email}</span> will follow shortly.</span>
          )}
        </div>

        {/* Order details card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 lg:p-8">

          {/* Items */}
          <h2 className="font-display font-extrabold text-base text-navy mb-4">Order details</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-lavender">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">{item.qty}</span>
                </div>
                <p className="flex-1 min-w-0 text-sm font-semibold text-navy line-clamp-2">{item.name}</p>
                <p className="text-sm font-bold text-navy whitespace-nowrap">{fmt(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-navy/8 my-5" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-navy/60"><span>Subtotal</span><span className="font-semibold text-navy">{fmt(order.totals.subtotal)}</span></div>
            <div className="flex justify-between text-navy/60">
              <span>Shipping · {order.shipping.label}</span>
              {order.totals.shipping === 0 ? <span className="font-semibold text-green">Free</span> : <span className="font-semibold text-navy">{fmt(order.totals.shipping)}</span>}
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-navy/8">
              <span className="font-display font-extrabold text-navy">Total</span>
              <span className="font-display font-extrabold text-xl text-navy">{fmt(order.totals.total)}</span>
            </div>
            <p className="text-[11px] text-navy/40 text-right">Includes {fmt(order.totals.vat)} VAT (15%)</p>
          </div>

          <div className="border-t border-navy/8 my-5" />

          {/* Delivery + shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-1.5">Delivery address</p>
              <p className="font-semibold text-navy">{c.name}</p>
              <p className="text-navy/60">{c.address}</p>
              <p className="text-navy/60">{c.city}, {c.province}, {c.postalCode}</p>
              <p className="text-navy/60 mt-1">{c.phone}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-1.5">Shipping method</p>
              <p className="font-semibold text-navy">{order.shipping.label}</p>
              <p className="text-navy/60">{order.shipping.eta}</p>
            </div>
          </div>
        </motion.div>

        {/* Footer actions */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/catalogue" className="w-full sm:w-auto text-center bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors">
            Continue shopping
          </Link>
          <button onClick={() => setReturnsOpen(true)} className="text-sm text-navy/50 font-semibold hover:text-blue transition-colors">
            Returns Policy
          </button>
        </div>

        <p className="text-center text-xs text-navy/35 mt-6 leading-relaxed">
          A copy of this confirmation has been emailed to you. Questions about your order?{' '}
          <Link to="/contact" className="text-blue font-semibold">Contact us</Link>.
        </p>
      </div>

      {returnsOpen && <ReturnsPolicyModal onClose={() => setReturnsOpen(false)} />}
    </div>
  )
}
