import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS, CATEGORIES, PRICE_MIN, PRICE_MAX } from '../data/products'
import ProductCard from '../components/catalogue/ProductCard'
import CartDrawer from '../components/catalogue/CartDrawer'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export default function Catalogue() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Read URL params
  const selectedCats = useMemo(
    () => params.get('categories')?.split(',').filter(Boolean) ?? [],
    [params]
  )
  const minPrice    = Number(params.get('minPrice') || PRICE_MIN)
  const maxPrice    = Number(params.get('maxPrice') || PRICE_MAX)
  const availability = params.get('availability') || 'all'
  const sort         = params.get('sort') || 'newest'
  const page         = Math.max(1, Number(params.get('page') || 1))

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    const defaults = {
      sort: 'newest', availability: 'all', page: '1',
      minPrice: String(PRICE_MIN), maxPrice: String(PRICE_MAX),
    }
    if (!String(value) || String(value) === (defaults[key] ?? '')) {
      next.delete(key)
    } else {
      next.set(key, String(value))
    }
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: true })
  }

  function toggleCategory(cat) {
    const next = selectedCats.includes(cat)
      ? selectedCats.filter(c => c !== cat)
      : [...selectedCats, cat]
    const val = next.join(',')
    const p = new URLSearchParams(params)
    val ? p.set('categories', val) : p.delete('categories')
    p.delete('page')
    setParams(p, { replace: true })
  }

  function clearFilters() {
    const next = new URLSearchParams(params)
    next.delete('categories')
    next.delete('availability')
    next.delete('minPrice')
    next.delete('maxPrice')
    next.delete('page')
    setParams(next, { replace: true })
  }

  const hasActiveFilters = selectedCats.length > 0 || availability === 'in-stock' ||
    minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (selectedCats.length)      list = list.filter(p => selectedCats.includes(p.category))
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice)
    if (availability === 'in-stock') list = list.filter(p => p.stock > 0)
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return list
  }, [selectedCats, minPrice, maxPrice, availability, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage   = Math.min(page, Math.max(1, totalPages))
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const activeFilterCount = selectedCats.length + (availability === 'in-stock' ? 1 : 0)

  return (
    <div className="min-h-screen bg-lavender pt-14">
      <CartDrawer />

      {/* Page header */}
      <div className="bg-navy-dark py-12 px-6 lg:px-12 grid-bg">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-2">Shop</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight leading-none">
            Catalogue
          </h1>
          <p className="text-white/40 mt-3 text-sm font-mono">{filtered.length} products</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-8">
        <div className="flex gap-8 items-start">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-20">
            <FilterPanel
              selectedCats={selectedCats}
              toggleCategory={toggleCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setParam={setParam}
              availability={availability}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {/* Mobile filter button */}
              <button
                onClick={() => setFiltersOpen(o => !o)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold text-navy border border-navy/20 bg-white px-4 py-2 rounded-full hover:border-blue transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round"/>
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs text-navy/40 font-mono hidden sm:block">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
                <select
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}
                  className="text-sm font-medium text-navy bg-white border border-navy/10 rounded-full px-4 py-2 outline-none cursor-pointer hover:border-blue transition-colors"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile filter panel */}
            {filtersOpen && (
              <div className="lg:hidden bg-white rounded-2xl p-5 mb-6 border border-navy/8 shadow-sm">
                <FilterPanel
                  selectedCats={selectedCats}
                  toggleCategory={toggleCategory}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setParam={setParam}
                  availability={availability}
                  hasActiveFilters={hasActiveFilters}
                  clearFilters={clearFilters}
                />
              </div>
            )}

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCats.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-blue/10 text-blue px-3 py-1 rounded-full hover:bg-blue/20 transition-colors capitalize"
                  >
                    {cat} ✕
                  </button>
                ))}
                {availability === 'in-stock' && (
                  <button
                    onClick={() => setParam('availability', 'all')}
                    className="flex items-center gap-1.5 text-xs font-medium bg-green/15 text-green-dim px-3 py-1 rounded-full hover:bg-green/25 transition-colors"
                  >
                    In stock only ✕
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-navy/40 hover:text-navy/60 px-2 py-1 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Grid */}
            {paginated.length === 0 ? (
              <div className="text-center py-24 text-navy/40">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-display font-bold text-lg text-navy">No products found</p>
                <p className="text-sm mt-1 text-navy/50">Try adjusting your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-5 text-blue text-sm font-semibold hover:text-blue-light transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginated.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <PaginationBtn
                  onClick={() => setParam('page', safePage - 1)}
                  disabled={safePage === 1}
                  label="‹"
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <PaginationBtn
                    key={n}
                    onClick={() => setParam('page', n)}
                    active={n === safePage}
                    label={String(n)}
                  />
                ))}
                <PaginationBtn
                  onClick={() => setParam('page', safePage + 1)}
                  disabled={safePage === totalPages}
                  label="›"
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

function PaginationBtn({ onClick, disabled, active, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors
        ${active
          ? 'bg-blue text-white'
          : disabled
          ? 'border border-navy/10 text-navy/25 cursor-not-allowed'
          : 'border border-navy/20 text-navy/60 hover:border-blue hover:text-blue bg-white'
        }`}
    >
      {label}
    </button>
  )
}

function FilterPanel({ selectedCats, toggleCategory, minPrice, maxPrice, setParam, availability, hasActiveFilters, clearFilters }) {
  return (
    <div className="flex flex-col gap-7">

      {/* Categories */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Category</h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map(cat => {
            const checked = selectedCats.includes(cat.value)
            return (
              <div
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors
                  ${checked ? 'bg-blue border-blue' : 'border-navy/20 group-hover:border-blue/60'}`}
                >
                  {checked && <span className="w-1.5 h-1.5 rounded-sm bg-white block" />}
                </span>
                <span className="text-sm font-medium text-navy/65 group-hover:text-navy transition-colors">
                  {cat.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Price (ZAR)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={minPrice}
            min={PRICE_MIN}
            max={maxPrice}
            onChange={e => setParam('minPrice', e.target.value)}
            className="w-full text-sm text-navy border border-navy/10 rounded-lg px-3 py-1.5 outline-none focus:border-blue transition-colors bg-white"
            placeholder="Min"
          />
          <span className="text-navy/25 text-xs flex-shrink-0">–</span>
          <input
            type="number"
            value={maxPrice}
            min={minPrice}
            max={PRICE_MAX}
            onChange={e => setParam('maxPrice', e.target.value)}
            className="w-full text-sm text-navy border border-navy/10 rounded-lg px-3 py-1.5 outline-none focus:border-blue transition-colors bg-white"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-3">Availability</h3>
        <div
          onClick={() => setParam('availability', availability === 'in-stock' ? 'all' : 'in-stock')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <button
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0
              ${availability === 'in-stock' ? 'bg-blue' : 'bg-navy/15 group-hover:bg-navy/25'}`}
            aria-checked={availability === 'in-stock'}
            role="switch"
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
              ${availability === 'in-stock' ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </button>
          <span className="text-sm font-medium text-navy/65 group-hover:text-navy transition-colors">
            In stock only
          </span>
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-blue hover:text-blue-light transition-colors font-semibold text-left"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
