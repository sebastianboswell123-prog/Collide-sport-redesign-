import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function useReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

const VARIANTS = {
  up: {
    hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 1 },
    visible: { clipPath: 'inset(0% 0 0 0)', opacity: 1 },
  },
  left: {
    hidden: { clipPath: 'inset(0 0 0 100%)', opacity: 1 },
    visible: { clipPath: 'inset(0 0 0 0%)', opacity: 1 },
  },
  right: {
    hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
    visible: { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
  },
  scale: {
    hidden: { scale: 0.94, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
}

export default function RevealWrapper({ children, direction = 'up', delay = 0, className = '' }) {
  const [ref, isVisible] = useReveal()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={VARIANTS[direction]}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}
