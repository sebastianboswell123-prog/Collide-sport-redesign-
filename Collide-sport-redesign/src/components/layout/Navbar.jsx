import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useLogoClick } from '../EasterEgg'
import CurrencySelector from '../CurrencySelector'
import { PRODUCTS } from '../../data/products'

// ── Primary nav (desktop centre + mobile menu) ────────────────────────────────
const NAV_LINKS = [
  { label: 'Shop',    to: '/catalogue' },
  { label: 'About',   to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// ── Secondary links shown only in the mobile hamburger drawer ─────────────────
const MOBILE_MORE = [
  { label: 'Fit Finder',  to: '/fit-finder' },
  { label: 'Team Kit',    to: '/team-kit' },
  { label: 'Compare',     to: '/compare' },
  { label: 'The Scrum',   to: '/blog' },
  { label: 'Ambassadors', to: '/ambassadors' },
  { label: 'Lookbook',    to: '/lookbook' },
  { label: 'Bundles',     to: '/bundles' },
  { label: 'Sustainability', to: '/sustainability' },
]

// ── Wishlist (localStorage, real-time via storage event) ──────────────────────
function useWishlist() {
  const [count, setCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collide_wishlist') || '[]').length } catch { return 0 }
  })
  useEffect(() => {
    function sync() {
      try { setCount(JSON.parse(localStorage.getItem('collide_wishlist') || '[]').length) } catch { setCount(0) }
    }
    window.addEventListener('storage', sync)
    // Poll for same-tab changes
    const t = setInterval(sync, 800)
    return () => { window.removeEventListener('storage', sync); clearInterval(t) }
  }, [])
  return count
}

// ── Inline search results ──────────────────────────────────────────────────────
function SearchResults({ query, onSelect }) {
  if (!query.trim()) return null
  const results = PRODUCTS
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6)
  if (!results.length) return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-navy/10 rounded-2xl shadow-xl overflow-hidden z-50 px-4 py-3">
      <p className="text-sm text-navy/40">No products found for "{query}"</p>
    </div>
  )
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-navy/10 rounded-2xl shadow-xl overflow-hidden z-50"
    >
      {results.map(p => (
        <button
          key={p.id}
          onMouseDown={() => onSelect(p)}
          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-lavender/60 transition-colors text-left"
        >
          <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-lavender" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-navy truncate">{p.name}</p>
            <p className="text-xs text-navy/40">R {p.price}</p>
          </div>
          <span className="text-xs text-blue flex-shrink-0">View →</span>
        </button>
      ))}
    </motion.div>
  )
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
function SearchIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
}
function HeartIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
}
function CartIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
}
function CloseIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function MenuIcon({ className }) {
  return <svg className={className} viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="0" y1="1" x2="20" y2="1"/><line x1="0" y1="7" x2="20" y2="7"/><line x1="0" y1="13" x2="20" y2="13"/></svg>
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const { totalItems } = useCart()
  const wishlistCount  = useWishlist()
  const logoClick      = useLogoClick()
  const navigate       = useNavigate()

  const [menuOpen,   setMenuOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query,      setQuery]      = useState('')
  const searchInputRef = useRef(null)

  // Auto-focus search input when it opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [searchOpen])

  // Close search on ESC
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleSelect(product) {
    setSearchOpen(false)
    navigate(`/catalogue/${product.id}`)
  }

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-navy/8">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 h-14 flex items-center gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={logoClick}
            className="font-display font-extrabold text-xl tracking-tight text-navy flex-shrink-0 z-10"
          >
            COLLIDE<span className="text-blue">.</span>
          </Link>

          {/* ── Desktop centre nav (hidden when search open) ── */}
          <AnimatePresence mode="wait">
            {!searchOpen ? (
              <motion.nav
                key="nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:flex items-center gap-8 flex-1 justify-center"
              >
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
              </motion.nav>
            ) : (
              /* ── Inline search bar (desktop) ── */
              <motion.div
                key="search"
                initial={{ opacity: 0, scaleX: 0.95 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.95 }}
                transition={{ duration: 0.18 }}
                className="hidden lg:flex flex-1 relative mx-4"
                style={{ transformOrigin: 'left center' }}
              >
                <div className="flex items-center w-full bg-lavender/80 border border-navy/15 rounded-full px-4 h-9 gap-2">
                  <SearchIcon className="w-4 h-4 text-navy/40 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/30"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="text-navy/30 hover:text-navy/60 transition-colors flex-shrink-0">
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Inline dropdown results */}
                <AnimatePresence>
                  {query && <SearchResults query={query} onSelect={handleSelect} />}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Right icon group (desktop) ── */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0 ml-auto">
            <CurrencySelector />

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(o => !o)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              className={`p-2 rounded-lg transition-colors ${searchOpen ? 'text-blue bg-blue/8' : 'text-navy/50 hover:text-navy hover:bg-lavender/60'}`}
            >
              {searchOpen
                ? <CloseIcon className="w-5 h-5" />
                : <SearchIcon className="w-5 h-5" />
              }
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative p-2 text-navy/50 hover:text-navy hover:bg-lavender/60 rounded-lg transition-colors"
            >
              <HeartIcon className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart — always links to /cart */}
            <Link
              to="/cart"
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
              className="relative p-2 text-navy/50 hover:text-navy hover:bg-lavender/60 rounded-lg transition-colors"
            >
              <CartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/catalogue"
              className="ml-1 bg-blue text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-light transition-colors"
            >
              Shop Now
            </Link>
          </div>

          {/* ── Mobile right: search + cart (always visible) + hamburger ── */}
          <div className="lg:hidden flex items-center gap-0.5 ml-auto flex-shrink-0">

            {/* Mobile inline search toggle */}
            <button
              onClick={() => { setSearchOpen(o => !o); setMenuOpen(false) }}
              aria-label="Search"
              className={`p-2 rounded-lg transition-colors ${searchOpen ? 'text-blue' : 'text-navy/50 hover:text-navy'}`}
            >
              {searchOpen
                ? <CloseIcon className="w-5 h-5" />
                : <SearchIcon className="w-5 h-5" />
              }
            </button>

            {/* Cart — ALWAYS visible on mobile, never behind hamburger */}
            <Link
              to="/cart"
              aria-label={`Cart — ${totalItems} items`}
              className="relative p-2 text-navy/50 hover:text-navy rounded-lg transition-colors"
            >
              <CartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => { setMenuOpen(o => !o); setSearchOpen(false) }}
              aria-label="Menu"
              className="p-2 text-navy/60 hover:text-navy rounded-lg transition-colors"
            >
              {menuOpen
                ? <CloseIcon className="w-5 h-5" />
                : <MenuIcon className="w-5 h-5" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile inline search bar (below header row) ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-navy/8 bg-white"
            >
              <div className="px-4 py-3 relative">
                <div className="flex items-center gap-2 bg-lavender/70 border border-navy/10 rounded-full px-4 h-10">
                  <SearchIcon className="w-4 h-4 text-navy/40 flex-shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search caps, activewear…"
                    className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/30"
                    autoFocus
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="text-navy/30 hover:text-navy/60 transition-colors">
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {query && (
                    <div className="mt-1">
                      <SearchResults query={query} onSelect={handleSelect} />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile hamburger menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="lg:hidden bg-white border-t border-navy/8 pb-4"
            >
              {/* Primary links */}
              <div className="px-6 pt-3 space-y-0.5">
                {NAV_LINKS.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block py-2.5 text-base font-semibold border-b border-navy/5 transition-colors ${isActive ? 'text-blue' : 'text-navy/70'}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              {/* More links */}
              <div className="px-6 pt-3">
                <p className="text-[10px] font-mono tracking-widest text-navy/30 uppercase mb-2">More</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {MOBILE_MORE.map(({ label, to }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `py-1.5 text-sm transition-colors ${isActive ? 'text-blue font-medium' : 'text-navy/50'}`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Wishlist + CTA */}
              <div className="px-6 pt-4 flex flex-col gap-2">
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-sm text-navy/60 font-medium py-1"
                >
                  <HeartIcon className="w-4 h-4" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/catalogue"
                  onClick={closeMenu}
                  className="bg-blue text-white text-sm font-semibold px-5 py-3 rounded-full text-center mt-1"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop to close search dropdown on mobile when clicking outside */}
      {searchOpen && query && (
        <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
      )}
    </>
  )
}
