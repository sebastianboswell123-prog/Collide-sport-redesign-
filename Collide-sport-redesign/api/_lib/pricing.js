import { PRODUCTS } from '../../src/data/products.js'

const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]))

// Lowest legitimate unit price for a product (sale price wins if present).
// Variant surcharges (size/colour) only ever ADD to this, so the catalogue
// price is a safe lower bound for an underpayment check.
function minUnitPrice(id) {
  const p = BY_ID.get(id)
  if (!p) return null
  return p.salePrice ?? p.price
}

// Shipping rules mirror src/pages/Checkout.jsx:
//   standard → free at/over R1000 subtotal, else R99
//   express  → R199 flat
export function shippingCost(shippingId, subtotal) {
  if (shippingId === 'express') return 199
  return subtotal >= 1000 ? 0 : 99
}

/**
 * Compute the minimum legitimate order total from the authoritative catalogue.
 * Used to reject underpayment — the amount the client signs may be higher
 * (variant surcharges) but must never be lower than this floor.
 *
 * @param {Array<{id:number, qty:number}>} items
 * @param {string} shippingId
 * @returns {{ ok: boolean, minTotal: number, minSubtotal: number, error?: string }}
 */
export function minLegitimateTotal(items, shippingId) {
  let minSubtotal = 0
  for (const line of items) {
    const unit = minUnitPrice(line.id)
    if (unit == null) return { ok: false, minTotal: 0, minSubtotal: 0, error: `Unknown product id: ${line.id}` }
    const qty = Math.max(1, Math.floor(Number(line.qty) || 0))
    minSubtotal += unit * qty
  }
  const minTotal = minSubtotal + shippingCost(shippingId, minSubtotal)
  return { ok: true, minTotal, minSubtotal }
}
