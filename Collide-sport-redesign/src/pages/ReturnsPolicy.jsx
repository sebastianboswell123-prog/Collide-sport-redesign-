import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SECTIONS = [
  {
    title: '1. Your Rights Under the Consumer Protection Act',
    body: 'Under the Consumer Protection Act (CPA No. 68 of 2008), you have the right to return goods within 5 business days of delivery if they do not conform to the product description, are defective, or were not delivered as described. This right applies to all purchases made on collidesport.co.za.',
  },
  {
    title: '2. Returns Window',
    body: 'We accept returns within 30 days of purchase for items in their original condition. Items must be unworn, unwashed, and in original packaging. Sale items may only be returned if faulty. Custom or personalised items (e.g. embroidered caps) are non-refundable unless defective.',
  },
  {
    title: '3. How to Return',
    body: 'Contact us at info@collidesport.co.za or via WhatsApp with your order number and reason for return. We will arrange collection or provide a return address. You will receive a full refund or exchange once the item is received and inspected (typically 3–5 business days).',
  },
  {
    title: '4. Defective or Incorrect Items',
    body: 'If you received a defective, damaged, or incorrect item, contact us within 5 business days of delivery. We will cover return shipping costs and provide a full replacement or refund at no charge to you.',
  },
  {
    title: '5. Refund Method',
    body: 'Refunds are processed to your original payment method within 5–10 business days of us receiving the returned item. PayFast refunds may take an additional 2–3 business days to reflect in your account.',
  },
  {
    title: '6. Exchanges',
    body: 'We offer free size or colour exchanges on scrum caps within 30 days of purchase. Contact us to arrange your exchange before returning the item.',
  },
  {
    title: '7. Contact',
    body: 'For all returns and refund enquiries: info@collidesport.co.za | WhatsApp: +27 00 000 0000 | Or use our contact form.',
  },
]

export default function ReturnsPolicy() {
  return (
    <div className="pt-14 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy-dark py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Legal</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight">Returns &amp; Refund Policy</h1>
          <p className="text-white/40 mt-3 text-sm font-mono">CPA-compliant · Last updated June 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-[800px] px-6 py-16 space-y-10">
        {SECTIONS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.05 }}
          >
            <h2 className="font-display font-bold text-navy text-xl mb-3">{s.title}</h2>
            <p className="text-navy/60 leading-relaxed text-base">{s.body}</p>
          </motion.div>
        ))}

        <div className="border-t border-navy/8 pt-8 flex flex-wrap gap-4">
          <Link to="/contact" className="inline-block bg-blue text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-light transition-colors text-sm">
            Contact Us
          </Link>
          <Link to="/catalogue" className="inline-block border-2 border-navy/15 text-navy/60 font-semibold px-6 py-3 rounded-full hover:border-navy/30 transition-colors text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
