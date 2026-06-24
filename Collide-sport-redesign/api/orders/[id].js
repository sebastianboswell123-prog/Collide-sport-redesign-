import { getOrder } from '../_lib/store.js'

// GET /api/orders/:orderNumber — lets the confirmation page show real status.
// Returns only non-sensitive fields.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing order id' })

  try {
    const order = await getOrder(id)
    if (!order) return res.status(404).json({ error: 'Order not found' })

    return res.status(200).json({
      orderNumber: order.orderNumber,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (err) {
    console.error('order status error:', err)
    return res.status(500).json({ error: 'Could not fetch order' })
  }
}
