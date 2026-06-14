import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import SearchOverlay from '../SearchOverlay'
import CollideLogo from '../CollideLogo'

const NAV_LINKS = [
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Fit Finder', to: '/fit-finder' },
  { label: 'Team Kit',  to: '/team-kit' },
  { label: 'Compare',   to: '/compare' },
  { label: 'The Scrum', to: '/blog' },
  { label: 'Ambassadors', to: '/ambassadors' },
  { label: 'About',     to: '/about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems, setOpen: openCart } = useCart()

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-navy/8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" aria-label="Collide Sport — Home">
            <CollideLogo size="sm" variant="dark" layout="inline" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-blue' : 'text-navy/60 hover:text-navy'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/contact" className="text-sm font-medium text-navy/60 hover:text-navy transition-colors">
              Contact
            </Link>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-navy/50 hover:text-navy transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => openCart(true)}
              className="relative p-2 text-navy/50 hover:text-navy transition-colors"
              aria-label={`Cart (${totalItems} items)`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            <Link
              to="/catalogue"
              className="bg-blue text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-light transition-colors"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile: search + cart + menu */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-navy/50 hover:text-navy transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <button
              onClick={() => openCart(true)}
              className="relative p-2 text-navy/50 hover:text-navy transition-colors"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            <button
              className="text-navy p-2"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden bg-white border-t border-navy/8 px-6 py-4 flex flex-col gap-3"
            >
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive ? 'text-blue' : 'text-navy/60'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue' : 'text-navy/60'}`}>Contact</NavLink>
              <Link
                to="/catalogue"
                onClick={() => setMenuOpen(false)}
                className="bg-blue text-white text-sm font-semibold px-5 py-2 rounded-full text-center mt-2"
              >
                Shop Now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
