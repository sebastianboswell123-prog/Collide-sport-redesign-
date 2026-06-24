/**
 * Order persistence + customer confirmation email.
 *
 * Orders are stored in localStorage so the confirmation page can render them
 * after the PayFast round-trip (the browser leaves the SPA and comes back).
 * In production the source of truth for a paid order is the server-side ITN;
 * this client store is for UX continuity / order lookup on the confirmation page.
 */

const ORDERS_KEY = 'collide_orders'

// Formspree endpoint — replace YOUR_FORM_ID (matches About.jsx / Contact.jsx).
const FORMSPREE_URL =
  import.meta.env.VITE_FORMSPREE_ID
    ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
    : 'https://formspree.io/f/YOUR_FORM_ID'

// ── Order number ──────────────────────────────────────────────────────────────
// Format: CS-YYMMDD-XXXX  (date + 4 random base-36 chars). Date.now is fine in
// the browser; only the workflow runtime forbids it.
export function generateOrderNumber() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CS-${yy}${mm}${dd}-${rand}`
}

// ── Persistence ───────────────────────────────────────────────────────────────
function readAll() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveOrder(order) {
  try {
    const all = readAll()
    all[order.orderNumber] = order
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all))
  } catch {
    /* quota — non-fatal */
  }
}

export function getOrder(orderNumber) {
  if (!orderNumber) return null
  return readAll()[orderNumber] || null
}

export function markOrderPaid(orderNumber) {
  const order = getOrder(orderNumber)
  if (!order) return null
  order.status = 'paid'
  saveOrder(order)
  return order
}

// ── Confirmation email (Formspree) ────────────────────────────────────────────
const fmtZAR = (n) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n)

/**
 * Send an order confirmation email to the customer via Formspree.
 * Returns true on success. Safe to call once per order (guarded by the caller).
 *
 * NOTE: For production, send the confirmation from the server-side ITN handler
 * once payment is verified — not from the client — so emails only go out for
 * genuinely paid orders.
 */
export async function sendConfirmationEmail(order) {
  if (FORMSPREE_URL.endsWith('YOUR_FORM_ID')) {
    // Not configured yet — skip the network call but don't block the UX.
    return false
  }

  const lines = order.items
    .map(i => `  ${i.qty}× ${i.name} — ${fmtZAR(i.price * i.qty)}`)
    .join('\n')

  const c = order.customer
  const body = {
    _subject: `Collide Sport — Order ${order.orderNumber} confirmed`,
    email: c.email,
    name: c.name,
    message:
`Hi ${c.name.split(' ')[0]},

Thanks for your order! Here are the details:

Order number: ${order.orderNumber}
Status: ${order.status}

Items:
${lines}

Subtotal: ${fmtZAR(order.totals.subtotal)}
Shipping (${order.shipping.label}): ${order.totals.shipping === 0 ? 'Free' : fmtZAR(order.totals.shipping)}
Total (incl. VAT): ${fmtZAR(order.totals.total)}

Delivery to:
${c.name}
${c.address}
${c.city}, ${c.province}, ${c.postalCode}
${c.phone}

We'll be in touch as soon as your order ships.

— Collide Sport`,
  }

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
  }
}
