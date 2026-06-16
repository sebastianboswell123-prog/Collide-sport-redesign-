import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SCHOOLS = [
  { name:'Bishops', color:'#1a3a5c' },
  { name:'Paul Roos', color:'#8B0000' },
  { name:'Grey College', color:'#1B4F72' },
  { name:'Paarl Gim', color:'#0B5394' },
  { name:'Boland', color:'#2E4057' },
  { name:'WP Academy', color:'#003082' },
  { name:'Sharks Acad', color:'#0b5394' },
  { name:'Bulls Acad', color:'#1a3a6c' },
]

const STATS = [
  { value: '150+', label: 'Schools' },
  { value: '8', label: 'Provinces' },
  { value: '5K+', label: 'Players' },
]

export default function PressWall() {
  const doubled = [...SCHOOLS, ...SCHOOLS]

  return (
    <section className="py-16 lg:py-24 bg-lavender overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Trusted By</p>
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight mb-3">
            South Africa's Best Rugby Schools & Academies
          </h2>
          <p className="text-navy/50 text-base max-w-xl mx-auto">
            From school fields to provincial academies — Collide Sport protects the next generation of South African rugby.
          </p>
        </div>

        {/* Marquee row 1 — left */}
        <div className="overflow-hidden mb-3">
          <div className="animate-marquee flex gap-4 whitespace-nowrap w-max">
            {doubled.map((s, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: s.color }}
              >
                <span className="text-white font-bold text-[9px] text-center leading-tight px-1">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee row 2 — right (reversed) */}
        <div className="overflow-hidden mb-12">
          <div className="flex gap-4 whitespace-nowrap w-max" style={{ animation: 'marquee 40s linear infinite reverse' }}>
            {doubled.map((s, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: s.color }}
              >
                <span className="text-white font-bold text-[9px] text-center leading-tight px-1">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 mb-10">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display font-extrabold text-4xl text-navy">{value}</p>
              <p className="text-navy/50 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center">
          <Link to="/contact" className="text-blue font-semibold text-sm hover:text-blue-light transition-colors">
            Is your school not listed? Get in touch →
          </Link>
        </p>
      </div>
    </section>
  )
}
