import { Redis } from '@upstash/redis'

// Upstash Redis (Vercel Marketplace "Redis" integration). The integration
// injects credentials as env vars — we support both the Vercel-injected
// KV_REST_API_* names and Upstash's native UPSTASH_REDIS_REST_* names.
let redis = null

function getRedis() {
  if (redis) return redis
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error('Missing Redis credentials (KV_REST_API_URL / KV_REST_API_TOKEN)')
  }
  redis = new Redis({ url, token })
  return redis
}

const key = (orderNumber) => `order:${orderNumber}`
const TTL_SECONDS = 60 * 60 * 24 * 30 // keep orders 30 days

export async function saveOrder(order) {
  await getRedis().set(key(order.orderNumber), order, { ex: TTL_SECONDS })
}

export async function getOrder(orderNumber) {
  if (!orderNumber) return null
  return (await getRedis().get(key(orderNumber))) || null
}

export async function updateOrder(orderNumber, patch) {
  const existing = await getOrder(orderNumber)
  if (!existing) return null
  const merged = { ...existing, ...patch }
  await saveOrder(merged)
  return merged
}
