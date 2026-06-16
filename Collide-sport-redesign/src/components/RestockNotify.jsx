import { useState, useEffect } from 'react'

export default function RestockNotify({ product }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('collide_restock') || '[]')
      if (list.some(e => e.productId === product.id)) setAlreadySubscribed(true)
    } catch { /* ignore */ }
  }, [product.id])

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    try {
      const list = JSON.parse(localStorage.getItem('collide_restock') || '[]')
      list.push({ productId: product.id, productName: product.name, email })
      localStorage.setItem('collide_restock', JSON.stringify(list))
    } catch { /* ignore */ }
    setSubmitted(true)
  }

  if (alreadySubscribed) {
    return (
      <div className="rounded-xl bg-lavender p-4 text-xs text-green-600 flex items-center gap-2">
        <span>✓</span> Already on the waitlist for this product
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-lavender p-4 text-xs text-green-600 flex items-center gap-2">
        <span>✓</span> We'll email you when it's back in stock!
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-lavender p-4 mt-3">
      <p className="text-xs font-semibold text-navy mb-2">Notify me when back in stock</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 text-xs border border-navy/15 rounded-lg px-3 py-2 outline-none focus:border-blue bg-white"
          required
        />
        <button type="submit" className="text-xs bg-blue text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-light transition-colors whitespace-nowrap">
          Notify Me
        </button>
      </form>
    </div>
  )
}
