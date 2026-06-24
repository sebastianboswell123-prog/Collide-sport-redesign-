import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CollideLogo from './CollideLogo'

export default function CurtainReveal() {
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('collide_curtain_shown')) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('collide_curtain_shown', '1')
    }, 500)
    return () => clearTimeout(t)
  }, [])

  if (shown && !visible) return null

  return (
    <AnimatePresence onExitComplete={() => setShown(true)}>
      {visible && (
        <>
          {/* Logo — same Collide Sport brand mark used across the site */}
          <motion.div
            className="fixed inset-0 z-[9001] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <CollideLogo size="xl" variant="light" />
            </motion.div>
          </motion.div>

          {/* Left panel */}
          <motion.div
            className="fixed top-0 left-0 w-1/2 h-screen bg-[#080f2e] z-[9000]"
            initial={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0 }}
          />

          {/* Right panel */}
          <motion.div
            className="fixed top-0 right-0 w-1/2 h-screen bg-[#080f2e] z-[9000]"
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
