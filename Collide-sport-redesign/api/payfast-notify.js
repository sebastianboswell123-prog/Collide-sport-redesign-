import {
  verifyItnSignature,
  verifySourceIp,
  verifyWithPayfast,
} from './_lib/payfast.js'
import { getOrder, updateOrder } from './_lib/store.js'

// POST /api/payfast-notify — PayFast Instant Transaction Notification (ITN).
// The ONLY trustworthy confirmation of payment. Runs all four PayFast checks
// before marking an order PAID. Always responds 200 once handled so PayFast
// stops retrying; we simply don't update the order unless every check passes.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const body = req.body || {}

  try {
    // 1. Signature
    if (!verifyItnSignature(body)) {
      console.warn('ITN rejected: signature mismatch', body.m_payment_id)
      return res.status(200).end()
    }

    // 2. Source IP
    if (!(await verifySourceIp(req))) {
      console.warn('ITN rejected: invalid source IP', body.m_payment_id)
      return res.status(200).end()
    }

    const order = await getOrder(body.m_payment_id)
    if (!order) {
      console.warn('ITN rejected: unknown order', body.m_payment_id)
      return res.status(200).end()
    }

    // Idempotency — PayFast may deliver the ITN more than once.
    if (order.status === 'PAID') return res.status(200).end()

    // 3. Amount matches the stored (signed) total.
    const gross = Math.round(parseFloat(body.amount_gross) * 100)
    const expected = Math.round(order.amount * 100)
    if (gross !== expected) {
      console.warn('ITN rejected: amount mismatch', body.m_payment_id, gross, expected)
      await updateOrder(body.m_payment_id, { status: 'FAILED', failReason: 'amount_mismatch' })
      return res.status(200).end()
    }

    // 4. Server-to-server confirmation with PayFast.
    if (!(await verifyWithPayfast(body))) {
      console.warn('ITN rejected: PayFast did not return VALID', body.m_payment_id)
      return res.status(200).end()
    }

    if (body.payment_status === 'COMPLETE') {
      await updateOrder(body.m_payment_id, {
        status: 'PAID',
        pfPaymentId: body.pf_payment_id || null,
        paidAt: new Date().toISOString(),
      })
      // TODO: trigger fulfilment / confirmation email here.
      console.log('Order PAID:', body.m_payment_id)
    } else {
      await updateOrder(body.m_payment_id, { status: 'FAILED', failReason: body.payment_status })
    }

    return res.status(200).end()
  } catch (err) {
    console.error('payfast-notify error:', err)
    return res.status(200).end()
  }
}
