import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import AppImage from '../components/ui/AppImage'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

const BUNDLES = [
  {
    id: 'team',
    name: 'Team Starter Pack',
    tagline: 'Everything you need for match day',
    originalPrice: 1697,
    bundlePrice: 1450,
    saving: 247,
    image: `${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533`,
    items: [
      { id:4,  name:'Scrum Cap — Black',       price:550, img:`${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533`,            stock:6,  category:'scrum-caps',  colours:['Black'] },
      { id:24, name:'Compression Top — Black', price:299, img:`${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533`, stock:20, category:'activewear',   colours:['Black'] },
      { id:26, name:'Running Top — Black',     price:399, img:`${CDN}/SabreRunningTop-Black_1.jpg?v=1689063515&width=533`,   stock:12, category:'activewear',   colours:['Black'] },
      { id:27, name:'Undershorts — Black',     price:449, img:`${CDN}/editedblackundershorts.jpg?v=1689431134&width=533`,    stock:10, category:'activewear',   colours:['Black'] },
    ],
  },
  {
    id: 'training',
    name: 'Training Bundle',
    tagline: 'Protect and perform',
    originalPrice: 849,
    bundlePrice: 799,
    saving: 50,
    image: `${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533`,
    items: [
      { id:4,  name:'Scrum Cap — Black',       price:550, img:`${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533`,            stock:6,  category:'scrum-caps', colours:['Black'] },
      { id:24, name:'Compression Top — Black', price:299, img:`${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533`, stock:20, category:'activewear',  colours:['Black'] },
    ],
  },
  {
    id: 'school',
    name: 'Schoolboy Starter',
    tagline: 'Quality protection for school rugby',
    badge: '33% OFF FOR SCHOOLS',
    originalPrice: 749,
    bundlePrice: 499,
    saving: 250,
    image: `${CDN}/1_165a1aff-9c87-41b8-b1c2-d8304dff7ab1.jpg?v=1722102398&width=533`,
    items: [
      { id:17, name:'Scrum Cap — Green & Black', price:450, img:`${CDN}/1_165a1aff-9c87-41b8-b1c2-d8304dff7ab1.jpg?v=1722102398&width=533`, stock:20, category:'scrum-caps', colours:['Green','Black'] },
      { id:25, name:'Compression Top — White',   price:299, img:`${CDN}/SabreCompressionTop-White.jpg?v=1689016014&width=533`,               stock:15, category:'activewear',  colours:['White'] },
    ],
  },
]

const FAQS = [
  { q:'Can I mix colours in a bundle?', a:'Yes! Contact us after placing your order and we\'ll swap the cap to your preferred colourway at no extra cost.' },
  { q:'Do bundle items ship together?', a:'Yes, all items in a bundle are packed and shipped together in one parcel.' },
  { q:'Are there additional school discounts?', a:'The Schoolboy Starter is already 33% off. For group orders of 10+ kits, email collide.sabre@gmail.com for further discounts.' },
]

const fmt = n => `R ${n.toLocaleString()}`

export default function Bundles() {
  const { addToCart } = useCart()
  const [added, setAdded] = useState({})
  const [faqOpen, setFaqOpen] = useState(null)

  function addBundle(bundle) {
    bundle.items.forEach(item => addToCart(item))
    setAdded(prev => ({ ...prev, [bundle.id]: true }))
    setTimeout(() => setAdded(prev => ({ ...prev, [bundle.id]: false })), 2500)
  }

  return (
    <div className="pt-14 min-h-screen bg-lavender">
      {/* Hero */}
      <div className="bg-navy py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] text-center">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Better Together</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight mb-4">Bundles & Kits</h1>
          <p className="text-white/50 text-lg max-w-md mx-auto mb-8">Save more when you buy together</p>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
            {['3 Bundles', 'Up to 33% Off', 'Ships Together'].map(s => (
              <span key={s} className="bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-white/70 font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bundles grid */}
      <div className="mx-auto max-w-[1200px] px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {BUNDLES.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="aspect-[3/2] overflow-hidden bg-lavender">
              <AppImage src={b.image} alt={b.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              {b.badge && <span className="inline-block bg-green/20 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">{b.badge}</span>}
              <h2 className="font-display font-extrabold text-xl text-navy mb-1">{b.name}</h2>
              <p className="text-navy/50 text-sm mb-4">{b.tagline}</p>

              {/* Item thumbnails */}
              <div className="flex gap-2 mb-3">
                {b.items.map(item => (
                  <AppImage key={item.id} src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-navy/10" />
                ))}
              </div>
              <ul className="text-xs text-navy/50 space-y-0.5 mb-4">
                {b.items.map(item => <li key={item.id}>· {item.name}</li>)}
              </ul>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display font-extrabold text-2xl text-navy">{fmt(b.bundlePrice)}</span>
                <span className="text-sm text-navy/30 line-through">{fmt(b.originalPrice)}</span>
                <span className="text-xs font-bold text-green-600 bg-green/15 px-2 py-0.5 rounded-full">Save {fmt(b.saving)}</span>
              </div>

              <button
                onClick={() => addBundle(b)}
                className={`w-full py-3 rounded-full font-semibold text-sm transition-colors ${added[b.id] ? 'bg-green text-navy' : 'bg-blue text-white hover:bg-blue-light'}`}
              >
                {added[b.id] ? '✓ Added to Cart!' : 'Add Bundle to Cart'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-[640px] px-6 pb-20">
        <h2 className="font-display font-bold text-xl text-navy mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-navy/8">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="font-medium text-navy text-sm">{faq.q}</span>
                <span className={`text-navy/40 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}>▾</span>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-navy/60 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
