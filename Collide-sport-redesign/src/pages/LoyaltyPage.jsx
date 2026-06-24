import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const TIERS = [
  { name:'Bronze', min:0,    max:499,      color:'#CD7F32', benefit:'Early access to new drops' },
  { name:'Silver', min:500,  max:999,      color:'#A0A0A0', benefit:'5% off all orders' },
  { name:'Pro',    min:1000, max:Infinity, color:'#FFD700', benefit:'10% off + free shipping + exclusive colourways' },
]

const EARN = [
  { action:'Purchase',           pts:50,  desc:'Earn 50 points for every order' },
  { action:'Leave a Review',     pts:25,  desc:'Share your experience' },
  { action:'Refer a Friend',     pts:100, desc:'When your friend places their first order' },
  { action:'Birthday Reward',    pts:75,  desc:'A gift from us on your birthday' },
]

export default function LoyaltyPage() {
  const [points, setPoints] = useState(0)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    try { setPoints(Number(localStorage.getItem('collide_points') || 0)) } catch { /* ignore */ }
  }, [])

  function addPoints(n, label) {
    const next = points + n
    setPoints(next)
    try { localStorage.setItem('collide_points', String(next)) } catch { /* ignore */ }
    setFlash(`+${n} pts — ${label}`)
    setTimeout(() => setFlash(null), 2000)
  }

  const tier = TIERS.findLast(t => points >= t.min) || TIERS[0]
  const nextTier = TIERS[TIERS.indexOf(tier) + 1]
  const progress = nextTier ? ((points - tier.min) / (nextTier.min - tier.min)) * 100 : 100

  return (
    <div className="pt-14 min-h-screen bg-lavender">
      {/* Hero */}
      <div className="bg-navy py-16 px-6 lg:px-12 text-center">
        <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Rewards</p>
        <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight mb-3">Pack Points</h1>
        <p className="text-white/50">Earn rewards with every purchase</p>
      </div>

      <div className="mx-auto max-w-[860px] px-6 py-12 space-y-8">

        {/* Points card */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-2xl p-8">
          <div className="flex items-center gap-6 mb-6">
            <div>
              <div className="font-display font-extrabold text-5xl text-navy">{points.toLocaleString()}</div>
              <p className="text-navy/40 text-sm mt-1">Pack Points</p>
            </div>
            <span className="ml-auto font-bold text-sm px-4 py-2 rounded-full" style={{ background: tier.color + '22', color: tier.color }}>
              {tier.name} Tier
            </span>
          </div>

          {nextTier && (
            <>
              <div className="w-full h-3 bg-lavender rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: tier.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-navy/40">{nextTier.min - points} points to {nextTier.name}</p>
            </>
          )}

          {/* Demo buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {EARN.slice(0,3).map(e => (
              <button key={e.action} onClick={() => addPoints(e.pts, e.action)} className="text-xs border border-blue/30 text-blue rounded-full px-4 py-2 hover:bg-blue/5 transition-colors font-medium">
                +{e.pts} {e.action}
              </button>
            ))}
          </div>

          {flash && (
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="text-green font-bold text-sm mt-3">
              {flash}
            </motion.p>
          )}
        </motion.div>

        {/* How to earn */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy text-lg mb-5">How to Earn Points</h2>
          <div className="divide-y divide-navy/5">
            {EARN.map(e => (
              <div key={e.action} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-navy text-sm">{e.action}</p>
                  <p className="text-navy/40 text-xs mt-0.5">{e.desc}</p>
                </div>
                <span className="font-display font-extrabold text-blue text-lg">+{e.pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map(t => (
            <div key={t.name} className={`bg-white rounded-2xl p-6 text-center border-2 transition-colors ${tier.name === t.name ? 'border-blue' : 'border-transparent'}`}>
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-extrabold text-white" style={{ background: t.color }}>
                {t.name[0]}
              </div>
              <h3 className="font-display font-bold text-navy">{t.name}</h3>
              <p className="text-xs text-navy/40 mt-1">{t.min}+ points</p>
              <p className="text-sm text-navy/60 mt-3 leading-snug">{t.benefit}</p>
              {tier.name === t.name && <span className="inline-block mt-3 text-[10px] bg-blue/10 text-blue font-bold px-2 py-0.5 rounded-full">Your tier</span>}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/catalogue" className="inline-block bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors">
            Start Earning →
          </Link>
        </div>
      </div>
    </div>
  )
}
