import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useLogoClick } from '../EasterEgg'
import CurrencySelector from '../CurrencySelector'
import useWishlist from '../../hooks/useWishlist'
import { SearchIcon, HeartIcon, CartIcon, CloseIcon, MenuIcon } from './NavIcons'
import AppImage from '../ui/AppImage'
import { DesktopSearchBar, MobileSearchBar } from './NavSearch'
import NavMobileMenu from './NavMobileMenu'

const NAV_LINKS = [
  { label: 'Shop',    to: '/catalogue' },
  { label: 'About',   to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const MOBILE_MORE = [
  { label: 'Fit Finder',     to: '/fit-finder' },
  { label: 'Team Kit',       to: '/team-kit' },
  { label: 'Compare',        to: '/compare' },
  { label: 'The Scrum',      to: '/blog' },
  { label: 'Ambassadors',    to: '/ambassadors' },
  { label: 'Lookbook',       to: '/lookbook' },
  { label: 'Bundles',        to: '/bundles' },
  { label: 'Sustainability', to: '/sustainability' },
]

export default function Navbar() {
  const { totalItems }  = useCart()
  const wishlistCount   = useWishlist()
  const logoClick       = useLogoClick()
  const navigate        = useNavigate()

  const [menuOpen,   setMenuOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query,      setQuery]      = useState('')

  useEffect(() => {
    if (!searchOpen) setQuery('')
  }, [searchOpen])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleSelect(product) {
    setSearchOpen(false)
    navigate(`/catalogue/${product.id}`)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-navy-dark border-b border-white/8">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 h-14 flex items-center gap-4">

          {/* Logo */}
          <Link to="/" onClick={logoClick} className="flex-shrink-0 z-10">
            <AppImage
              src="https://collidesport.co.za/cdn/shop/files/COLLIDE_TM_SPORT.png?v=1696518150&width=300"
              alt="Collide Sport"
              width={110}
              height={40}
              className="h-7 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Desktop centre: nav links ↔ search bar */}
          <AnimatePresence mode="wait">
            {!searchOpen ? (
              <motion.nav key="nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="hidden lg:flex items-center gap-8 flex-1 justify-center">
                {NAV_LINKS.map(({ label, to }) => (
                  <NavLink key={to} to={to}
                    className={({ isActive }) => `text-sm font-semibold uppercase tracking-wider transition-colors ${isActive ? 'text-blue' : 'text-white/60 hover:text-white'}`}>
                    {label}
                  </NavLink>
                ))}
              </motion.nav>
            ) : (
              <DesktopSearchBar query={query} setQuery={setQuery} onSelect={handleSelect} />
            )}
          </AnimatePresence>

          {/* Right icons — desktop */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0 ml-auto">
            <CurrencySelector />

            <button onClick={() => setSearchOpen(o => !o)} aria-label={searchOpen ? 'Close search' : 'Open search'}
              className={`p-2 rounded-lg transition-colors ${searchOpen ? 'text-blue bg-blue/20' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
              {searchOpen ? <CloseIcon className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
            </button>

            <Link to="/wishlist" aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <HeartIcon className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
              className="relative p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <CartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <Link to="/catalogue" className="ml-2 bg-blue text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-none hover:bg-blue-light transition-colors">
              Shop Now
            </Link>
          </div>

          {/* Right icons — mobile */}
          <div className="lg:hidden flex items-center gap-0.5 ml-auto flex-shrink-0">
            <button onClick={() => { setSearchOpen(o => !o); setMenuOpen(false) }} aria-label="Search"
              className={`p-2 rounded-lg transition-colors ${searchOpen ? 'text-blue' : 'text-white/50 hover:text-white'}`}>
              {searchOpen ? <CloseIcon className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
            </button>

            <Link to="/cart" aria-label={`Cart — ${totalItems} items`}
              className="relative p-2 text-white/50 hover:text-white rounded-lg transition-colors">
              <CartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <button onClick={() => { setMenuOpen(o => !o); setSearchOpen(false) }} aria-label="Menu"
              className="p-2 text-white/60 hover:text-white rounded-lg transition-colors">
              {menuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {searchOpen && <MobileSearchBar query={query} setQuery={setQuery} onSelect={handleSelect} />}
        </AnimatePresence>

        {/* Mobile hamburger menu */}
        <AnimatePresence>
          {menuOpen && (
            <NavMobileMenu
              menuOpen={menuOpen}
              closeMenu={() => setMenuOpen(false)}
              wishlistCount={wishlistCount}
              navLinks={NAV_LINKS}
              moreLinks={MOBILE_MORE}
            />
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop to close search on mobile */}
      {searchOpen && query && (
        <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
      )}
    </>
  )
}
