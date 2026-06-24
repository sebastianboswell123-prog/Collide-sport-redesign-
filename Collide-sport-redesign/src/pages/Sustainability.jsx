import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

function CountUp({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 2000
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(target)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

const MATERIALS = [
  { title:'Closed-Cell EVA Foam', desc:'Recyclable. No harmful plasticisers. Sourced from certified suppliers worldwide.', icon:'🟢' },
  { title:'Lycra & Stretch Fabric', desc:'Durable enough to last seasons, reducing waste from frequent replacement.', icon:'🔵' },
  { title:'Polyester Shell', desc:'Lightweight, UV-resistant, and long-lasting — reducing the need for frequent replacement.', icon:'⚪' },
]

const COMMITMENTS = [
  { title:'Recycling Programme', desc:'Send back your old cap, get 10% off your next purchase. We handle the rest.', icon:'♻️' },
  { title:'School Donations', desc:'5% of all profits go to underfunded school rugby programmes across South Africa.', icon:'🏫' },
  { title:'Local Manufacturing', desc:'Proudly South African. We support local jobs and keep production close to home.', icon:'🇿🇦' },
  { title:'Minimal Packaging', desc:'Recyclable mailers, no plastic fillers, and right-sized boxes to reduce waste.', icon:'📦' },
]

export default function Sustainability() {
  const [form, setForm] = useState({ name:'', email:'', cap:'' })
  const [registered, setRegistered] = useState(false)

  function handleRegister(e) {
    e.preventDefault()
    try { const list = JSON.parse(localStorage.getItem('collide_recycle') || '[]'); list.push(form); localStorage.setItem('collide_recycle', JSON.stringify(list)) } catch { /* ignore */ }
    setRegistered(true)
  }

  return (
    <div className="pt-14 min-h-screen">
      {/* Hero */}
      <section className="bg-[#0a2d1b] py-24 lg:py-36 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'repeating-linear-gradient(-45deg,transparent,transparent 4px,rgba(71,219,113,0.1) 4px,rgba(71,219,113,0.1) 5px)' }} />
        <div className="relative mx-auto max-w-[1440px] lg:px-12">
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <p className="text-xs font-mono tracking-widest text-green uppercase mb-4">Sustainability</p>
            <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-[0.95] mb-6">
              Play Hard,<br />Tread Lightly.
            </h1>
            <p className="text-white/50 text-lg max-w-xl leading-relaxed">
              We believe protecting players and protecting the planet aren't mutually exclusive. Here's how we're building a more sustainable rugby brand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-green-700 uppercase mb-3">What We Use</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">Materials Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MATERIALS.map(({ title, desc, icon }, i) => (
              <motion.div key={title} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.1 }} className="bg-[#f0faf4] rounded-2xl p-8">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">{title}</h3>
                <p className="text-navy/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 lg:py-28 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-green-700 uppercase mb-3">Our Commitments</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">How We Give Back</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMMITMENTS.map(({ title, desc, icon }, i) => (
              <motion.div key={title} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.08 }} className="bg-white rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display font-bold text-navy mb-2">{title}</h3>
                <p className="text-navy/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact counters */}
      <section className="py-20 bg-[#0a2d1b] text-white text-center">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <h2 className="font-display font-extrabold text-3xl text-white mb-12">Our Impact So Far</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { target:1200, suffix:' caps', label:'Caps Recycled' },
              { target:45000, prefix:'R', label:'Donated to Schools' },
              { target:12, label:'Local Jobs Supported' },
            ].map(({ target, suffix='', prefix='', label }) => (
              <div key={label}>
                <div className="font-display font-extrabold text-5xl text-green mb-2">
                  <CountUp target={target} suffix={suffix} prefix={prefix} />
                </div>
                <p className="text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recycling CTA */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-[560px] px-6 text-center">
          <h2 className="font-display font-extrabold text-3xl text-navy mb-3">Join the Recycling Programme</h2>
          <p className="text-navy/50 mb-8">Register your old cap and we'll arrange pickup. Get 10% off your next order.</p>
          {registered ? (
            <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} className="bg-[#f0faf4] rounded-2xl p-8 text-green-700 font-semibold">
              ✓ You're registered! We'll be in touch within 2 business days.
            </motion.div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <input required value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Full name" className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-green bg-lavender/40"/>
              <input required type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} placeholder="Email address" className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-green bg-lavender/40"/>
              <select required value={form.cap} onChange={e => setForm(p=>({...p,cap:e.target.value}))} className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-green bg-lavender/40 text-navy/70">
                <option value="">Select cap model</option>
                {['Tribal Scrum Cap','Warrior Scrum Cap','Predator Cap','Classic Scrum Cap','Other'].map(m=><option key={m}>{m}</option>)}
              </select>
              <button type="submit" className="w-full bg-[#0a2d1b] text-white font-semibold py-3.5 rounded-full hover:bg-[#0d3d23] transition-colors">Register for Recycling</button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
