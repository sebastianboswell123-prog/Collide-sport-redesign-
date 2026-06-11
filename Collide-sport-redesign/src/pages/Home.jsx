import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const INTERVAL = 5000
const CDN = 'https://collidesport.co.za/cdn/shop/files'

const SLIDES = [
  {
    id: 0,
    heading: 'Play Hard with Collide Sport',
    sub: null,
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/Sabre_Sport_Banner_2_02d6cd8e-fd57-410e-baac-c9e18c9daaa4.jpg?v=1689090191&width=1920`,
  },
  {
    id: 1,
    heading: 'Shop Scrum Caps',
    sub: 'Closed-cell foam design  |  Flexible & durable  |  Dual expansion technology',
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/Sabre_Sport_Banner_3_48fe279e-896b-4f4f-8ecc-42d42a6427a3.jpg?v=1689316782&width=1920`,
  },
  {
    id: 2,
    heading: 'Unleash the Warrior',
    sub: 'Our most popular Tribal Cap',
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/2_4240e760-94b0-44bb-8213-0b752403e682.jpg?v=1715450720&width=1920`,
  },
  {
    id: 3,
    heading: 'Play Collide Sport',
    sub: 'Blue Camouflage Scrum Cap',
    cta: { label: 'Shop Now', to: '/catalogue' },
    img: `${CDN}/E3A94B05-ABD7-454F-B24A-B3E9FF34BAEA.jpg?v=1719767691&width=1920`,
  },
]

const FEATURED_PRODUCTS = [
  { name: 'Rugby Scrum Cap — Turquoise/White', price: 550, img: `${CDN}/ScrumCap-Turquoise_White.jpg?v=1689063382&width=533`, to: '/catalogue' },
  { name: 'Rugby Scrum Cap — Navy/Gold', price: 550, img: `${CDN}/ScrumCap-Navy_Gold.jpg?v=1689063348&width=533`, to: '/catalogue' },
  { name: 'Rugby Scrum Cap — Black/Grey', price: 550, img: `${CDN}/ScrumCap-Black_Grey.jpg?v=1689232549&width=533`, to: '/catalogue' },
  { name: 'Rugby Scrum Cap — Black', price: 550, img: `${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533`, to: '/catalogue' },
  { name: 'White Tribal Rugby Scrum Cap', price: 550, img: `${CDN}/TribelLeft.jpg?v=1696703994&width=533`, to: '/catalogue' },
  { name: 'Warrior Scrum Cap', price: 550, img: `${CDN}/Warrior_Scrum_Cap.jpg?v=1724349324&width=533`, to: '/catalogue' },
  { name: 'Rugby Scrum Cap — Royal Blue/Black', price: 550, img: `${CDN}/ScrumCap-RoyalBlue_Black_1.jpg?v=1689015686&width=533`, to: '/catalogue' },
  { name: 'Rugby Scrum Cap — Blue & White Camo', price: 550, img: `${CDN}/PHOTO-2023-09-22-12-03-492.jpg?v=1696703796&width=533`, to: '/catalogue' },
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
  { name: 'HE', text: 'Fits perfectly, looks great and serves its purpose well.' },
  { name: 'Cristelle', text: 'Very happy with this product and sizing is good. Quality is great.' },
  { name: 'Chad', text: 'Helping me so much from not getting another concussion.' },
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

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setDir(1)
      setCurrent(c => (c + 1) % SLIDES.length)
    }, INTERVAL)
  }, [])

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
      <section className="relative h-[85vh] min-h-[500px] max-h-[800px] bg-navy-dark overflow-hidden">

        {/* Slide background image */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${current}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={slide.img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/80 via-navy-dark/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide content */}
        <div className="relative h-full flex items-center z-10">
          <motion.div
            key={current}
            className="mx-auto max-w-[1440px] w-full px-6 lg:px-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h1 className="font-display font-extrabold text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] text-white tracking-tight max-w-2xl mb-4">
              {slide.heading}
            </h1>

            {slide.sub && (
              <p className="text-white/70 text-lg lg:text-xl max-w-lg leading-relaxed mb-8">
                {slide.sub}
              </p>
            )}

            {!slide.sub && <div className="mb-8" />}

            <Link
              to={slide.cta.to}
              className="inline-block bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors"
            >
              {slide.cta.label}
            </Link>
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

        {/* Slide counter + dots */}
        <div className="absolute bottom-6 left-0 right-0 px-6 lg:px-16 max-w-[1440px] mx-auto flex items-center justify-between z-20">
          <span className="font-mono text-white/40 text-sm tabular-nums select-none">
            {current + 1} / {SLIDES.length}
          </span>
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === current ? 'bg-blue w-8' : 'bg-white/30 w-4 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
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

      {/* ── Featured Products ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight mb-10 text-center">
            Featured Scrum Caps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {FEATURED_PRODUCTS.map((p) => (
              <Link key={p.name} to={p.to} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-lavender mb-3">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-display font-semibold text-sm text-navy leading-snug mb-1">{p.name}</h3>
                <p className="text-blue font-bold text-sm">R {p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/catalogue" className="inline-flex items-center gap-2 text-blue font-semibold hover:text-blue-light transition-colors">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Up Your Game ── */}
      <section className="py-16 lg:py-24 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight mb-4">
            Up your game
          </h2>
          <p className="text-navy/60 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Technical, comfortable and durable scrum caps. Designed for rugby players who demand the best protection on the field.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/catalogue"
              className="bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors"
            >
              Explore Scrum Caps
            </Link>
            <Link
              to="/catalogue"
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
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">
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
        {/* Tribal Scrum Cap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          <div className="flex items-center justify-center p-10 lg:p-16">
            <div>
              <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-white tracking-tight mb-4">
                Tribal Scrum Cap
              </h2>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-8">
                Flexible as well as durable to sit comfortably on all head shapes. Our most popular cap — stand out on the field of play.
              </p>
              <Link to="/catalogue" className="inline-block bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="bg-lavender">
            <img
              src={`${CDN}/TribelLeft.jpg?v=1696703994&width=800`}
              alt="Tribal Scrum Cap"
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
        </div>

        {/* Compression Tops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          <div className="bg-lavender order-2 lg:order-1">
            <img
              src={`${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=800`}
              alt="Compression Top — Black"
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
          <div className="flex items-center justify-center p-10 lg:p-16 order-1 lg:order-2">
            <div>
              <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-white tracking-tight mb-4">
                Compression Tops
              </h2>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-8">
                Available in White and Black. Designed for comfort and performance during training and match day.
              </p>
              <Link to="/catalogue" className="inline-block bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Warrior Scrum Cap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          <div className="flex items-center justify-center p-10 lg:p-16">
            <div>
              <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-white tracking-tight mb-4">
                Warrior Scrum Cap
              </h2>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-8">
                Score tries under the defence's radar in our warrior scrum cap. Built for players who give everything on the field.
              </p>
              <Link to="/catalogue" className="inline-block bg-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-blue-light transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="bg-lavender">
            <img
              src={`${CDN}/Warrior_Scrum_Cap.jpg?v=1724349324&width=800`}
              alt="Warrior Scrum Cap"
              className="w-full h-full object-cover min-h-[300px]"
            />
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
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">
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

      {/* ── CTA ── */}
      <section className="bg-navy py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-line opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <h2 className="font-display font-extrabold text-[clamp(2rem,6vw,4rem)] text-white tracking-tight leading-[1.05] mb-4">
            Gear Up with Collide Sport
          </h2>
          <p className="text-white/50 text-lg max-w-md mx-auto mb-10">
            Premium rugby scrum caps and activewear. Designed in South Africa, built for the field.
          </p>
          <Link
            to="/catalogue"
            className="inline-block bg-green text-navy font-extrabold px-10 py-4 rounded-full hover:bg-green-dim transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  )
}
