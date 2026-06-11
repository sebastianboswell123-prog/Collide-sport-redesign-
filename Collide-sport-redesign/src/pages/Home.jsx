import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const INTERVAL = 5000

const SLIDES = [
  {
    id: 0,
    eyebrow: 'NOW IN BETA',
    lines: ['SPORT IS', 'BETTER', 'TOGETHER.'],
    accent: 1,
    sub: 'Collide connects players, coaches, and teams on one platform — scheduling, stats, and community built for how sport actually works.',
    cta: { label: 'Get Started Free', to: '/join' },
    cta2: { label: 'See Features', to: '/features' },
    bg: 'linear-gradient(135deg, #080f2e 0%, #0e1b4d 100%)',
    stroke: 'text-stroke-blue',
    glowA: 'rgba(71,112,219,0.13)',
    glowB: 'rgba(71,219,113,0.09)',
  },
  {
    id: 1,
    eyebrow: 'FEATURED PRODUCT',
    lines: ['PLAY HARD', 'WITH', 'COLLIDE SPORT.'],
    accent: 2,
    sub: 'Closed-cell foam design · Flexible & durable · Dual expansion technology',
    cta: { label: 'Shop Now', to: '/catalogue' },
    bg: 'linear-gradient(135deg, #030b1c 0%, #0b1a3e 100%)',
    stroke: 'text-stroke-green',
    glowA: 'rgba(71,219,113,0.13)',
    glowB: 'rgba(71,112,219,0.09)',
  },
  {
    id: 2,
    eyebrow: 'TRIBAL RUGBY CAP',
    lines: ['UNLEASH', 'THE', 'WARRIOR.'],
    accent: 0,
    sub: 'Our most popular Tribal Cap — built for players who give everything on the field.',
    cta: { label: 'Shop Now', to: '/catalogue' },
    bg: 'linear-gradient(135deg, #0a1535 0%, #1a2a6e 100%)',
    stroke: 'text-stroke-blue',
    glowA: 'rgba(71,112,219,0.18)',
    glowB: 'rgba(71,219,113,0.08)',
  },
  {
    id: 3,
    eyebrow: 'NEW ARRIVAL',
    lines: ['BLUE', 'CAMOUFLAGE', 'CAP.'],
    accent: 1,
    sub: 'The latest addition to the Collide Sport lineup — bold camo style meets elite protection.',
    cta: { label: 'Shop Now', to: '/catalogue' },
    bg: 'linear-gradient(135deg, #04102e 0%, #0e1b4d 100%)',
    stroke: 'text-stroke-green',
    glowA: 'rgba(71,112,219,0.10)',
    glowB: 'rgba(71,219,113,0.14)',
  },
  {
    id: 4,
    type: 'video',
    eyebrow: 'WATCH THE ACTION',
    lines: ['FEEL THE', 'COLLIDE', 'DIFFERENCE.'],
    accent: 1,
    sub: 'Rugby. Built different. Gear that keeps up with every tackle, sprint, and scrum.',
    cta: { label: 'Shop Now', to: '/catalogue' },
    cta2: { label: 'See Features', to: '/features' },
    // ← Swap this URL for your own video — or drop hero-video.mp4 into /public and use '/hero-video.mp4'
    videoSrc: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    bg: 'linear-gradient(135deg, #040c20 0%, #0b1840 100%)',
    stroke: 'text-stroke-blue',
    glowA: 'rgba(71,112,219,0.20)',
    glowB: 'rgba(71,219,113,0.12)',
  },
]

const STATS = [
  { value: '12K+', label: 'Active Players' },
  { value: '850+', label: 'Teams' },
  { value: '3.2K', label: 'Games Played' },
  { value: '98%', label: 'Satisfaction' },
]

