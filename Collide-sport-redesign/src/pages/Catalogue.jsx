import { useMemo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, Link } from 'react-router-dom'
import { PRODUCTS, CATEGORIES, COLOURS, PRICE_MIN, PRICE_MAX } from '../data/products'
import ProductCard from '../components/catalogue/ProductCard'
import CartDrawer from '../components/catalogue/CartDrawer'
import QuickView from '../components/catalogue/QuickView'
import AppImage from '../components/ui/AppImage'

const PAGE_SIZE = 12

// ── Lifestyle photos extracted from old collidesport.co.za site ───────────────
const CDN_G = 'https://collidesport.co.za/cdn/shop/files'

// Resting tilt for each card (alternating subtle angles — editorial scatter feel)
const TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5]

const LIFESTYLE_PHOTOS = [
  { src: `${CDN_G}/Warrior_Cap_on_Bosch_1st_Team.jpg?v=1724349538`,
    alt: 'Rondebosch Boys 1st XV wearing Warrior Scrum Caps', tall: true },
  { src: `${CDN_G}/Warrior_Scrum_Cap_on_Rondebosch_Boy.jpg?v=1724349409`,
    alt: 'Player wearing Warrior Scrum Cap on the field', tall: false },
  { src: `${CDN_G}/DSC3288_1__Original.jpg?v=1734264287`,
    alt: 'Rugby player in Collide Sport scrum cap during match', tall: true },
  { src: `${CDN_G}/Warrior_and_Tribal_Cap_2.jpg?v=1724350156`,
    alt: 'Warrior and Tribal scrum caps worn in play', tall: false },
  { src: `${CDN_G}/DSC7768_1.jpg?v=1724140961`,
    alt: 'Match action — Collide Sport scrum cap in play', tall: true },
  { src: `${CDN_G}/DSC7896_1_3c2f3ba4-dec8-4be1-9dba-98a7b048c9e8.png?v=1724143605`,
    alt: 'Rugby player in Collide Sport scrum cap', tall: false },
  { src: `${CDN_G}/29544158-Large-Digital-Photo-Download-3428x2285.jpg?v=1744747280`,
    alt: 'Predator Scrum Cap player in action', tall: true },
  { src: `${CDN_G}/29544063-Large-Digital-Photo-Download-2810x1873.jpg?v=1744747333`,
    alt: 'Rugby player wearing Predator Scrum Cap', tall: false },
]

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const [zoomed, setZoomed]   = useState(false)
  const [pos, setPos]         = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const pointerStart            = useRef(null)
  const photo                   = photos[index]

  // Reset zoom + position when navigating
  useEffect(() => { setZoomed(false); setPos({ x: 0, y: 0 }) }, [index])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')     { if (zoomed) { setZoomed(false); setPos({ x: 0, y: 0 }) } else onClose() }
      if (e.key === 'ArrowLeft'  && !zoomed) onPrev()
      if (e.key === 'ArrowRight' && !zoomed) onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed, onClose, onPrev, onNext])

  function handleImgClick(e) {
    e.stopPropagation()
    if (pointerStart.current?.moved) return   // ignore drags
    if (zoomed) { setZoomed(false); setPos({ x: 0, y: 0 }) } else setZoomed(true)
  }

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y, moved: false }
    setDragging(false)
  }

  function onPointerMove(e) {
    if (!pointerStart.current || !zoomed) return
    const dx = e.clientX - (pointerStart.current.x + pos.x)
    const dy = e.clientY - (pointerStart.current.y + pos.y)
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      pointerStart.current.moved = true
      setDragging(true)
    }
    if (pointerStart.current.moved) {
      setPos({ x: e.clientX - pointerStart.current.x, y: e.clientY - pointerStart.current.y })
    }
  }

  function onPointerUp() {
    pointerStart.current = null
    setDragging(false)
  }

  const lbSrc = `${photo.src}&width=1600`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-md"
      onClick={() => { if (!zoomed) onClose() }}
    >
      {/* Usage hint */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/35 text-[11px] font-mono tracking-widest select-none pointer-events-none">
        {zoomed ? 'DRAG TO PAN  ·  CLICK TO ZOOM OUT' : 'CLICK IMAGE TO ZOOM  ·  ESC TO CLOSE'}
      </p>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        aria-label="Close"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Prev */}
      {index > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-3xl font-light transition-colors"
          aria-label="Previous"
        >‹</motion.button>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: -24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative rounded-2xl overflow-hidden select-none"
          style={{
            maxWidth: '90vw',
            maxHeight: '82vh',
            cursor: zoomed ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
          }}
          onClick={handleImgClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <AppImage
            src={lbSrc}
            alt={photo.alt}
            draggable={false}
            className="block rounded-2xl"
            style={{
              maxWidth:   zoomed ? 'none' : '90vw',
              maxHeight:  zoomed ? 'none' : '82vh',
              width:      zoomed ? 'auto' : '100%',
              height:     zoomed ? 'auto' : '100%',
              objectFit:  'contain',
              transform:  zoomed
                ? `scale(2.2) translate(${pos.x / 2.2}px, ${pos.y / 2.2}px)`
                : 'scale(1)',
              transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
          {/* Zoom icon hint (visible when not zoomed, fades on hover) */}
          {!zoomed && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      {index < photos.length - 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-3xl font-light transition-colors"
          aria-label="Next"
        >›</motion.button>
      )}

      {/* Caption + dot indicators */}
      <div className="absolute bottom-5 left-0 right-0 text-center pointer-events-none">
        <p className="text-white/50 text-sm px-8 leading-snug">{photo.alt}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          {photos.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === index ? 20 : 6, opacity: i === index ? 1 : 0.35 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="h-1.5 rounded-full bg-white"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Action gallery strip ──────────────────────────────────────────────────────
function ActionGallery({ selectedCats }) {
  const show = selectedCats.length === 0 || selectedCats.some(c => c === 'scrum-caps' || c === 'premium-caps')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  if (!show) return null

  return (
    <section className="bg-navy-dark border-t border-white/5">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 pt-8 pb-10">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-blue uppercase mb-1.5">On the field</p>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-white tracking-tight">Worn in real matches</h2>
          </div>
          <p className="text-white/25 text-xs font-mono hidden sm:block">Rondebosch Boys · Club & School Rugby · SA</p>
        </div>

        {/* Photo strip — cards animate in with tilt, hover lifts */}
        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LIFESTYLE_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              /* Entrance: slide in from below + big tilt → unwind to subtle resting tilt */
              initial={{ opacity: 0, y: 80, rotate: TILTS[i] * 3.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: TILTS[i] }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07, type: 'spring', damping: 16, stiffness: 160 }}
              /* Hover: scale up, straighten, lift off */
              whileHover={{
                scale: 1.07,
                rotate: 0,
                y: -12,
                zIndex: 20,
                transition: { type: 'spring', damping: 18, stiffness: 380 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setLightboxIndex(i)}
              className={`relative flex-shrink-0 snap-start rounded-2xl overflow-hidden bg-navy/40 cursor-pointer group shadow-lg ${
                photo.tall ? 'w-[230px] lg:w-[290px]' : 'w-[180px] lg:w-[230px]'
              }`}
              style={{ height: photo.tall ? 350 : 270 }}
            >
              <AppImage
                src={`${photo.src}&width=700`}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay with expand icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
                  </svg>
                </div>
              </div>

              {/* Bottom caption strip */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-navy-dark/90 to-transparent px-3 pb-3 pt-6">
                <p className="text-white text-xs font-medium leading-snug line-clamp-2">{photo.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Swipe hint on mobile */}
        <p className="text-white/20 text-[10px] font-mono text-center mt-3 lg:hidden">swipe to see more · tap to zoom</p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={LIFESTYLE_PHOTOS}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex(i => Math.max(0, i - 1))}
            onNext={() => setLightboxIndex(i => Math.min(LIFESTYLE_PHOTOS.length - 1, i + 1))}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
]

const COLOUR_MAP = {
  Black: '#1a1a1a', White: '#f5f5f5', Blue: '#4770db', Navy: '#0e1b4d',
  Turquoise: '#40E0D0', Green: '#47db71', Gold: '#FFD700', Grey: '#808080',
  Red: '#DC2626', Maroon: '#800000', Camo: '#4a5a3a',
}

const BADGE_FILTERS = ['All', 'New', 'Premium', 'Low Stock']

export default function Catalogue() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('collide_recent') || '[]')
      setRecentlyViewed(stored)
    } catch { /* ignore */ }
  }, [])

  function trackView(product) {
    setQuickViewProduct(product)
    try {
      const stored = JSON.parse(localStorage.getItem('collide_recent') || '[]')
      const filtered = stored.filter(p => p.id !== product.id)
      const next = [product, ...filtered].slice(0, 10)
      localStorage.setItem('collide_recent', JSON.stringify(next))
      setRecentlyViewed(next)
    } catch { /* ignore */ }
  }

  const selectedCats    = useMemo(() => params.get('categories')?.split(',').filter(Boolean) ?? [], [params])
  const selectedColours = useMemo(() => params.get('colours')?.split(',').filter(Boolean) ?? [], [params])
  const badgeFilter     = params.get('badge') || 'All'
  const minPrice        = Number(params.get('minPrice') || PRICE_MIN)
  const maxPrice        = Number(params.get('maxPrice') || PRICE_MAX)
  const availability    = params.get('availability') || 'all'
  const sort            = params.get('sort') || 'newest'
  const page            = Math.max(1, Number(params.get('page') || 1))

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    const defaults = { sort: 'newest', availability: 'all', page: '1', badge: 'All', minPrice: String(PRICE_MIN), maxPrice: String(PRICE_MAX) }
    if (!String(value) || String(value) === (defaults[key] ?? '')) next.delete(key)
    else next.set(key, String(value))
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: true })
  }

  function toggleCategory(cat) {
    const next = selectedCats.includes(cat) ? selectedCats.filter(c => c !== cat) : [...selectedCats, cat]
    const p = new URLSearchParams(params)
    next.length ? p.set('categories', next.join(',')) : p.delete('categories')
    p.delete('page')
    setParams(p, { replace: true })
  }

  function toggleColour(col) {
    const next = selectedColours.includes(col) ? selectedColours.filter(c => c !== col) : [...selectedColours, col]
    const p = new URLSearchParams(params)
    next.length ? p.set('colours', next.join(',')) : p.delete('colours')
    p.delete('page')
    setParams(p, { replace: true })
  }

  function clearFilters() {
    const next = new URLSearchParams(params)
    ;['categories', 'colours', 'availability', 'minPrice', 'maxPrice', 'page', 'badge'].forEach(k => next.delete(k))
    setParams(next, { replace: true })
  }

  const hasActiveFilters = selectedCats.length > 0 || selectedColours.length > 0 || availability === 'in-stock' || badgeFilter !== 'All' || minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (selectedCats.length) list = list.filter(p => selectedCats.includes(p.category))
    if (selectedColours.length) list = list.filter(p => p.colours?.some(c => selectedColours.includes(c)))
    if (badgeFilter !== 'All') list = list.filter(p => p.badge === badgeFilter || (badgeFilter === 'Low Stock' && p.stock <= 5 && p.stock > 0))
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice)
    if (availability === 'in-stock') list = list.filter(p => p.stock > 0)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    return list
  }, [selectedCats, selectedColours, badgeFilter, minPrice, maxPrice, availability, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage   = Math.min(page, Math.max(1, totalPages))
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const activeFilterCount = selectedCats.length + selectedColours.length + (availability === 'in-stock' ? 1 : 0) + (badgeFilter !== 'All' ? 1 : 0)

  return (
    <div className="min-h-screen bg-lavender pt-14">
      <CartDrawer />
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      {/* Header */}
      <div className="bg-navy-dark py-12 px-6 lg:px-12 grid-bg">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-2">Shop</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight leading-none">Catalogue</h1>
          <p className="text-white/40 mt-3 text-sm font-mono">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <ActionGallery selectedCats={selectedCats} />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-8">
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-20">
            <FilterPanel
              selectedCats={selectedCats} toggleCategory={toggleCategory}
              selectedColours={selectedColours} toggleColour={toggleColour}
              badgeFilter={badgeFilter} setParam={setParam}
              minPrice={minPrice} maxPrice={maxPrice}
              availability={availability}
              hasActiveFilters={hasActiveFilters} clearFilters={clearFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button
                onClick={() => setFiltersOpen(o => !o)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold text-navy border border-navy/20 bg-white px-4 py-2 rounded-full hover:border-blue transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round"/></svg>
                Filters
                {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
              </button>

              {/* Badge quick filters */}
              <div className="hidden sm:flex items-center gap-2">
                {BADGE_FILTERS.map(b => (
                  <button
                    key={b}
                    onClick={() => setParam('badge', b)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
                      badgeFilter === b
                        ? 'bg-blue text-white border-blue'
                        : 'border-navy/15 text-navy/50 hover:border-blue hover:text-blue bg-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs text-navy/40 font-mono hidden sm:block">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                <select
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}
                  className="text-sm font-medium text-navy bg-white border border-navy/10 rounded-full px-4 py-2 outline-none cursor-pointer hover:border-blue transition-colors"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Mobile filters */}
            {filtersOpen && (
              <div className="lg:hidden bg-white rounded-2xl p-5 mb-6 border border-navy/8 shadow-sm">
                <FilterPanel
                  selectedCats={selectedCats} toggleCategory={toggleCategory}
                  selectedColours={selectedColours} toggleColour={toggleColour}
                  badgeFilter={badgeFilter} setParam={setParam}
                  minPrice={minPrice} maxPrice={maxPrice}
                  availability={availability}
                  hasActiveFilters={hasActiveFilters} clearFilters={clearFilters}
                />
              </div>
            )}

            {/* Active chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCats.map(cat => (
                  <button key={cat} onClick={() => toggleCategory(cat)} className="flex items-center gap-1.5 text-xs font-medium bg-blue/10 text-blue px-3 py-1 rounded-full hover:bg-blue/20 transition-colors capitalize">{cat.replace(/-/g, ' ')} ✕</button>
                ))}
                {selectedColours.map(col => (
                  <button key={col} onClick={() => toggleColour(col)} className="flex items-center gap-1.5 text-xs font-medium bg-blue/10 text-blue px-3 py-1 rounded-full hover:bg-blue/20 transition-colors">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLOUR_MAP[col] }} /> {col} ✕
                  </button>
                ))}
                {badgeFilter !== 'All' && <button onClick={() => setParam('badge', 'All')} className="flex items-center gap-1.5 text-xs font-medium bg-green/15 text-green-dim px-3 py-1 rounded-full hover:bg-green/25 transition-colors">{badgeFilter} ✕</button>}
                {availability === 'in-stock' && <button onClick={() => setParam('availability', 'all')} className="flex items-center gap-1.5 text-xs font-medium bg-green/15 text-green-dim px-3 py-1 rounded-full hover:bg-green/25 transition-colors">In stock only ✕</button>}
                <button onClick={clearFilters} className="text-xs text-navy/40 hover:text-navy/60 px-2 py-1 transition-colors">Clear all</button>
              </div>
            )}

            {/* Grid */}
            {paginated.length === 0 ? (
              <div className="text-center py-24 text-navy/40">
                <p className="font-display font-bold text-lg text-navy">No products found</p>
                <p className="text-sm mt-1 text-navy/50">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="mt-5 text-blue text-sm font-semibold hover:text-blue-light transition-colors">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    salePrice={product.salePrice}
                    inStock={product.stock > 0}
                    slug={String(product.id)}
                    badge={product.badge}
                    colours={product.colours}
                    category={product.category}
                    index={i}
                    onQuickView={() => trackView(product)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <PaginationBtn onClick={() => setParam('page', safePage - 1)} disabled={safePage === 1} label="‹" />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <PaginationBtn key={n} onClick={() => setParam('page', n)} active={n === safePage} label={String(n)} />
                ))}
                <PaginationBtn onClick={() => setParam('page', safePage + 1)} disabled={safePage === totalPages} label="›" />
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16 mb-8">
            <h2 className="font-display font-bold text-xl text-navy mb-6">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x">
              {recentlyViewed.map(p => (
                <Link key={p.id} to="/catalogue" onClick={() => trackView(p)} className="flex-shrink-0 w-36 snap-start">
                  <div className="aspect-square rounded-xl overflow-hidden bg-lavender mb-2">
                    <AppImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-semibold text-navy truncate">{p.name}</p>
                  <p className="text-xs text-blue font-bold">R {p.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function PaginationBtn({ onClick, disabled, active, label }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${active ? 'bg-blue text-white' : disabled ? 'border border-navy/10 text-navy/25 cursor-not-allowed' : 'border border-navy/20 text-navy/60 hover:border-blue hover:text-blue bg-white'}`}
    >{label}</button>
  )
}

function FilterPanel({ selectedCats, toggleCategory, selectedColours, toggleColour, badgeFilter, setParam, minPrice, maxPrice, availability, hasActiveFilters, clearFilters }) {
  return (
    <div className="flex flex-col gap-7">
      {/* Categories */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Category</h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map(cat => {
            const checked = selectedCats.includes(cat.value)
            return (
              <div key={cat.value} onClick={() => toggleCategory(cat.value)} className="flex items-center gap-3 cursor-pointer group select-none">
                <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${checked ? 'bg-blue border-blue' : 'border-navy/20 group-hover:border-blue/60'}`}>
                  {checked && <span className="w-1.5 h-1.5 rounded-sm bg-white block" />}
                </span>
                <span className="text-sm font-medium text-navy/65 group-hover:text-navy transition-colors">{cat.label}</span>
                <span className="text-[10px] text-navy/30 ml-auto">{PRODUCTS.filter(p => p.category === cat.value).length}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Colours */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Colour</h3>
        <div className="flex flex-wrap gap-2">
          {COLOURS.map(col => {
            const active = selectedColours.includes(col)
            return (
              <button
                key={col}
                onClick={() => toggleColour(col)}
                title={col}
                className={`w-7 h-7 rounded-full border-2 transition-all ${active ? 'border-blue scale-110 ring-2 ring-blue/30' : col === 'White' ? 'border-navy/20' : 'border-transparent hover:scale-105'}`}
                style={{ background: COLOUR_MAP[col] || '#ccc' }}
              />
            )
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Price (ZAR)</h3>
        <div className="flex gap-2 items-center">
          <input type="number" value={minPrice} min={PRICE_MIN} max={maxPrice} onChange={e => setParam('minPrice', e.target.value)} className="w-full text-sm text-navy border border-navy/10 rounded-lg px-3 py-1.5 outline-none focus:border-blue transition-colors bg-white" placeholder="Min" />
          <span className="text-navy/25 text-xs flex-shrink-0">–</span>
          <input type="number" value={maxPrice} min={minPrice} max={PRICE_MAX} onChange={e => setParam('maxPrice', e.target.value)} className="w-full text-sm text-navy border border-navy/10 rounded-lg px-3 py-1.5 outline-none focus:border-blue transition-colors bg-white" placeholder="Max" />
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Availability</h3>
        <div onClick={() => setParam('availability', availability === 'in-stock' ? 'all' : 'in-stock')} className="flex items-center gap-3 cursor-pointer select-none group">
          <button className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${availability === 'in-stock' ? 'bg-blue' : 'bg-navy/15 group-hover:bg-navy/25'}`} role="switch">
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${availability === 'in-stock' ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm font-medium text-navy/65 group-hover:text-navy transition-colors">In stock only</span>
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-xs text-blue hover:text-blue-light transition-colors font-semibold text-left">Clear all filters</button>
      )}
    </div>
  )
}
