import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import CollideLogo from '../CollideLogo'

// ── Store details — update these when confirmed ───────────────────────────────
const STORE_EMAIL     = 'hello@collidesport.co.za'
const WHATSAPP_NUMBER = '27000000000'
const WHATSAPP_MSG    = 'Hi, I need help with my order.'
const VAT_NUMBER      = '4XXXXXXXXX'           // replace with real VAT registration number
const STORE_ADDRESS   = null                   // e.g. '12 Rugby Rd, Bellville, Cape Town, 7530'

const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`

// ── Navigation data ───────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'About Us',    to: '/about' },
  { label: 'Catalogue',   to: '/catalogue' },
  { label: 'Cart',        to: '/cart' },
  { label: 'Fit Finder',  to: '/fit-finder' },
  { label: 'Team Kit',    to: '/team-kit' },
  { label: 'Blog',        to: '/blog' },
]

const CATEGORY_LINKS = [
  { label: 'Scrum Caps',    to: '/catalogue?categories=scrum-caps' },
  { label: 'Premium Caps',  to: '/catalogue?categories=premium-caps' },
  { label: 'Activewear',    to: '/catalogue?categories=activewear' },
  { label: 'New Arrivals',  to: '/catalogue?badge=New' },
]

const SUPPORT_LINKS = [
  { label: 'Contact Us',      to: '/contact' },
  { label: 'Returns Policy',  modal: true },
  { label: 'Sizing Guide',    to: '/fit-finder' },
  { label: 'Team Orders',     to: '/team-kit' },
]

// ── Returns policy content ────────────────────────────────────────────────────
const RETURNS_POLICY = [
  {
    heading: '14-Day Returns',
    body: 'Items may be returned within 14 days of delivery, provided they are unworn, unwashed, and in their original packaging with all tags attached.',
  },
  {
    heading: 'How to Return',
    body: `Contact us via WhatsApp or email before sending anything back. We'll confirm your return and provide instructions. Returns sent without prior contact may not be accepted.`,
  },
  {
    heading: 'Exchanges',
    body: 'We gladly exchange items for a different size or colour. If the replacement item is a different price, the difference will be charged or refunded accordingly.',
  },
  {
    heading: 'Non-Returnable Items',
    body: 'Customised or embroidered items, sale items marked as final sale, and items that show signs of wear or washing cannot be returned.',
  },
  {
    heading: 'Refunds',
    body: 'Once your return is inspected and accepted, a refund is processed within 5–7 business days to your original payment method. Shipping costs are non-refundable.',
  },
  {
    heading: 'Faulty Items',
    body: 'If your item arrives damaged or defective, contact us within 48 hours of delivery with photos. We will replace it at no cost to you.',
  },
]

