import { motion } from 'framer-motion'

const STORE_EMAIL = 'info@collidesport.co.za'
const WA_URL = 'https://wa.me/27827804116?text=' + encodeURIComponent('Hi, I need help with my Collide Sport order.')

const SECTIONS = [
  {
    heading: '14-Day Returns',
    body: 'Items may be returned within 14 days of delivery, provided they are unworn, unwashed, and in their original packaging with all tags attached.',
  },
  {
    heading: 'How to Return',
    body: `Contact us via WhatsApp or email before sending anything back. We'll confirm your return and provide instructions. Returns sent without prior contact may not be accepted.`,
  },
  {
    heading: 'Exchanges',
    body: 'We gladly exchange items for a different size or colour. If the replacement item is a different price, the difference will be charged or refunded accordingly.',
  },
  {
    heading: 'Non-Returnable Items',
    body: 'Customised or embroidered items, sale items marked as final sale, and items that show signs of wear or washing cannot be returned.',
  },
  {
    heading: 'Refunds',
    body: 'Once your return is inspected and accepted, a refund is processed within 5–7 business days to your original payment method. Shipping costs are non-refundable.',
  },
  {
    heading: 'Faulty Items',
    body: 'If your item arrives damaged or defective, contact us within 48 hours of delivery with photos. We will replace it at no cost to you.',
  },
]

export default function ReturnsPolicyModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy/8 flex-shrink-0">
          <div>
            <h2 className="font-display font-extrabold text-navy text-lg tracking-tight">Returns Policy</h2>
            <p className="text-xs text-navy/40 mt-0.5">Effective date: January 2024</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close returns policy"
            className="w-9 h-9 rounded-full bg-lavender text-navy/40 hover:bg-navy hover:text-white transition-all flex items-center justify-center flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 space-y-5 overscroll-contain">
          {SECTIONS.map(({ heading, body }) => (
            <div key={heading}>
              <h3 className="font-display font-bold text-navy text-sm mb-1.5">{heading}</h3>
              <p className="text-sm text-navy/60 leading-relaxed">{body}</p>
            </div>
          ))}
          <div className="rounded-xl bg-lavender p-4 text-sm text-navy/60 leading-relaxed">
            <strong className="text-navy">Questions?</strong> Contact us on{' '}
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-blue font-semibold">WhatsApp</a>{' '}
            or email{' '}
            <a href={`mailto:${STORE_EMAIL}`} className="text-blue font-semibold">{STORE_EMAIL}</a>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-navy/8 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-navy text-white rounded-full py-3.5 text-sm font-semibold hover:bg-navy-dark transition-colors active:scale-[.98]"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
