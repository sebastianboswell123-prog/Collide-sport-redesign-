// When vite.config.js proxies /api → localhost:3000, BASE stays empty in dev.
// Set VITE_API_URL in .env to point at a remote server in production.
const BASE = import.meta.env.VITE_API_URL ?? ''

function getSessionId() {
  let id = localStorage.getItem('collide_session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('collide_session_id', id)
  }
  return id
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': getSessionId(),
      ...options.headers,
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data })
  return data
}

// rands → cents for the backend
const toCents = (rands) => Math.round(rands * 100)

export const api = {
  subscribeNewsletter: (email) =>
    request('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),

  validateDiscount: (code, subtotalRands) =>
    request('/api/discounts/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal: toCents(subtotalRands) }),
    }),

  getShippingRates: (subtotalRands, country = 'ZA') =>
    request(`/api/shipping/rates?subtotal=${toCents(subtotalRands)}&country=${country}`),

  getProducts: (params = '') =>
    request(`/api/products${params ? `?${params}` : ''}`),

  healthCheck: () =>
    request('/health'),
}
