import { useState } from 'react'
import { motion } from 'framer-motion'

const INITIAL_REVIEWS = [
  { id:1, name:'Liam B.', rating:5, date:'May 2026', verified:true, helpful:14, text:'Best scrum cap I have owned. Fits perfectly and the protection is excellent.' },
  { id:2, name:'Siya M.', rating:5, date:'Apr 2026', verified:true, helpful:11, text:'Predator cap is next level. Premium quality, looks amazing on the field.' },
  { id:3, name:'Thando K.', rating:4, date:'Apr 2026', verified:false, helpful:6, text:'Great cap, comfortable and durable. The sizing chart could be clearer.' },
  { id:4, name:'Jade V.', rating:5, date:'Mar 2026', verified:true, helpful:9, text:'Wearing the Tribal cap for school rugby. Protection is way better than my old one.' },
  { id:5, name:'Marco P.', rating:5, date:'Mar 2026', verified:true, helpful:8, text:'The camo cap gets so many compliments. Foam padding feels solid.' },
  { id:6, name:'HE', rating:5, date:'Feb 2026', verified:true, helpful:5, text:'Fits perfectly, looks great and serves its purpose well.' },
  { id:7, name:'Cristelle', rating:5, date:'Feb 2026', verified:true, helpful:7, text:'Very happy with this product and sizing is good. Quality is great.' },
  { id:8, name:'Chad', rating:5, date:'Jan 2026', verified:true, helpful:12, text:'Helping me so much from not getting another concussion. Worth every rand.' },
]

function Stars({ rating, interactive = false, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange?.(i)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? '#FCD34D' : 'none'} stroke="#FCD34D" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ProductReviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [showAll, setShowAll] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', rating: 5, text: '' })
  const [submitted, setSubmitted] = useState(false)

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  const displayed = showAll ? reviews : reviews.slice(0, 4)

  function handleSubmit(e) {
    e.preventDefault()
    const newReview = { id: reviews.length + 1, name: form.name, rating: form.rating, date: 'Just now', verified: false, helpful: 0, text: form.text + ' (pending approval)', pending: true }
    setReviews(prev => [newReview, ...prev])
    setSubmitted(true)
    setFormOpen(false)
    setForm({ name: '', email: '', rating: 5, text: '' })
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="text-center sm:text-left">
            <div className="font-display font-extrabold text-5xl text-navy">{avgRating}</div>
            <Stars rating={Math.round(avgRating)} />
            <p className="text-xs text-navy/40 mt-1">Based on {reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => r.rating === star).length
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-navy/60">
                  <span className="w-2">{star}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FCD34D"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <div className="flex-1 h-1.5 bg-lavender rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(count/reviews.length)*100}%` }} />
                  </div>
                  <span className="w-3">{count}</span>
                </div>
              )
            })}
          </div>
          <button onClick={() => setFormOpen(o => !o)} className="sm:self-start bg-blue text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-blue-light transition-colors">
            Write a Review
          </button>
        </div>

        {formOpen && (
          <motion.form initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} onSubmit={handleSubmit} className="bg-lavender rounded-2xl p-6 mb-8 space-y-4">
            <h3 className="font-display font-bold text-navy">Your Review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Name" className="text-sm border border-navy/10 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue"/>
              <input required type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} placeholder="Email" className="text-sm border border-navy/10 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue"/>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-navy/60">Rating:</span>
              <Stars rating={form.rating} interactive onChange={r => setForm(p=>({...p,rating:r}))} />
            </div>
            <textarea required value={form.text} onChange={e => setForm(p=>({...p,text:e.target.value}))} placeholder="Share your experience..." rows={3} className="w-full text-sm border border-navy/10 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue resize-none"/>
            <div className="flex gap-3">
              <button type="submit" className="bg-blue text-white font-semibold px-6 py-2 rounded-full text-sm hover:bg-blue-light transition-colors">Submit Review</button>
              <button type="button" onClick={() => setFormOpen(false)} className="text-navy/50 text-sm hover:text-navy transition-colors">Cancel</button>
            </div>
          </motion.form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }} className="bg-lavender rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-navy">{r.name}</span>
                    {r.verified && <span className="text-[10px] bg-green/20 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified Buyer</span>}
                    {r.pending && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Pending</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Stars rating={r.rating} />
                    <span className="text-xs text-navy/40">{r.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-navy/70 leading-relaxed mb-3">"{r.text}"</p>
              <button className="text-xs text-navy/40 hover:text-navy transition-colors">👍 Helpful ({r.helpful})</button>
            </motion.div>
          ))}
        </div>

        {reviews.length > 4 && (
          <div className="text-center mt-8">
            <button onClick={() => setShowAll(o=>!o)} className="text-blue font-semibold text-sm hover:text-blue-light transition-colors">
              {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
