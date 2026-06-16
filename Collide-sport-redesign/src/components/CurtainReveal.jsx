import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CurtainReveal() {
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('collide_curtain_shown')) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('collide_curtain_shown', '1')
    }, 1400)
    return () => clearTimeout(t)
  }, [])

  if (shown && !visible) return null

  return (
    <AnimatePresence onExitComplete={() => setShown(true)}>
      {visible && (
        <>
          {/* Logo */}
          <motion.div
            className="fixed inset-0 z-[9001] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <span className="font-display font-extrabold text-2xl text-white tracking-tight select-none">
              COLLIDE<span className="text-[#4770db]">.</span>
            </span>
          </motion.div>

          {/* Left panel */}
          <motion.div
            className="fixed top-0 left-0 w-1/2 h-screen bg-[#080f2e] z-[9000]"
            initial={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0 }}
          />

          {/* Right panel */}
          <motion.div
            className="fixed top-0 right-0 w-1/2 h-screen bg-[#080f2e] z-[9000]"
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
