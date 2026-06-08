import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Features', to: '/features' },
  { label: 'Players', to: '/players' },
  { label: 'Events', to: '/events' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'News', to: '/news' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-navy/8">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="font-display font-extrabold text-xl tracking-tight text-navy">
          COLLIDE<span className="text-blue">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
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

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/contact" className="text-sm font-medium text-navy/60 hover:text-navy transition-colors">
            Contact
          </Link>
          <Link
            to="/join"
            className="bg-blue text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-light transition-colors"
          >
            Join Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-navy p-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden bg-white border-t border-navy/8 px-6 py-4 flex flex-col gap-4"
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
            <Link
              to="/join"
              onClick={() => setMenuOpen(false)}
              className="bg-blue text-white text-sm font-semibold px-5 py-2 rounded-full text-center"
            >
              Join Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
