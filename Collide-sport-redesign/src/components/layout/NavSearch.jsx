import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '../../data/products'
import AppImage from '../ui/AppImage'
import { SearchIcon, CloseIcon } from './NavIcons'

// ── Inline search results dropdown ────────────────────────────────────────────
function SearchResults({ query, onSelect }) {
  if (!query.trim()) return null
  const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)

  if (!results.length) return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-navy/10 rounded-2xl shadow-xl z-50 px-4 py-3">
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
          <AppImage src={p.image} alt={p.name} width={36} height={36} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-lavender" />
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

// ── Desktop inline search bar ──────────────────────────────────────────────────
export function DesktopSearchBar({ query, setQuery, onSelect }) {
  const inputRef = useRef(null)
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50) }, [])

  return (
    <motion.div
      key="search"
      initial={{ opacity: 0, scaleX: 0.95 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0.95 }}
      transition={{ duration: 0.18 }}
      className="hidden lg:flex flex-1 relative mx-4 origin-left"
    >
      <div className="flex items-center w-full bg-white/10 border border-white/20 rounded-full px-4 h-9 gap-2">
        <SearchIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/30"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-navy/30 hover:text-navy/60 transition-colors flex-shrink-0">
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {query && <SearchResults query={query} onSelect={onSelect} />}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Mobile inline search bar (renders below the header row) ───────────────────
export function MobileSearchBar({ query, setQuery, onSelect }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="lg:hidden overflow-hidden border-t border-white/10 bg-navy-dark"
    >
      <div className="px-4 py-3 relative">
        <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 h-10">
          <SearchIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search caps, activewear…"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/30"
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
              <SearchResults query={query} onSelect={onSelect} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
