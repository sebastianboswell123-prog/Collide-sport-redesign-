import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Replace with the store owner's real WhatsApp number (digits only, intl format, no +) ──
const WHATSAPP_NUMBER = '27000000000'
const PREFILLED_TEXT  = 'Hi, I need help with my order.'

const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_TEXT)}`

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  return (
    // bottom-20 on mobile clears the MobileBottomBar (h-14 = 56px) with room to spare.
    // lg:bottom-6 matches the lg:hidden breakpoint of MobileBottomBar — no overlap on any viewport.
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center justify-end gap-3">

      {/* Tooltip — slides in from right on hover, desktop only */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="hidden lg:block bg-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap pointer-events-none"
          >
            Chat with us
            {/* Tooltip arrow */}
            <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-navy" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp — Hi, I need help with my order."
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4, ease: 'backOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-[#25D366]/30 cursor-pointer flex-shrink-0"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* Pulse ring — draws attention without being intrusive */}
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-25 pointer-events-none" />

        {/* WhatsApp logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="h-7 w-7 relative z-10"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </div>
  )
}
