import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, CATEGORIES } from '../data/products'
import { useCart } from '../context/CartContext'

const COLOUR_MAP = {
  Black: '#1a1a1a', White: '#f5f5f5', Blue: '#4770db', Navy: '#0e1b4d',
  Turquoise: '#40E0D0', Green: '#47db71', Gold: '#FFD700', Grey: '#808080',
  Red: '#DC2626', Maroon: '#800000', Camo: '#4a5a3a',
}

const MAX_COMPARE = 3

function getCategoryLabel(slug) {
  return CATEGORIES.find(c => c.value === slug)?.label || slug
}

function StockBadge({ stock }) {
  if (stock <= 0) return <span style={{ color: '#DC2626', fontWeight: 600 }}>Out of Stock</span>
  if (stock <= 5) return <span style={{ color: '#D97706', fontWeight: 600 }}>Low Stock ({stock})</span>
  return <span style={{ color: '#16A34A', fontWeight: 600 }}>In Stock ({stock})</span>
}

function ProductBadge({ badge }) {
  if (!badge) return <span style={{ color: '#808080' }}>--</span>
  const bgMap = {
    New: '#47db71',
    Premium: '#FFD700',
    'Low Stock': '#D97706',
  }
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: bgMap[badge] || '#4770db',
        color: badge === 'Premium' ? '#0e1b4d' : '#fff',
      }}
    >
      {badge}
    </span>
  )
}

