import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import EditorialLookbook from '../components/EditorialLookbook'
import AthleteSpotlight from '../components/AthleteSpotlight'
import PressWall from '../components/PressWall'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/catalogue/ProductCard'
import AppImage from '../components/ui/AppImage'

const INTERVAL = 5000
const CDN = 'https://collidesport.co.za/cdn/shop/files'

export const DEFAULT_SLIDES = [
  {
    id: 0,
    heading: 'Play Hard with Collide Sport',
    sub: null,
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/Sabre_Sport_Banner_2_02d6cd8e-fd57-410e-baac-c9e18c9daaa4.jpg?v=1689090191&width=1920`,
    objectPosition: 'center center',
    gradient: 'from-navy-dark/75 via-navy-dark/40 to-transparent',
  },
  {
    id: 1,
    heading: 'Shop Scrum Caps',
    sub: 'Closed-cell foam design  |  Flexible & durable  |  Dual expansion technology',
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/Sabre_Sport_Banner_3_48fe279e-896b-4f4f-8ecc-42d42a6427a3.jpg?v=1689316782&width=1920`,
    objectPosition: 'center top',
    gradient: 'from-navy-dark/80 via-navy-dark/45 to-transparent',
  },
  {
    id: 2,
    heading: 'Unleash the Warrior',
    sub: 'Our most popular Tribal Cap',
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/2_4240e760-94b0-44bb-8213-0b752403e682.jpg?v=1715450720&width=1920`,
    objectPosition: 'center 30%',
    gradient: 'from-navy-dark/80 via-navy-dark/50 to-transparent',
    layout: 'split',
  },
  {
    id: 3,
    heading: 'Play Collide Sport',
    sub: 'Blue Camouflage Scrum Cap',
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/E3A94B05-ABD7-454F-B24A-B3E9FF34BAEA.jpg?v=1719767691&width=1920`,
    objectPosition: 'center 35%',
    gradient: 'from-navy-dark/80 via-navy-dark/45 to-transparent',
    layout: 'split',
  },
]

// 4 category tiles — 2×2 on mobile, 4-across on desktop
const CATEGORY_TILES = [
  {
    label: 'Scrum Caps',
    img: `${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533`,
    to: '/catalogue?categories=scrum-caps',
    objectPosition: 'center top',
  },
  {
    label: 'Premium Caps',
    img: `${CDN}/52E885BC-C2E8-4007-8B49-04A5AC567F56.jpg?v=1750614416&width=533`,
    to: '/catalogue?categories=premium-caps',
    objectPosition: 'center center',
  },
  {
    label: 'Activewear',
    img: `${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533`,
    to: '/catalogue?categories=activewear',
    objectPosition: 'center center',
  },
  {
    label: 'New Arrivals',
    img: `${CDN}/2_5983c119-b758-4faf-9162-85a5b20e170c.jpg?v=1779389799&width=533`,
    to: '/catalogue?badge=New',
    objectPosition: 'center center',
  },
]

const TRUST_SIGNALS = [
  { icon: 'shield', text: '5★ Rated on Takealot' },
  { icon: 'truck',  text: 'Free Delivery on R1 000+' },
  { icon: 'lock',   text: 'Secure Checkout' },
  { icon: 'refresh',text: '30-Day Returns' },
]

// Pull real product data so badges stay in sync with products.js
const FEATURED_IDS = [14, 11, 20, 22, 23, 19, 1, 15]
const FEATURED_PRODUCTS = FEATURED_IDS
  .map(id => PRODUCTS.find(p => p.id === id))
  .filter(Boolean)

const PHOTO_STRIP = [
  { src: `${CDN}/Sabre_Sport_Scrum_Cap_1.jpg?v=1690355694&width=800`,  alt: 'Scrum Cap in play 1' },
  { src: `${CDN}/Sabre_Sport_Scrum_Cap_3.jpg?v=1690355694&width=800`,  alt: 'Scrum Cap in play 2' },
  { src: `${CDN}/Sabre_Sport_Scrum_Cap_2.jpg?v=1690355694&width=800`,  alt: 'Scrum Cap in play 3' },
  { src: `${CDN}/Sabre_Sport_Scrum_Cap_5.jpg?v=1690355694&width=800`,  alt: 'Scrum Cap in play 4' },
  { src: `${CDN}/Warrior_and_Tribal_Cap_2.jpg?v=1724350156&width=800`, alt: 'Warrior and Tribal Caps' },
]