const MARQUEE_ITEMS = ['Play Hard', 'Train Smart', 'Win Together', 'Level Up', 'Stay Ready']

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

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)

  const goTo = useCallback((i) => {
    setDir(i > current ? 1 : -1)
    setCurrent(i)
  }, [current])

  const next = useCallback(() => {
    setDir(1)
    setCurrent(c => (c + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setDir(-1)
    setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [next])

  const slide = SLIDES[current]

  return (
    <>
      {/* ── Hero Slideshow ── */}
      <section className="relative min-h-screen bg-[#080f2e] overflow-hidden flex flex-col">

        {/* Per-slide background (fades between slides) */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${current}`}
            className="absolute inset-0"
            style={{ background: slide.bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {slide.type === 'video' && slide.videoSrc ? (
              <>
                {/* Full-bleed video background */}
                <video
                  key={slide.videoSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={slide.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                {/* Dark navy overlay so text stays readable */}
                <div className="absolute inset-0 bg-[#040c20]/75" />
              </>
            ) : (
              <>
                {/* Glow blobs for non-video slides */}
                <div
                  className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none"
                  style={{ background: slide.glowA }}
                />
                <div
                  className="absolute bottom-1/3 right-1/4 w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none"
                  style={{ background: slide.glowB }}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* ── Slide content ── */}
        <div className="relative flex-1 flex items-center pt-20 min-h-[520px] lg:min-h-[540px]">
          <motion.div
            key={current}
            className="w-full mx-auto max-w-[1440px] px-6 lg:px-16 py-12"
            initial={{ opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
              {/* Eyebrow badge */}
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/70 font-mono tracking-wider mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-glow" />
                {slide.eyebrow}
              </span>

              {/* Heading */}
              <h1 className="font-display font-extrabold text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.95] tracking-tight mb-6">
                {slide.lines.map((line, i) => (
                  <span
                    key={i}
                    className={`block ${i === slide.accent ? slide.stroke : 'text-white'}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>

              {/* Subtext */}
              <p className="text-white/50 text-lg max-w-md leading-relaxed mb-10">
                {slide.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={slide.cta.to}
                  className="bg-blue text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-light transition-colors"
                >
                  {slide.cta.label}
                </Link>
                {slide.cta2 && (
                  <Link
                    to={slide.cta2.to}
                    className="border border-white/20 text-white/70 font-semibold px-8 py-4 rounded-full hover:border-white/40 hover:text-white transition-colors"
                  >
                    {slide.cta2.label}
                  </Link>
                )}
              </div>
            </motion.div>
        </div>

        {/* ── Stats row ── */}
        <div className="relative mx-auto max-w-[1440px] w-full px-6 lg:px-16 pb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="border-l-2 border-blue/20 pl-5"
              >
                <div className="font-display font-extrabold text-4xl text-white">{value}</div>
                <div className="text-sm text-white/40 mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Prev / Next arrows ── */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronRight />
        </button>

        {/* ── Slide counter + dot navigation ── */}
        <div className="absolute bottom-5 left-0 right-0 px-6 lg:px-16 max-w-[1440px] mx-auto flex items-center justify-between z-20">
          <span className="font-mono text-white/35 text-sm tabular-nums select-none">
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === current ? 'bg-blue w-8' : 'bg-white/25 w-4 hover:bg-white/45'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Auto-play progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 z-20">
          <motion.div
            key={current}
            className="h-full bg-blue/60"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
          />
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="bg-blue py-4 overflow-hidden">
        <div className="animate-marquee flex gap-12 whitespace-nowrap w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={`${item}-${i}`} className="font-display font-extrabold text-white text-xl tracking-widest uppercase">
              {item} <span className="text-white/30 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Features teaser ── */}
      <section className="py-24 lg:py-32 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Platform</p>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-navy tracking-tight">
              Everything your team needs.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Smart Scheduling', desc: "Auto-generate fixtures around your squad's availability." },
              { title: 'Player Profiles', desc: 'Track stats, form, and history across every session.' },
              { title: 'Live Events', desc: 'Stream updates, scores, and highlights as they happen.' },
              { title: 'Coach Tools', desc: 'Drill boards, session plans, and performance insights.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-navy/5 hover:shadow-lg hover:shadow-navy/5 transition-shadow group">
                <div className="w-10 h-10 rounded-xl bg-blue/10 mb-5 group-hover:bg-blue/15 transition-colors" />
                <h3 className="font-display font-bold text-lg text-navy mb-2">{title}</h3>
                <p className="text-sm text-navy/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/features" className="inline-flex items-center gap-2 text-blue font-semibold hover:text-blue-light transition-colors">
              Explore all features →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-line opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <h2 className="font-display font-extrabold text-[clamp(2.8rem,8vw,5.5rem)] text-white tracking-tight leading-[0.95] mb-6">
            READY TO<br />COLLIDE?
          </h2>
          <p className="text-white/50 text-lg max-w-sm mx-auto mb-10">
            Join thousands of players and coaches already on the platform.
          </p>
          <Link
            to="/join"
            className="inline-block bg-green text-navy font-extrabold px-10 py-4 rounded-full hover:bg-green-dim transition-colors"
          >
            Join for Free
          </Link>
        </div>
      </section>
    </>
  )
}
