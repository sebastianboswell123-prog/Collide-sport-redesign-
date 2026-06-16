import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import AppImage from './ui/AppImage'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

function CountUp({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(target)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

function WipeImage({ src, alt, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
      transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      <AppImage src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  )
}

const MOSAIC = [
  {
    src: `${CDN}/Warrior_and_Tribal_Cap_2.jpg?v=1724350156&width=800`,
    alt: 'Warrior and Tribal Caps',
    label: 'Warrior Series',
  },
  {
    src: `${CDN}/DSC3288_1__Original.jpg?v=1734264287&width=800`,
    alt: 'Dark Blue Camo Scrum Cap',
    label: 'Camo Range',
  },
  {
    src: `${CDN}/Sabre_Sport_Scrum_Cap_2.jpg?v=1690355694&width=800`,
    alt: 'Scrum Cap Detail',
    label: 'Premium Build',
  },
]

export default function EditorialLookbook() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    <section className="overflow-hidden">
      {/* Block 1 — Parallax hero: real team in action */}
      <div ref={heroRef} className="relative h-[70vh] overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <AppImage
            src={`${CDN}/29544158-Large-Digital-Photo-Download-3428x2285.jpg?v=1744747280&width=2880`}
            alt="Collide Sport player in action"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080f2e]/80 via-[#080f2e]/30 to-transparent" />

        <div className="absolute top-8 right-8 font-mono text-xs text-white/40 tracking-widest uppercase">
          Collide Sport / SS26 Collection
        </div>

        <div className="absolute bottom-10 left-0 right-0 px-8 lg:px-16 max-w-[900px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display font-extrabold italic text-3xl lg:text-5xl text-white leading-[1.1]"
          >
            "Rugby is not just a sport.<br />It's who we are."
          </motion.p>
        </div>
      </div>

      {/* Block 2 — Two column with wipe image: editorial DSC shot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] bg-[#080f2e]">
        <WipeImage
          src={`${CDN}/DSC7768_1.png?v=1724141496&width=800`}
          alt="Tribal cap editorial shot"
          className="min-h-[300px] lg:min-h-full"
        />
        <div className="flex items-center justify-center p-12 lg:p-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs text-[#4770db] tracking-widest uppercase mb-4">The Warrior Series</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-white leading-[1.1] mb-6">
              Crafted for those who<br />play without compromise.
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm">
              Every cap engineered with closed-cell foam and dual-expansion padding to keep you protected from first whistle to final siren.
            </p>
            <Link to="/catalogue" className="text-[#47db71] font-semibold hover:text-[#3bc260] transition-colors">
              Shop the Collection →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Block 3 — Quote bar with count-up */}
      <div className="bg-[#4770db] py-20 text-center px-6">
        <motion.p
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-extrabold italic text-2xl lg:text-4xl text-white max-w-3xl mx-auto leading-[1.2]"
        >
          "<CountUp target={5000} /> players. One mission. Protect the game."
        </motion.p>
      </div>

      {/* Block 4 — 3-column photo mosaic */}
      <div className="bg-navy-dark py-3 px-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        {MOSAIC.map(({ src, alt, label }, i) => (
          <motion.div
            key={alt}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="group relative overflow-hidden aspect-[4/5]"
          >
            <AppImage
              src={src}
              alt={alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-gold">{label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
