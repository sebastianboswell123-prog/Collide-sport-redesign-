import crypto from 'node:crypto'
import { getMerchant, generateSignature, PF_PROCESS_URL } from '../_lib/payfast.js'
import { minLegitimateTotal } from '../_lib/pricing.js'
import { saveOrder } from '../_lib/store.js'

// POST /api/checkout/create
// Body: {
//   items:    [{ id, name, qty, price }],
//   shippingId: 'standard' | 'express',
//   amount:   number,            // client total (ZAR), signed after a floor check
//   customer: { firstName, lastName, email, phone, address }
// }
// Returns: { process_url, fields, orderNumber }
//
// The passphrase + signature live here (server-side) so they're never exposed
// in the browser bundle. The order is persisted so the ITN can verify it.
function generateOrderNumber() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `CS-${yy}${mm}${dd}-${rand}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { items, shippingId = 'standard', amount, customer } = req.body || {}

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }
    if (!customer?.email) {
      return res.status(400).json({ error: 'Customer email is required' })
    }

    const claimed = Number(amount)
    if (!Number.isFinite(claimed) || claimed <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    // Underpayment guard: the signed amount must not be below the catalogue floor.
    const floor = minLegitimateTotal(items, shippingId)
    if (!floor.ok) return res.status(400).json({ error: floor.error })
    // small tolerance for rounding
    if (claimed + 0.01 < floor.minTotal) {
      return res.status(400).json({ error: 'Amount does not match cart' })
    }

    const orderNumber = generateOrderNumber()
    const amountStr = claimed.toFixed(2)
    const origin = process.env.SITE_URL || `https://${req.headers.host}`

    const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim()

    // Persist the pending order — authoritative record the ITN checks against.
    await saveOrder({
      orderNumber,
      status: 'PENDING',
      amount: claimed,
      currency: 'ZAR',
      shippingId,
      items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      customer: {
        name: fullName,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
      },
      createdAt: new Date().toISOString(),
    })

    // Build PayFast fields in canonical order; sign in that same order.
    const merchant = getMerchant()
    const fields = {
      merchant_id: merchant.merchant_id,
      merchant_key: merchant.merchant_key,
      return_url: `${origin}/order-confirmation?order=${encodeURIComponent(orderNumber)}`,
      cancel_url: `${origin}/checkout?cancelled=${encodeURIComponent(orderNumber)}`,
      notify_url: `${origin}/api/payfast-notify`,
      name_first: customer.firstName || 'Customer',
      name_last: customer.lastName || '',
      email_address: customer.email,
      cell_number: (customer.phone || '').replace(/\D/g, ''),
      m_payment_id: orderNumber,
      amount: amountStr,
      item_name: `Collide Sport order ${orderNumber}`,
      item_description: items
        .map((i) => `${i.qty}x ${i.name}`)
        .join(', ')
        .slice(0, 255),
    }

    // Drop empty fields before signing (PayFast excludes blanks).
    Object.keys(fields).forEach((k) => {
      if (fields[k] === '' || fields[k] == null) delete fields[k]
    })

    fields.signature = generateSignature(fields, Object.keys(fields))

    return res.status(200).json({ process_url: PF_PROCESS_URL, fields, orderNumber })
  } catch (err) {
    console.error('checkout/create error:', err)
    return res.status(500).json({ error: 'Could not start checkout' })
  }
}