// ── Payment badge components — CSS/text only, no path SVGs ───────────────────
function VisaBadge() {
  return (
    <div
      title="Visa"
      className="h-8 px-4 rounded flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: '#1A1F71' }}
    >
      <span style={{
        fontFamily: '"Arial Black", "Arial Bold", Arial, sans-serif',
        fontWeight: 900,
        fontStyle: 'italic',
        fontSize: '15px',
        color: '#ffffff',
        letterSpacing: '2px',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        VISA
      </span>
    </div>
  )
}

function MastercardBadge() {
  return (
    <div
      title="Mastercard"
      className="h-8 px-3 rounded flex items-center gap-2 flex-shrink-0"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Two overlapping circles — inline styles for cross-browser reliability */}
      <div style={{ position: 'relative', width: '34px', height: '22px', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#EB001B',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#F79E1B', opacity: 0.88,
        }} />
      </div>
      <span style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontWeight: '500',
        color: '#333333',
        letterSpacing: '0.2px',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        mastercard
      </span>
    </div>
  )
}

function PayFastBadge() {
  return (
    <div
      title="PayFast"
      className="h-8 px-3 rounded flex items-center flex-shrink-0"
      style={{ backgroundColor: '#ffffff' }}
    >
      <span style={{
        fontFamily: '"Arial Black", Arial, sans-serif',
        fontWeight: 800,
        fontSize: '13px',
        color: '#0066CC',
        lineHeight: 1,
        userSelect: 'none',
      }}>Pay</span>
      <span style={{
        fontFamily: '"Arial Black", Arial, sans-serif',
        fontWeight: 800,
        fontSize: '13px',
        color: '#FF6600',
        lineHeight: 1,
        userSelect: 'none',
      }}>Fast</span>
    </div>
  )
}

// ── Returns policy modal ──────────────────────────────────────────────────────
function ReturnsPolicyModal({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-navy/8 flex-shrink-0">
            <div>
              <h2 className="font-display font-extrabold text-navy text-lg tracking-tight">Returns Policy</h2>
              <p className="text-xs text-navy/40 mt-0.5">Effective date: January 2024</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close returns policy"
              className="w-9 h-9 rounded-full bg-lavender text-navy/40 hover:bg-navy hover:text-white transition-all flex items-center justify-center flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto px-6 py-6 space-y-5 overscroll-contain">
            {RETURNS_POLICY.map(({ heading, body }) => (
              <div key={heading}>
                <h3 className="font-display font-bold text-navy text-sm mb-1.5">{heading}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{body}</p>
              </div>
            ))}
            <div className="rounded-xl bg-lavender p-4 text-sm text-navy/60 leading-relaxed">
              <strong className="text-navy">Questions?</strong> Contact us on{' '}
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-blue font-semibold">WhatsApp</a>{' '}
              or email{' '}
              <a href={`mailto:${STORE_EMAIL}`} className="text-blue font-semibold">{STORE_EMAIL}</a>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-navy/8 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full bg-navy text-white rounded-full py-3.5 text-sm font-semibold hover:bg-navy-dark transition-colors active:scale-[.98]"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
export default function Footer() {
  const [returnsOpen, setReturnsOpen] = useState(false)

  return (
    <>
      <footer className="bg-navy-dark text-white pt-14 lg:pt-20 pb-6 lg:pb-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          {/* ── Main grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

            {/* Brand + contact (spans 2 cols on desktop) */}
            <div className="col-span-2">
              {/* Logo */}
              <Link to="/" aria-label="Collide Sport — Home">
                <CollideLogo size="md" variant="light" layout="stacked" />
              </Link>
              <p className="mt-3 text-sm text-white/45 max-w-xs leading-relaxed">
                South Africa's most trusted rugby scrum cap brand. Quality protection at every level of the game.
              </p>

              {/* Contact */}
              <div className="mt-6 space-y-3">
                {/* WhatsApp */}
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 group"
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                    <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <span className="text-sm text-white/50 group-hover:text-white transition-colors">WhatsApp us</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="flex items-center gap-2.5 group"
                >
                  <span className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <span className="text-sm text-white/50 group-hover:text-white transition-colors">{STORE_EMAIL}</span>
                </a>

                {/* Address */}
                {STORE_ADDRESS && (
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </span>
                    <span className="text-sm text-white/50 leading-relaxed">{STORE_ADDRESS}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-white/30 mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3.5">
                {QUICK_LINKS.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-white/50 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-white/30 mb-5">
                Categories
              </h4>
              <ul className="space-y-3.5">
                {CATEGORY_LINKS.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-white/50 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-white/30 mb-5">
                Support
              </h4>
              <ul className="space-y-3.5">
                {SUPPORT_LINKS.map(({ label, to, modal }) => (
                  <li key={label}>
                    {modal ? (
                      <button
                        type="button"
                        onClick={() => setReturnsOpen(true)}
                        className="text-sm text-white/50 hover:text-white transition-colors text-left"
                      >
                        {label}
                      </button>
                    ) : (
                      <Link to={to} className="text-sm text-white/50 hover:text-white transition-colors">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-white/8 pt-8">

            {/* Payment badges row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-0 sm:justify-between mb-6">
              {/* Left — accepted payment */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Accepted Payments</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <PayFastBadge />
                  <VisaBadge />
                  <MastercardBadge />
                  {/* EFT note */}
                  <div className="bg-white/8 h-8 px-3 rounded flex items-center">
                    <span className="text-[10px] font-mono font-semibold text-white/50 uppercase tracking-wide">EFT</span>
                  </div>
                </div>
              </div>

              {/* Right — security note */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/25 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <p className="text-xs text-white/30">Secure checkout powered by PayFast</p>
              </div>
            </div>

            {/* Bottom row — copyright, VAT, policy links */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              {/* Left */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/25">
                <span>© {new Date().getFullYear()} Collide Sport. All rights reserved.</span>
                <span className="hidden sm:inline text-white/15">·</span>
                <span className="font-mono">VAT Reg: {VAT_NUMBER}</span>
              </div>

              {/* Right — policy links */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link to="/contact" className="text-white/30 hover:text-white transition-colors">Privacy</Link>
                <Link to="/contact" className="text-white/30 hover:text-white transition-colors">Terms</Link>
                <button
                  type="button"
                  onClick={() => setReturnsOpen(true)}
                  className="text-white/30 hover:text-white transition-colors font-medium"
                >
                  Returns Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Returns modal — rendered outside footer for correct z-index stacking */}
      {returnsOpen && <ReturnsPolicyModal onClose={() => setReturnsOpen(false)} />}
    </>
  )
}
