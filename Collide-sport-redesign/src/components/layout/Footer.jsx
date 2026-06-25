import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import CollideLogo from '../CollideLogo'
import { VisaBadge, MastercardBadge, PayFastBadge } from './PaymentBadges'
import ReturnsPolicyModal from './ReturnsPolicyModal'

// ── Store details — update these when confirmed ───────────────────────────────
const STORE_EMAIL     = 'info@collidesport.co.za'
const WHATSAPP_NUMBER = '27827804116'
const WHATSAPP_MSG    = 'Hi, I need help with my order.'
const VAT_NUMBER      = '4XXXXXXXXX'           // replace with real VAT registration number
const STORE_ADDRESS   = null                   // e.g. '12 Rugby Rd, Bellville, Cape Town, 7530'

const QUICK_LINKS = [
  { label: 'About Us',   to: '/about' },
  { label: 'Catalogue',  to: '/catalogue' },
  { label: 'Cart',       to: '/cart' },
  { label: 'Fit Finder', to: '/fit-finder' },
  { label: 'Team Kit',   to: '/team-kit' },
  { label: 'Blog',       to: '/blog' },
]

const CATEGORY_LINKS = [
  { label: 'Scrum Caps',   to: '/catalogue?categories=scrum-caps' },
  { label: 'Premium Caps', to: '/catalogue?categories=premium-caps' },
  { label: 'Activewear',   to: '/catalogue?categories=activewear' },
  { label: 'New Arrivals', to: '/catalogue?badge=New' },
]

const SUPPORT_LINKS = [
  { label: 'Contact Us',     to: '/contact' },
  { label: 'Returns Policy', to: '/returns-policy' },
  { label: 'Sizing Guide',   to: '/fit-finder' },
  { label: 'Team Orders',    to: '/team-kit' },
]

function LinkList({ links, onReturns }) {
  return (
    <ul className="space-y-3.5">
      {links.map(({ label, to, modal }) => (
        <li key={label}>
          {modal ? (
            <button type="button" onClick={onReturns} className="text-sm text-white/50 hover:text-white transition-colors text-left">
              {label}
            </button>
          ) : (
            <Link to={to} className="text-sm text-white/50 hover:text-white transition-colors">{label}</Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function Footer() {
  const [returnsOpen, setReturnsOpen] = useState(false)

  return (
    <>
      <footer className="bg-navy-dark text-white pt-14 lg:pt-20 pb-6 lg:pb-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          {/* Main grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

            {/* Brand + contact */}
            <div className="col-span-2">
              <Link to="/" aria-label="Collide Sport — Home">
                <CollideLogo size="md" variant="light" layout="stacked" />
              </Link>
              <p className="mt-3 text-sm text-white/45 max-w-xs leading-relaxed">
                South Africa's most trusted rugby scrum cap brand. Quality protection at every level of the game.
              </p>
              <div className="mt-6 space-y-3">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-[#25D366]">
                    <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <span className="text-sm text-white/50 group-hover:text-white transition-colors">WhatsApp us</span>
                </a>
                <a href={`mailto:${STORE_EMAIL}`} className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <span className="text-sm text-white/50 group-hover:text-white transition-colors">{STORE_EMAIL}</span>
                </a>
                <a
                  href={STORE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 group"
                  aria-label={`Open ${STORE_ADDRESS} in Google Maps for directions`}
                >
                  <span className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-white/15 transition-colors">
                    <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span className="text-sm text-white/50 leading-relaxed group-hover:text-white transition-colors">
                    {STORE_ADDRESS}
                    <span className="block text-xs text-blue mt-0.5">Get directions →</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-white/30 mb-5">Quick Links</h4>
              <LinkList links={QUICK_LINKS} />
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-white/30 mb-5">Categories</h4>
              <LinkList links={CATEGORY_LINKS} />
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-white/30 mb-5">Support</h4>
              <LinkList links={SUPPORT_LINKS} onReturns={() => setReturnsOpen(true)} />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/8 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-0 sm:justify-between mb-6">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Accepted Payments</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <PayFastBadge />
                  <VisaBadge />
                  <MastercardBadge />
                  <div className="bg-white/8 h-8 px-3 rounded flex items-center">
                    <span className="text-[10px] font-mono font-semibold text-white/50 uppercase tracking-wide">EFT</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/25 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <p className="text-xs text-white/30">Secure checkout powered by PayFast</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/25">
                <span>© {new Date().getFullYear()} Collide Sport. All rights reserved.</span>
                <span className="hidden sm:inline text-white/15">·</span>
                <span className="font-mono">VAT Reg: {VAT_NUMBER}</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <Link to="/returns-policy" className="text-white/30 hover:text-white transition-colors">Returns Policy</Link>
                <button type="button" onClick={() => setReturnsOpen(true)} className="text-white/30 hover:text-white transition-colors font-medium">
                  Returns Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {returnsOpen && <ReturnsPolicyModal onClose={() => setReturnsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
