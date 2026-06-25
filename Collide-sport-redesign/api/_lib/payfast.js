import crypto from 'node:crypto'
import dns from 'node:dns/promises'

const MODE = process.env.PAYFAST_MODE === 'live' ? 'live' : 'sandbox'

export const PF_PROCESS_URL =
  MODE === 'live'
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process'

export const PF_VALIDATE_URL =
  MODE === 'live'
    ? 'https://www.payfast.co.za/eng/query/validate'
    : 'https://sandbox.payfast.co.za/eng/query/validate'

// PayFast's published sandbox test merchant (used only when PAYFAST_MODE !== 'live').
const SANDBOX_MERCHANT_ID = '10000100'
const SANDBOX_MERCHANT_KEY = '46f0cd694581a'

export function getMerchant() {
  if (MODE === 'live') {
    return {
      merchant_id: process.env.PAYFAST_MERCHANT_ID || '',
      merchant_key: process.env.PAYFAST_MERCHANT_KEY || '',
    }
  }
  return { merchant_id: SANDBOX_MERCHANT_ID, merchant_key: SANDBOX_MERCHANT_KEY }
}

// Hosts PayFast sends ITN requests from (for the source-IP check).
const PF_VALID_HOSTS = [
  'www.payfast.co.za',
  'w1w.payfast.co.za',
  'w2w.payfast.co.za',
  'sandbox.payfast.co.za',
]

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

// PHP urlencode-compatible: spaces become "+" (matches PayFast's own Node sample).
// Trims values and skips empty ones.
export function pfParamString(data, keys = Object.keys(data)) {
  return keys
    .filter((k) => data[k] !== undefined && data[k] !== null && String(data[k]).length > 0)
    .map((k) => `${k}=${encodeURIComponent(String(data[k]).trim()).replace(/%20/g, '+')}`)
    .join('&')
}

// MD5 signature over the params (in the given key order) + passphrase.
export function generateSignature(data, keys) {
  let str = pfParamString(data, keys)
  const passphrase = process.env.PAYFAST_PASSPHRASE
  if (passphrase && passphrase.trim().length > 0) {
    str += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  }
  return md5(str)
}

// --- ITN validation ---

// 1. Recompute the signature from the posted ITN body (excluding `signature`)
//    in arrival order, and compare.
export function verifyItnSignature(body) {
  const keys = Object.keys(body).filter((k) => k !== 'signature')
  return generateSignature(body, keys) === body.signature
}

// 2. Confirm the request came from a real PayFast IP.
export async function verifySourceIp(req) {
  if (process.env.PAYFAST_SKIP_IP_CHECK === 'true') return true
  const fwd = req.headers['x-forwarded-for']
  const reqIp = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim()
  if (!reqIp) return false
  const valid = new Set()
  for (const host of PF_VALID_HOSTS) {
    try {
      const addrs = await dns.lookup(host, { all: true })
      addrs.forEach((a) => valid.add(a.address))
    } catch {
      /* ignore individual resolution failures */
    }
  }
  return valid.has(reqIp)
}

// 4. Ask PayFast's server to confirm the data is genuine.
export async function verifyWithPayfast(body) {
  const keys = Object.keys(body).filter((k) => k !== 'signature')
  const payload = pfParamString(body, keys)
  const res = await fetch(PF_VALIDATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload,
  })
  return (await res.text()).trim() === 'VALID'
}
