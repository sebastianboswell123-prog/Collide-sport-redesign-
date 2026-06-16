import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartIcon } from './NavIcons'

export default function NavMobileMenu({ menuOpen, closeMenu, wishlistCount, navLinks, moreLinks }) {
  if (!menuOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="lg:hidden bg-white border-t border-navy/8 pb-4"
    >
      {/* Primary links */}
      <div className="px-6 pt-3 space-y-0.5">
        {navLinks.map(({ label, to }) => (
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

      {/* More links grid */}
      <div className="px-6 pt-3">
        <p className="text-[10px] font-mono tracking-widest text-navy/30 uppercase mb-2">More</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {moreLinks.map(({ label, to }) => (
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

      {/* Wishlist + Shop CTA */}
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
  )
}