const FEATURES = [
  {
    title: 'Closed-cell foam design',
    desc: 'Provides maximum cranial comfort and protection during scrums and contact play.',
  },
  {
    title: 'Flexible & durable',
    desc: 'Remains flexible as well as durable to sit comfortably on all head shapes and sizes.',
  },
  {
    title: 'Dual expansion foam technology',
    desc: 'Uses dual expansion foam technology for superior impact absorption on the field.',
  },
]

const TESTIMONIALS = [
  { name: 'HE',       text: 'Fits perfectly, looks great and serves its purpose well.' },
  { name: 'Cristelle',text: 'Very happy with this product and sizing is good. Quality is great.' },
  { name: 'Chad',     text: 'Helping me so much from not getting another concussion.' },
]

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function TrustIcon({ type }) {
  if (type === 'shield') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
  if (type === 'truck') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
  if (type === 'lock') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  )
}


export default function Home({ slides = DEFAULT_SLIDES }) {
  const SLIDES = slides
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setDir(1)
      setCurrent(c => (c + 1) % SLIDES.length)
    }, INTERVAL)
  }, [SLIDES.length])

  const goTo = useCallback((i) => {
    setDir(i > current ? 1 : -1)
    setCurrent(i)
    resetTimer()
  }, [current, resetTimer])

  const next = useCallback(() => {
    setDir(1)
    setCurrent(c => (c + 1) % SLIDES.length)
    resetTimer()
  }, [resetTimer])

  const prev = useCallback(() => {
    setDir(-1)
    setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  const slide = SLIDES[current]

  return (
    <>
      {/* ── Hero Slideshow ── */}
      <section className="relative h-screen min-h-[600px] bg-navy-dark overflow-hidden">

        {/* Slide background */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${current}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {slide.layout === 'split' ? (
              /* ── Split layout: navy panel left + product fully visible right ── */
              <div className="absolute inset-0 flex">
                <div className="w-full lg:w-1/2 bg-navy-dark flex-shrink-0" />
                {/* Desktop right panel: object-contain so cap is never cropped */}
                <motion.div
                  className="hidden lg:flex flex-1 items-center justify-center bg-navy relative overflow-hidden"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                >
                  <AppImage
                    src={slide.img}
                    alt={slide.heading}
                    className="w-full h-full object-contain p-8"
                    style={{ objectPosition: slide.objectPosition || 'center center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-navy/30 pointer-events-none" />
                </motion.div>
                {/* Mobile fallback: object-contain with dark bg so cap still shows in full */}
                <div className="lg:hidden absolute inset-0 bg-navy-dark flex items-center justify-center">
                  <AppImage
                    src={slide.img}
                    alt={slide.heading}
                    className="w-full h-full object-contain"
                    style={{ objectPosition: slide.objectPosition || 'center center' }}
                  />
                  <div className="absolute inset-0 bg-navy-dark/60" />
                </div>
              </div>
            ) : (
              /* ── Full-bleed for wide banner images ── */
              <>
                <motion.img
                  src={slide.img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: slide.objectPosition || 'center center' }}
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient || 'from-navy-dark/80 via-navy-dark/45 to-transparent'}`} />
              </>
            )}
            {/* Bottom fade for dots readability */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-dark/70 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Slide text */}
        <div className="relative h-full flex items-center z-10">
          <motion.div
            key={current}
            className={`w-full px-6 lg:px-16 ${slide.layout === 'split' ? 'lg:max-w-[50%]' : 'mx-auto max-w-[1440px]'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="font-display font-black text-[clamp(2.2rem,6vw,5rem)] leading-[0.95] text-white tracking-tighter uppercase max-w-2xl mb-4">
              {slide.heading}
            </h1>
            {slide.sub && (
              <p className="text-white/70 text-base lg:text-xl max-w-lg leading-relaxed mb-8">
                {slide.sub}
              </p>
            )}
            {!slide.sub && <div className="mb-8" />}
            <Link
              to={slide.cta.to}
              className="inline-block bg-gold text-navy-dark font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-gold-dim transition-colors"
            >
              {slide.cta.label} →
            </Link>

            {/* Centred page nav — visible on all sizes */}
            <div className="flex items-center gap-8 mt-10">
              {[{ label: 'Shop', to: '/catalogue' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-white/70 hover:text-white font-black uppercase tracking-widest text-xs border-b border-white/20 hover:border-white pb-0.5 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:border-white/60 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:border-white/60 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <ChevronRight />
        </button>

        {/* Dots + counter — wrapped in larger touch targets for mobile */}
        <div className="absolute bottom-8 left-0 right-0 px-6 lg:px-16 max-w-[1440px] mx-auto flex items-center justify-between z-20">
          <span className="font-mono text-white/40 text-sm tabular-nums select-none">
            {current + 1} / {SLIDES.length}
          </span>
          <div className="flex items-center gap-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="p-2 -m-2 flex items-center justify-center"
              >
                <span className={`block h-[3px] rounded-full transition-all duration-300 ${
                  i === current ? 'bg-blue w-8' : 'bg-white/30 w-4 hover:bg-white/50'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Floating Trust Signals Strip ── */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-4 lg:gap-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 shadow-xl overflow-x-auto max-w-full"
          >
            {TRUST_SIGNALS.map(({ icon, text }, i) => (
              <div key={text} className="flex items-center gap-2 flex-shrink-0">
                {i > 0 && <span className="hidden sm:block w-px h-4 bg-white/20 mr-2" />}
                <span className="text-green"><TrustIcon type={icon} /></span>
                <span className="text-[11px] lg:text-xs font-semibold text-white whitespace-nowrap">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
          <motion.div
            key={current}
            className="h-full bg-blue"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
          />
        </div>
      </section>

      {/* ── Trust Signals Strip — desktop row + mobile marquee ── */}
      <div className="sticky top-14 z-30 bg-navy text-white border-b border-white/5 overflow-hidden">
        <div className="hidden lg:flex mx-auto max-w-[1440px] px-12 py-2.5 items-center justify-center gap-12">
          {TRUST_SIGNALS.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span className="text-green"><TrustIcon type={icon} /></span>
              <span className="text-xs font-medium text-white/80 whitespace-nowrap">{text}</span>
            </div>
          ))}
        </div>
        <div className="lg:hidden py-2.5">
          <div className="animate-marquee flex gap-10 whitespace-nowrap w-max">
            {[...TRUST_SIGNALS, ...TRUST_SIGNALS].map(({ icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <span className="text-green"><TrustIcon type={icon} /></span>
                <span className="text-[11px] font-medium text-white/80">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Tiles ── */}
      <section className="py-12 lg:py-16 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <h2 className="font-display font-black text-2xl lg:text-3xl text-navy tracking-tighter uppercase mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {CATEGORY_TILES.map(({ label, img, to, objectPosition }) => (
              <Link key={label} to={to} className="group relative aspect-square rounded-2xl overflow-hidden">
                <AppImage
                  src={img}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: objectPosition || 'center center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                  <h3 className="font-display font-extrabold text-base lg:text-lg text-white leading-tight">{label}</h3>
                  <span className="text-white/60 text-xs font-medium group-hover:text-white transition-colors">Shop now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──
          Pulls from real product data so badges (New/Premium/Low Stock) display correctly.
          Quick Shop overlay on hover/focus. 2-col mobile, 4-col desktop. ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex items-end justify-between mb-8 lg:mb-10">
            <h2 className="font-display font-black text-2xl lg:text-4xl text-navy tracking-tighter uppercase">
              Featured Scrum Caps
            </h2>
            <Link to="/catalogue" className="text-sm text-blue font-semibold hover:text-blue-light transition-colors whitespace-nowrap ml-4">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
            {FEATURED_PRODUCTS.map((p, i) => (
              <ProductCard
                key={p.id}
                image={p.image}
                name={p.name}
                price={p.price}
                salePrice={p.salePrice}
                inStock={p.stock > 0}
                slug={String(p.id)}
                badge={p.badge}
                colours={p.colours}
                category={p.category}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Strip — scrolling lifestyle shots ── */}
      <div className="bg-navy-dark overflow-x-auto scrollbar-none">
        <div className="flex gap-1 w-max">
          {PHOTO_STRIP.map(({ src, alt }) => (
            <div key={alt} className="w-56 sm:w-72 h-64 sm:h-80 flex-shrink-0 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <AppImage src={src} alt={alt} className="w-full h-full object-cover" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Up Your Game ── */}
      <section className="py-16 lg:py-24 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <h2 className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tighter uppercase mb-4">
            Up your game
          </h2>
          <p className="text-navy/60 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Technical, comfortable and durable scrum caps. Designed for rugby players who demand the best protection on the field.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/catalogue?categories=scrum-caps"
              className="bg-blue text-white font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-blue-light transition-colors"
            >
              Explore Scrum Caps
            </Link>
            <Link
              to="/catalogue?categories=activewear"
              className="border-2 border-navy/15 text-navy font-semibold px-8 py-3.5 rounded-full hover:border-navy/30 transition-colors"
            >
              Explore Activewear
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scrum Caps to Keep You Safe ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Protection</p>
            <h2 className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tighter uppercase">
              Scrum Caps to Keep You Safe
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ title, desc }) => (
              <div key={title} className="bg-lavender rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{title}</h3>
                <p className="text-sm text-navy/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Feature Strips ── */}
      <section className="bg-navy-dark overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          <div className="flex items-center justify-center p-10 lg:p-16">
            <div>
              <h2 className="font-display font-black text-3xl lg:text-4xl text-white tracking-tighter uppercase mb-4">Tribal Scrum Cap</h2>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-8">
                Flexible as well as durable to sit comfortably on all head shapes. Our most popular cap — stand out on the field of play.
              </p>
              <Link to="/catalogue" className="inline-block bg-gold text-navy-dark font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-gold-dim transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="bg-lavender">
            <AppImage src={`${CDN}/TribelLeft.jpg?v=1696703994&width=800`} alt="Tribal Scrum Cap" className="w-full h-full object-cover min-h-[300px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          <div className="bg-lavender order-2 lg:order-1">
            <AppImage src={`${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=800`} alt="Compression Top" className="w-full h-full object-cover min-h-[300px]" />
          </div>
          <div className="flex items-center justify-center p-10 lg:p-16 order-1 lg:order-2">
            <div>
              <h2 className="font-display font-black text-3xl lg:text-4xl text-white tracking-tighter uppercase mb-4">Compression Tops</h2>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-8">
                Available in White and Black. Designed for comfort and performance during training and match day.
              </p>
              <Link to="/catalogue" className="inline-block bg-gold text-navy-dark font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-gold-dim transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          <div className="flex items-center justify-center p-10 lg:p-16">
            <div>
              <h2 className="font-display font-black text-3xl lg:text-4xl text-white tracking-tighter uppercase mb-4">Warrior Scrum Cap</h2>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-8">
                Score tries under the defence's radar in our warrior scrum cap. Built for players who give everything on the field.
              </p>
              <Link to="/catalogue" className="inline-block bg-gold text-navy-dark font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-gold-dim transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="bg-lavender">
            <AppImage src={`${CDN}/Warrior_Scrum_Cap.jpg?v=1724349324&width=800`} alt="Warrior Scrum Cap" className="w-full h-full object-cover min-h-[300px]" />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 lg:py-24 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <h2 className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tighter uppercase">
              5-Star Rated on Takealot
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, text }) => (
              <div key={name} className="bg-white rounded-2xl p-8 border border-navy/5">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="text-navy/70 text-sm leading-relaxed mb-5">"{text}"</p>
                <p className="font-display font-bold text-navy text-sm">— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Get Your Head in the Game" immersive banner ── */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <AppImage
          src={`${CDN}/Sabre_Sport_Banner_1.jpg?v=1689080131&width=1920`}
          alt="Get your head in the game"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-dark/65" />
        <div className="relative flex items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-xs text-gold uppercase tracking-widest mb-4">Trusted by Players Across SA</p>
            <h2 className="font-display font-black text-[clamp(2rem,6vw,4.5rem)] text-white tracking-tighter uppercase leading-[0.95] mb-8">
              Get Your Head<br />in the Game
            </h2>
            <Link
              to="/catalogue"
              className="inline-block bg-gold text-navy-dark font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-gold-dim transition-colors"
            >
              Shop Now →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Editorial Lookbook ── */}
      <EditorialLookbook />

      {/* ── Athlete Spotlight ── */}
      <AthleteSpotlight />

      {/* ── Press Wall ── */}
      <PressWall />

      {/* ── CTA — pb-20 on mobile clears the fixed MobileBottomBar ── */}
      <section className="bg-navy py-16 lg:py-24 relative overflow-hidden pb-20 lg:pb-24">
        <div className="absolute inset-0 diagonal-line opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5rem)] text-white tracking-tighter leading-[0.95] uppercase mb-4">
            Gear Up with Collide Sport
          </h2>
          <p className="text-white/50 text-lg max-w-md mx-auto mb-10">
            Premium rugby scrum caps and activewear. Designed in South Africa, built for the field.
          </p>
          <Link
            to="/catalogue"
            className="inline-block bg-gold text-navy-dark font-black uppercase tracking-widest text-sm px-10 py-4 hover:bg-gold-dim transition-colors"
          >
            Shop Now →
          </Link>
        </div>
      </section>
    </>
  )
}
