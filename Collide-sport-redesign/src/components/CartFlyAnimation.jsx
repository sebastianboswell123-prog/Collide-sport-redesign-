import { createContext, useContext, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppImage from './ui/AppImage'

const CartFlyContext = createContext(null)

let counter = 0

export function useCartFly() {
  return useContext(CartFlyContext)
}

export default function CartFlyProvider({ children }) {
  const [flies, setFlies] = useState([])

  const triggerFly = useCallback((event, product) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const startX = rect.left + rect.width / 2 - 24
    const startY = rect.top + rect.height / 2 - 24
    const id = counter++
    setFlies(prev => [...prev, { id, startX, startY, img: product.image }])
  }, [])

  const removeFly = useCallback((id) => {
    setFlies(prev => prev.filter(f => f.id !== id))
  }, [])

  return (
    <CartFlyContext.Provider value={{ triggerFly }}>
      {children}
      <AnimatePresence>
        {flies.map(({ id, startX, startY, img }) => (
          <motion.div
            key={id}
            className="fixed pointer-events-none z-[9998] w-12 h-12 rounded-xl overflow-hidden border-2 border-[#4770db] shadow-xl"
            initial={{ x: startX, y: startY, scale: 1, opacity: 1 }}
            animate={{
              x: window.innerWidth - 80,
              y: 8,
              scale: [1, 0.8, 0.3],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            onAnimationComplete={() => removeFly(id)}
          >
            {img && <AppImage src={img} alt="" className="w-full h-full object-cover" />}
          </motion.div>
        ))}
      </AnimatePresence>
    </CartFlyContext.Provider>
  )
}
