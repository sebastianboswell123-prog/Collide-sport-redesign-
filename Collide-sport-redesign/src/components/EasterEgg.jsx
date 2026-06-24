import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export function useLogoClick() {
  const clicks = useRef(0)
  const timer = useRef(null)

  return useCallback(() => {
    clicks.current++
    clearTimeout(timer.current)
    if (clicks.current >= 5) {
      clicks.current = 0
      document.body.classList.add('retro-mode')
      setTimeout(() => document.body.classList.remove('retro-mode'), 3000)
    }
    timer.current = setTimeout(() => { clicks.current = 0 }, 1500)
  }, [])
}

export default function EasterEgg() {
  const [active, setActive] = useState(false)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const sequence = useRef([])

  useEffect(() => {
    function onKey(e) {
      const key = e.key
      sequence.current = [...sequence.current.slice(-9), key]
      if (sequence.current.join(',') === KONAMI.join(',')) {
        setActive(true)
        sequence.current = []
        // Web Audio beep sequence
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)()
          ;[440, 550, 660].forEach((f, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain); gain.connect(ctx.destination)
            osc.frequency.value = f
            gain.gain.setValueAtTime(0.15, ctx.currentTime + i*0.1)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.1 + 0.15)
            osc.start(ctx.currentTime + i*0.1)
            osc.stop(ctx.currentTime + i*0.1 + 0.15)
          })
        } catch { /* ignore */ }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!active) return
    function onEsc(e) { if (e.key === 'Escape') setActive(false) }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [active])

  function handleJoin(e) {
    e.preventDefault()
    try { localStorage.setItem('collide_predator98_email', email) } catch { /* ignore */ }
    setJoined(true)
  }

  return (
    <>
      <style>{`
        @keyframes glitch-bg {
          0%,100% { background-color: #080f2e; }
          50% { background-color: #0e1b4d; }
        }
        .retro-mode { filter: sepia(0.4); }
      `}</style>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
            style={{ animation: 'glitch-bg 0.4s ease-in-out infinite' }}
          >
            <button onClick={() => setActive(false)} className="absolute top-6 right-6 text-white/50 hover:text-white text-2xl font-light">×</button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 20 }}
              className="text-center max-w-sm"
            >
              <p className="text-green font-mono text-sm tracking-widest mb-4">🏉 SECRET FOUND 🏉</p>
              <h2 className="font-display font-extrabold text-3xl text-white mb-2">The Retro Predator '98</h2>
              <p className="text-white/50 text-sm mb-8 italic">An exclusive colourway. Coming 2026.</p>

              {/* Secret cap preview */}
              <div
                className="w-40 h-40 rounded-full mx-auto mb-8 flex items-center justify-center text-center shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #FFD700, #800000)' }}
              >
                <div>
                  <div className="font-display font-black text-white text-sm leading-tight">PREDATOR</div>
                  <div className="font-mono text-white/80 text-xs">'98</div>
                </div>
              </div>

              {!joined ? (
                <form onSubmit={handleJoin} className="flex gap-2">
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="Join the waitlist"
                    className="flex-1 text-sm bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-white/50"
                  />
                  <button type="submit" className="bg-green text-navy font-bold px-5 py-2.5 rounded-full text-sm hover:bg-green-dim transition-colors">
                    Join
                  </button>
                </form>
              ) : (
                <p className="text-green font-semibold">You're on the list. 🎖️</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
