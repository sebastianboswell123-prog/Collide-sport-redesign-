import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const FIXTURES = [
  { opponent: 'British & Irish Lions', dateStr: '2025-07-05T17:00:00', venue: 'Ellis Park, Johannesburg' },
  { opponent: 'Australia', dateStr: '2025-08-09T17:00:00', venue: 'Cape Town Stadium' },
  { opponent: 'New Zealand', dateStr: '2025-08-23T17:00:00', venue: 'Loftus Versfeld, Pretoria' },
]

function getCountdown(dateStr) {
  const diff = new Date(dateStr) - new Date()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function MatchDayBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('collide_matchday_dismissed')) { setDismissed(true); return }
    setMounted(true)
  }, [])

  const nextFixture = FIXTURES.find(f => new Date(f.dateStr) > new Date())

  useEffect(() => {
    if (!nextFixture || dismissed) return
    setCountdown(getCountdown(nextFixture.dateStr) || '')
    const t = setInterval(() => setCountdown(getCountdown(nextFixture.dateStr) || ''), 1000)
    return () => clearInterval(t)
  }, [nextFixture, dismissed])

  function dismiss() {
    setDismissed(true)
    sessionStorage.setItem('collide_matchday_dismissed', '1')
  }

  if (dismissed || !mounted || !nextFixture || !countdown) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 right-4 z-40"
    >
      <div className="bg-green text-navy rounded-2xl shadow-xl overflow-hidden">
        <button onClick={() => setExpanded(o => !o)} className="flex items-center gap-3 px-4 py-3 w-full text-left">
          <span>⚡</span>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider uppercase">Next Test</div>
            <div className="font-display font-bold text-sm leading-tight">{nextFixture.opponent}</div>
            <div className="font-mono text-xs mt-0.5 opacity-80">{countdown}</div>
          </div>
          <svg className={`w-4 h-4 ml-auto transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 border-t border-navy/10 pt-3 space-y-2">
                <p className="text-xs opacity-70">{nextFixture.venue}</p>
                <Link to="/catalogue" className="block text-xs font-bold underline">Get Your Cap →</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={dismiss} className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-navy/50 hover:text-navy text-xs font-bold">×</button>
      </div>
    </motion.div>
  )
}