function ColourSwatches({ colours }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
      {colours.map(c => (
        <span
          key={c}
          title={c}
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: COLOUR_MAP[c] || '#ccc',
            border: c === 'White' ? '2px solid #ddd' : '2px solid transparent',
            display: 'inline-block',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Product selector dropdown ─────────────────────────────────────── */
function ProductSelector({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selectedIds = selected.map(p => p.id)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return PRODUCTS.filter(
      p => !selectedIds.includes(p.id) && p.name.toLowerCase().includes(q)
    )
  }, [search, selectedIds])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '12px 18px',
          border: '2px solid #dde0ea',
          borderRadius: 12,
          background: '#fff',
          cursor: 'pointer',
          fontSize: 15,
          fontFamily: 'inherit',
          color: '#0e1b4d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'border-color 0.2s',
          ...(open ? { borderColor: '#4770db' } : {}),
        }}
      >
        <span>
          {selected.length >= MAX_COMPARE
            ? `Maximum ${MAX_COMPARE} products selected`
            : 'Select a product to compare...'}
        </span>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#0e1b4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && selected.length < MAX_COMPARE && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            background: '#fff',
            border: '2px solid #dde0ea',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            maxHeight: 320,
            overflowY: 'auto',
            boxShadow: '0 12px 32px rgba(14,27,77,0.12)',
          }}
        >
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #eff0f5' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dde0ea',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: 16, textAlign: 'center', color: '#808080', fontSize: 14 }}>
              No products found
            </div>
          )}
          {filtered.map(product => (
            <button
              key={product.id}
              onClick={() => {
                onSelect(product)
                setSearch('')
                setOpen(false)
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                border: 'none',
                borderBottom: '1px solid #f5f5f7',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff0f5' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0e1b4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: 12, color: '#808080' }}>
                  R{product.price} - {getCategoryLabel(product.category)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Selected products bar ─────────────────────────────────────────── */
function SelectedBar({ selected, onRemove }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '16px 0',
      }}
    >
      <AnimatePresence>
        {selected.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#fff',
              border: '2px solid #eff0f5',
              borderRadius: 12,
              padding: '8px 12px',
              boxShadow: '0 2px 8px rgba(14,27,77,0.06)',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0e1b4d', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </span>
            <button
              onClick={() => onRemove(product.id)}
              aria-label={`Remove ${product.name}`}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: 'none',
                background: '#fee2e2',
                color: '#DC2626',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {Array.from({ length: MAX_COMPARE - selected.length }).map((_, i) => (
        <div
          key={`empty-${i}`}
          style={{
            width: 200,
            height: 60,
            borderRadius: 12,
            border: '2px dashed #dde0ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b0b4c0',
            fontSize: 13,
          }}
        >
          Slot {selected.length + i + 1}
        </div>
      ))}
    </div>
  )
}

/* ─── Empty state ───────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      {/* Caps illustration via SVG */}
      <svg width="180" height="120" viewBox="0 0 180 120" fill="none" style={{ margin: '0 auto 24px' }}>
        {/* Cap 1 */}
        <ellipse cx="55" cy="82" rx="38" ry="14" fill="#eff0f5" />
        <path d="M25 70 Q55 20 85 70" fill="#4770db" stroke="#0e1b4d" strokeWidth="2" />
        <rect x="22" y="68" width="66" height="10" rx="5" fill="#0e1b4d" />
        <circle cx="55" cy="45" r="6" fill="#47db71" opacity="0.8" />
        {/* Cap 2 */}
        <ellipse cx="125" cy="82" rx="38" ry="14" fill="#eff0f5" />
        <path d="M95 70 Q125 20 155 70" fill="#47db71" stroke="#0e1b4d" strokeWidth="2" />
        <rect x="92" y="68" width="66" height="10" rx="5" fill="#0e1b4d" />
        <circle cx="125" cy="45" r="6" fill="#4770db" opacity="0.8" />
        {/* VS */}
        <text x="90" y="58" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0e1b4d" fontFamily="sans-serif">VS</text>
      </svg>
      <h3
        style={{
          fontFamily: '"font-display", sans-serif',
          fontSize: 22,
          color: '#0e1b4d',
          marginBottom: 8,
        }}
      >
        Select at least 2 products to compare
      </h3>
      <p style={{ color: '#808080', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>
        Use the selector above to pick 2 or 3 scrum caps and see them compared side by side.
      </p>
      <Link
        to="/catalogue"
        style={{
          display: 'inline-block',
          marginTop: 24,
          padding: '10px 24px',
          background: '#4770db',
          color: '#fff',
          borderRadius: 10,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Browse Catalogue
      </Link>
    </div>
  )
}

/* ─── Comparison table (desktop) ────────────────────────────────────── */
function ComparisonTable({ selected, addToCart, isInCart }) {
  const rows = [
    {
      label: 'Image',
      render: (p) => (
        <Link to={`/catalogue?quickview=${p.id}`}>
          <img
            src={p.image}
            alt={p.name}
            style={{
              width: '100%',
              maxWidth: 220,
              aspectRatio: '1/1',
              objectFit: 'cover',
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(14,27,77,0.1)',
            }}
          />
        </Link>
      ),
    },
    {
      label: 'Name',
      render: (p) => (
        <span style={{ fontWeight: 700, fontSize: 15, color: '#0e1b4d' }}>{p.name}</span>
      ),
    },
    {
      label: 'Price',
      render: (p) => (
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0e1b4d' }}>R{p.price}</span>
      ),
    },
    {
      label: 'Category',
      render: (p) => (
        <span style={{ fontSize: 14, color: '#555', textTransform: 'capitalize' }}>
          {getCategoryLabel(p.category)}
        </span>
      ),
    },
    {
      label: 'Colours',
      render: (p) => <ColourSwatches colours={p.colours} />,
    },
    {
      label: 'Stock',
      render: (p) => <StockBadge stock={p.stock} />,
    },
    {
      label: 'Badge',
      render: (p) => <ProductBadge badge={p.badge} />,
    },
    {
      label: '',
      render: (p) => (
        <button
          onClick={() => addToCart(p)}
          disabled={p.stock <= 0}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: 'none',
            fontWeight: 700,
            fontSize: 14,
            fontFamily: 'inherit',
            cursor: p.stock <= 0 ? 'not-allowed' : 'pointer',
            background: isInCart(p.id) ? '#47db71' : '#0e1b4d',
            color: '#fff',
            transition: 'background 0.2s, transform 0.15s',
            width: '100%',
            maxWidth: 200,
          }}
          onMouseEnter={e => {
            if (p.stock > 0) e.currentTarget.style.transform = 'scale(1.04)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {isInCart(p.id) ? 'Added to Cart' : 'Add to Cart'}
        </button>
      ),
    },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          tableLayout: 'fixed',
        }}
      >
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td
                style={{
                  width: 120,
                  padding: '14px 16px',
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#808080',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  verticalAlign: 'middle',
                  borderBottom: ri < rows.length - 1 ? '1px solid #eff0f5' : 'none',
                }}
              >
                {row.label}
              </td>
              {selected.map((p, ci) => (
                <td
                  key={p.id}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    borderBottom: ri < rows.length - 1 ? '1px solid #eff0f5' : 'none',
                    borderLeft: ci > 0 ? '1px solid #eff0f5' : 'none',
                  }}
                >
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Mobile cards ──────────────────────────────────────────────────── */
function MobileCards({ selected, addToCart, isInCart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AnimatePresence>
        {selected.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{
              background: '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(14,27,77,0.08)',
              border: '1px solid #eff0f5',
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
            <div style={{ padding: 20 }}>
              <h3 style={{ fontFamily: '"font-display", sans-serif', fontSize: 17, color: '#0e1b4d', margin: '0 0 8px' }}>
                {p.name}
              </h3>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0e1b4d', marginBottom: 12 }}>
                R{p.price}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#808080', fontWeight: 600 }}>Category</span>
                  <span style={{ color: '#333' }}>{getCategoryLabel(p.category)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#808080', fontWeight: 600 }}>Colours</span>
                  <ColourSwatches colours={p.colours} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#808080', fontWeight: 600 }}>Stock</span>
                  <StockBadge stock={p.stock} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#808080', fontWeight: 600 }}>Badge</span>
                  <ProductBadge badge={p.badge} />
                </div>
              </div>

              <button
                onClick={() => addToCart(p)}
                disabled={p.stock <= 0}
                style={{
                  width: '100%',
                  marginTop: 18,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: 'inherit',
                  cursor: p.stock <= 0 ? 'not-allowed' : 'pointer',
                  background: isInCart(p.id) ? '#47db71' : '#0e1b4d',
                  color: '#fff',
                  transition: 'background 0.2s',
                }}
              >
                {isInCart(p.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main Compare page ─────────────────────────────────────────────── */
export default function Compare() {
  const [selected, setSelected] = useState([])
  const { addToCart, isInCart } = useCart()
  const [isMobile, setIsMobile] = useState(false)

  // Simple responsive check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function handleSelect(product) {
    if (selected.length >= MAX_COMPARE) return
    if (selected.find(p => p.id === product.id)) return
    setSelected(prev => [...prev, product])
  }

  function handleRemove(id) {
    setSelected(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #eff0f5 0%, #fff 40%)',
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '48px 20px 24px',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: '"font-display", sans-serif',
            fontSize: 'clamp(28px, 5vw, 42px)',
            color: '#0e1b4d',
            margin: '0 0 8px',
            fontWeight: 800,
          }}
        >
          Compare Scrum Caps
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            color: '#808080',
            fontSize: 16,
            margin: 0,
          }}
        >
          Select 2-3 caps to compare side by side
        </motion.p>
      </div>

      {/* Product selector */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px 8px' }}>
        <ProductSelector selected={selected} onSelect={handleSelect} />
      </div>

      {/* Selected products bar */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <SelectedBar selected={selected} onRemove={handleRemove} />
      </div>

      {/* Comparison content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        {selected.length < 2 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(14,27,77,0.08)',
              border: '1px solid #eff0f5',
              padding: isMobile ? 16 : 24,
              marginTop: 8,
            }}
          >
            {isMobile ? (
              <MobileCards selected={selected} addToCart={addToCart} isInCart={isInCart} />
            ) : (
              <ComparisonTable selected={selected} addToCart={addToCart} isInCart={isInCart} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
