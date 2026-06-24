/**
 * PayFast integration — redirect (Custom Integration) flow.
 *
 * PayFast takes a standard HTML form POST to its process endpoint and then
 * redirects the buyer back to `return_url` (success) or `cancel_url`.
 *
 * Environment
 *   - Development  → sandbox endpoint + PayFast's public sandbox credentials.
 *   - Production   → live endpoint + credentials from VITE_PAYFAST_* env vars.
 *
 * Mode is driven by Vite's build flag (import.meta.env.PROD) and can be
 * force-overridden with VITE_PAYFAST_MODE = 'sandbox' | 'live'.
 *
 * ⚠️ Signature & ITN: PayFast's MD5 signature must be generated with the
 * merchant passphrase, and the payment must be confirmed via a server-side
 * ITN (notify_url) callback. Neither may live in client code (the passphrase
 * would be exposed). This module deliberately omits the signature — it works
 * against the sandbox (no passphrase) for the demo. For production, generate
 * the signature and verify the ITN in a serverless function (see DEPLOYMENT.md).
 */

const SANDBOX_URL = 'https://sandbox.payfast.co.za/eng/process'
const LIVE_URL    = 'https://www.payfast.co.za/eng/process'

// PayFast's published sandbox test merchant — safe to ship, sandbox-only.
const SANDBOX_MERCHANT_ID  = '10000100'
const SANDBOX_MERCHANT_KEY = '46f0cd694581a'

function resolveMode() {
  const forced = import.meta.env.VITE_PAYFAST_MODE
  if (forced === 'sandbox' || forced === 'live') return forced
  return import.meta.env.PROD ? 'live' : 'sandbox'
}

export function getPayfastConfig() {
  const mode = resolveMode()
  if (mode === 'live') {
    return {
      mode,
      url:         LIVE_URL,
      merchantId:  import.meta.env.VITE_PAYFAST_MERCHANT_ID  || '',
      merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '',
    }
  }
  return {
    mode,
    url:         SANDBOX_URL,
    merchantId:  SANDBOX_MERCHANT_ID,
    merchantKey: SANDBOX_MERCHANT_KEY,
  }
}

const amount = (n) => Number(n).toFixed(2)

/**
 * Build the field map PayFast expects for an order.
 * @param {object} order  the persisted order object (see lib/orders.js)
 */
export function buildPayfastFields(order) {
  const cfg    = getPayfastConfig()
  const origin = window.location.origin
  const [firstName, ...rest] = (order.customer.name || '').trim().split(/\s+/)

  const fields = {
    // Merchant
    merchant_id:  cfg.merchantId,
    merchant_key: cfg.merchantKey,
    // Redirects
    return_url: `${origin}/order-confirmation?order=${encodeURIComponent(order.orderNumber)}`,
    cancel_url: `${origin}/checkout?cancelled=${encodeURIComponent(order.orderNumber)}`,
    notify_url: import.meta.env.VITE_PAYFAST_NOTIFY_URL || `${origin}/api/payfast-itn`,
    // Buyer
    name_first:    firstName || 'Customer',
    name_last:     rest.join(' '),
    email_address: order.customer.email,
    cell_number:   order.customer.phone,
    // Transaction
    m_payment_id:     order.orderNumber,
    amount:           amount(order.totals.total),
    item_name:        `Collide Sport order ${order.orderNumber}`,
    item_description: order.items.map(i => `${i.qty}× ${i.name}`).join(', ').slice(0, 255),
  }

  // Drop empty values — PayFast rejects blank fields in the signature set.
  return Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== '' && v != null))
}

/**
 * Redirect the browser to PayFast by submitting a hidden POST form.
 * @returns {string} the resolved mode ('sandbox' | 'live')
 */
export function redirectToPayfast(order) {
  const cfg    = getPayfastConfig()
  const fields = buildPayfastFields(order)

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = cfg.url
  form.style.display = 'none'

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input')
    input.type  = 'hidden'
    input.name  = name
    input.value = String(value)
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
  return cfg.mode
}
