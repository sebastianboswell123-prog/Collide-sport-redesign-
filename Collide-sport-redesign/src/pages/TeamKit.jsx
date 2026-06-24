import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import AppImage from '../components/ui/AppImage'

/* ── helpers ─────────────────────────────────────────────── */

const ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 0,
})

const DISCOUNT_TIERS = [
  { min: 50, pct: 20, label: '50+',   note: '+ free delivery' },
  { min: 20, pct: 15, label: '20-49', note: null },
  { min: 10, pct: 10, label: '10-19', note: null },
  { min: 5,  pct: 5,  label: '5-9',   note: null },
]

function getTier(totalQty) {
  return DISCOUNT_TIERS.find(t => totalQty >= t.min) || null
}

const CAP_PRODUCTS = PRODUCTS.filter(
  p => p.category === 'scrum-caps' || p.category === 'premium-caps'
)

/* ── brand palette ───────────────────────────────────────── */

const C = {
  navy: '#0e1b4d',
  blue: '#4770db',
  green: '#47db71',
  lavender: '#eff0f5',
}

/* ── animations ──────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } }),
}

/* ── component ───────────────────────────────────────────── */

export default function TeamKit() {
  // kit = { [productId]: qty }
  const [kit, setKit] = useState({})
  const [quantities, setQuantities] = useState({})   // per-card selector value
  const [copied, setCopied] = useState(false)
  const [quoteRequested, setQuoteRequested] = useState(false)

  /* derived values */
  const kitItems = useMemo(() => {
    return Object.entries(kit)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = CAP_PRODUCTS.find(p => p.id === Number(id))
        return product ? { ...product, qty } : null
      })
      .filter(Boolean)
  }, [kit])

  const totalQty = useMemo(() => kitItems.reduce((s, i) => s + i.qty, 0), [kitItems])
  const subtotal = useMemo(() => kitItems.reduce((s, i) => s + i.price * i.qty, 0), [kitItems])
  const tier = useMemo(() => getTier(totalQty), [totalQty])
  const discountAmount = tier ? Math.round(subtotal * (tier.pct / 100)) : 0
  const finalTotal = subtotal - discountAmount

  /* actions */
  const addToKit = useCallback((productId) => {
    const qty = quantities[productId] || 1
    setKit(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + qty,
    }))
  }, [quantities])

  const removeFromKit = useCallback((productId) => {
    setKit(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }, [])

  const handleShareLink = useCallback(() => {
    const url = `${window.location.origin}/team-kit?items=${encodeURIComponent(JSON.stringify(kit))}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }, [kit])

  const handleRequestQuote = useCallback(() => {
    setQuoteRequested(true)
    setTimeout(() => setQuoteRequested(false), 4000)
  }, [])

  /* ── render ──────────────────────────────────────────── */
  return (
    <div style={{ background: C.lavender, minHeight: '100vh' }}>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.blue} 100%)`,
          padding: '80px 24px 64px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, margin: 0 }}
        >
          Team Kit Portal
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ maxWidth: 560, margin: '16px auto 0', fontSize: '1.1rem', opacity: 0.9 }}
        >
          Outfit your entire team with Collide Sport. Bulk discounts for schools and clubs.
        </motion.p>
      </section>

      {/* ─── DISCOUNT TIERS ──────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '-32px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {[
            { range: '5-9 caps', pct: '5%', extra: null },
            { range: '10-19 caps', pct: '10%', extra: null },
            { range: '20-49 caps', pct: '15%', extra: null },
            { range: '50+ caps', pct: '20%', extra: '+ free delivery' },
          ].map((t, i) => (
            <motion.div
              key={t.range}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(14,27,77,.08)',
                border: tier && tier.label === t.range.replace(' caps', '') ? `2px solid ${C.green}` : '2px solid transparent',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: C.blue }}>{t.pct}</div>
              <div style={{ fontSize: '.95rem', fontWeight: 600, color: C.navy, marginTop: 4 }}>{t.range}</div>
              {t.extra && (
                <div style={{ fontSize: '.8rem', color: C.green, fontWeight: 700, marginTop: 6 }}>{t.extra}</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── MAIN LAYOUT ─────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: '48px auto 0',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 32,
          alignItems: 'start',
        }}
        className="teamkit-layout"
      >

        {/* ─── PRODUCT GRID ────────────────────────────── */}
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: C.navy, marginBottom: 24 }}>
            Choose Your Caps
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            {CAP_PRODUCTS.map((product, i) => {
              const qty = quantities[product.id] || 1
              return (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  custom={i % 8}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 2px 16px rgba(14,27,77,.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f3f4f8' }}>
                    <AppImage
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '16px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '.95rem', fontWeight: 600, color: C.navy, margin: '0 0 6px', lineHeight: 1.3 }}>
                      {product.name}
                    </h3>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: C.blue, marginBottom: 14 }}>
                      {ZAR.format(product.price)}
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select
                        value={qty}
                        onChange={e => setQuantities(prev => ({ ...prev, [product.id]: Number(e.target.value) }))}
                        style={{
                          width: 60,
                          padding: '8px 4px',
                          borderRadius: 8,
                          border: `1px solid #d0d3dd`,
                          fontSize: '.9rem',
                          color: C.navy,
                          cursor: 'pointer',
                        }}
                      >
                        {Array.from({ length: 50 }, (_, n) => n + 1).map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => addToKit(product.id)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          background: C.green,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '.85rem',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'opacity .2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        Add to Kit
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ─── KIT SUMMARY SIDEBAR ─────────────────────── */}
        <aside
          style={{
            position: 'sticky',
            top: 24,
            background: '#fff',
            borderRadius: 16,
            padding: '28px 24px',
            boxShadow: '0 4px 24px rgba(14,27,77,.1)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: C.navy, margin: '0 0 20px' }}>
            Kit Summary
          </h2>

          {kitItems.length === 0 ? (
            <p style={{ color: '#888', fontSize: '.9rem' }}>No items added yet. Select caps and quantities above.</p>
          ) : (
            <>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                <AnimatePresence>
                  {kitItems.map(item => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: '1px solid #eee',
                        gap: 8,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '.85rem', fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '.8rem', color: '#888' }}>
                          {item.qty} x {ZAR.format(item.price)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '.9rem', fontWeight: 700, color: C.navy }}>
                          {ZAR.format(item.price * item.qty)}
                        </span>
                        <button
                          onClick={() => removeFromKit(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ccc',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            lineHeight: 1,
                            padding: 0,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#f44')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                          title="Remove"
                        >
                          &times;
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              {/* totals */}
              <div style={{ fontSize: '.9rem', color: '#555', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Total caps</span>
                <span style={{ fontWeight: 700 }}>{totalQty}</span>
              </div>
              <div style={{ fontSize: '.9rem', color: '#555', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 700 }}>{ZAR.format(subtotal)}</span>
              </div>

              {tier && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}44`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    margin: '12px 0',
                  }}
                >
                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: C.green }}>
                    {tier.pct}% bulk discount applied ({tier.label} caps tier)
                    {tier.note && <span style={{ display: 'block', fontSize: '.8rem', marginTop: 2 }}>{tier.note}</span>}
                  </div>
                  <div style={{ fontSize: '.9rem', fontWeight: 700, color: C.navy, marginTop: 4 }}>
                    &minus;{ZAR.format(discountAmount)}
                  </div>
                </motion.div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: `2px solid ${C.navy}`,
                  paddingTop: 14,
                  marginTop: 12,
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 700, color: C.navy }}>Total</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: C.navy }}>{ZAR.format(finalTotal)}</span>
              </div>

              {/* actions */}
              <button
                onClick={handleShareLink}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: C.blue,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '.9rem',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  marginBottom: 10,
                  transition: 'opacity .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {copied ? 'Link Copied!' : 'Share Kit Link'}
              </button>
              <button
                onClick={handleRequestQuote}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: C.green,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '.9rem',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'opacity .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {quoteRequested ? 'Quote Requested! We\'ll be in touch.' : 'Request Quote'}
              </button>
            </>
          )}
        </aside>
      </div>

      {/* ─── CONTACT SECTION ──────────────────────────── */}
      <section
        style={{
          background: C.navy,
          color: '#fff',
          textAlign: 'center',
          padding: '48px 24px',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px' }}
        >
          Need a custom order?
        </motion.h2>
        <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
          WhatsApp us or email{' '}
          <a href="mailto:info@collidesport.co.za" style={{ color: C.green, fontWeight: 600 }}>
            info@collidesport.co.za
          </a>
        </p>
      </section>

      {/* ─── RESPONSIVE STYLES ────────────────────────── */}
      <style>{`
        @media (max-width: 840px) {
          .teamkit-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
