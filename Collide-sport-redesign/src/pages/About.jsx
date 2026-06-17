import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AppImage from '../components/ui/AppImage'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

// ── Replace with your Formspree form ID from https://formspree.io ──────────
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwzgkje'

const STORE_EMAIL     = 'collide.sabre@gmail.com'
const WHATSAPP_NUMBER = '27827804116'
const STORE_ADDRESS   = '40 Kenilworth Rd, Kenilworth, Cape Town, 7708'
const MAPS_QUERY      = '40+Kenilworth+Rd,+Kenilworth,+Cape+Town,+7708'

const TIMELINE = [
  { year: '2023', title: 'Founded in Cape Town', desc: 'A Cape Town rugby mom frustrated by the lack of quality, affordable headgear on SA shelves decided to do something about it. Collide Sport was born.' },
  { year: '2023', title: 'First Batch Ships', desc: 'Our first run of scrum caps sells out in weeks. Word spreads through school and club rugby circuits across the Western Cape.' },
  { year: '2024', title: 'Activewear Launch', desc: 'We expand beyond scrum caps — compression tops, running tops, and undershorts join the Collide Sport lineup.' },
  { year: '2024', title: 'Tribal & Warrior Caps', desc: 'Our boldest designs yet. The Tribal and Warrior scrum caps become instant bestsellers on Takealot.' },
  { year: '2025', title: 'Predator Range', desc: 'The premium Predator series launches with advanced dual expansion foam technology for semi-pro and professional players.' },
  { year: '2026', title: '5,000+ Players', desc: 'Collide Sport gear is worn by players across South Africa — from school fields to provincial stadiums.' },
]

const VALUES = [
  {
    title: 'Protection First',
    desc: 'Every product is engineered around player safety — closed-cell foam, dual expansion technology, and real-world field testing before a single cap ships.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Made for SA Rugby',
    desc: "We're South African, we watch the game, we know the fields. Collide Sport gear is built for our climate, our players, and the intensity of South African rugby.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
  {
    title: 'Accessible Quality',
    desc: "Premium protection shouldn't cost a fortune. School teams, club players, and aspiring professionals all deserve gear that performs — without the import price tag.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
]

function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function handleChange(e) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...fields, _subject: `Collide Sport enquiry from ${fields.name}` }),
      })
      if (res.ok) {
        setStatus('success')
        setFields({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputCls = 'w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1.5">Name</label>
          <input name="name" type="text" required value={fields.name} onChange={handleChange}
            placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1.5">Email</label>
          <input name="email" type="email" required value={fields.email} onChange={handleChange}
            placeholder="your@email.com" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1.5">Message</label>
        <textarea name="message" required rows={5} value={fields.message} onChange={handleChange}
          placeholder="How can we help you?" className={`${inputCls} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={status === 'sending' || status === 'success'}
        className="w-full bg-navy-dark text-white font-black uppercase tracking-widest text-xs py-3.5 hover:bg-blue transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : status === 'success' ? 'Message Sent ✓' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please email us directly at {STORE_EMAIL}.</p>
      )}
    </form>
  )
}

export default function About() {
  return (
    <div className="pt-14 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-navy-dark py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-line opacity-20" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-4">About Us</p>
            <h1 className="font-display font-black text-4xl lg:text-6xl text-white tracking-tighter leading-[0.95] uppercase mb-6">
              Born from the Game.<br />
              <span className="text-stroke-blue">Built for the Player.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl leading-relaxed">
              Collide Sport makes technical, comfortable, and durable rugby gear — scrum caps designed to protect players at every level of the game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Our Story</p>
              <h2 className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tighter uppercase mb-6">
                From the touchline to the workshop
              </h2>
              <div className="space-y-4 text-navy/60 text-base leading-relaxed">
                <p>
                  Collide Sport started exactly where most great South African businesses do — with a problem that nobody else was solving. Our founder, a Cape Town rugby mom, spent years on the touchline watching her son play and couldn't find a scrum cap that was both genuinely protective and priced for real families.
                </p>
                <p>
                  The imported options were expensive. The local alternatives cut corners on the engineering. So she did what any passionate rugby parent would do — she built one herself. That first cap, designed with closed-cell foam and dual expansion technology, became the foundation of Collide Sport.
                </p>
                <p>
                  Today, thousands of players across South Africa trust Collide Sport gear — from primary school fields in the Western Cape to provincial academies and club matches nationwide. Every cap ships with the same promise that started it all: protect the player, respect the game.
                </p>
              </div>

              {/* Founder quote */}
              <blockquote className="mt-8 border-l-4 border-blue pl-5">
                <p className="text-navy font-semibold italic text-lg leading-relaxed">
                  "I started Collide Sport because I couldn't find the right gear for my son. If I couldn't find it, every rugby mom in Cape Town had the same problem."
                </p>
                <footer className="text-sm text-navy/40 mt-2 font-mono tracking-wider">— Founder, Collide Sport</footer>
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <AppImage src={`${CDN}/Warrior_Cap_on_Bosch_1st_Team.jpg?v=1724349538&width=600`} alt="Warrior Cap worn in match" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                <AppImage src={`${CDN}/2_4240e760-94b0-44bb-8213-0b752403e682.jpg?v=1715450720&width=600`} alt="Tribal cap on field" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 lg:py-28 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">What We Stand For</p>
            <h2 className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tighter uppercase">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ title, desc, icon }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-5">{icon}</div>
                <h3 className="font-display font-black text-lg text-navy uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-sm text-navy/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Our Journey</p>
            <h2 className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tighter uppercase">
              From first batch to 5,000+ players
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px bg-navy/10 lg:-translate-x-px" />
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                <div className="absolute left-5 lg:left-1/2 w-3 h-3 rounded-full bg-blue border-2 border-white -translate-x-1/2 mt-1.5 z-10" />
                <div className={`ml-12 lg:ml-0 lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                  <span className="text-xs font-mono text-blue font-bold">{item.year}</span>
                  <h3 className="font-display font-bold text-navy text-lg mt-1">{item.title}</h3>
                  <p className="text-sm text-navy/50 leading-relaxed mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-navy-dark py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '2023', label: 'Founded' },
              { value: '5K+',  label: 'Players Protected' },
              { value: '27+',  label: 'Products' },
              { value: '5★',   label: 'Takealot Rating' },
            ].map(({ value, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <p className="font-display font-black text-4xl text-white">{value}</p>
                <p className="text-sm text-white/40 mt-2">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-20 lg:py-28 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Get in Touch</p>
            <h2 className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tighter uppercase">
              We'd love to hear from you
            </h2>
            <p className="text-navy/50 text-base max-w-md mx-auto mt-3">
              Questions about an order, team kit, or just want to chat rugby? We're here.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">

            {/* WhatsApp */}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Collide%20Sport%2C%20I%20have%20a%20question%20about%20your%20products.`}
              target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 bg-white rounded-2xl p-7 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 rounded-full bg-[#25D366]/15 flex items-center justify-center group-hover:bg-[#25D366]/25 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-navy mb-1">WhatsApp</p>
                <p className="text-sm text-navy/50">+27 82 780 4116</p>
                <p className="text-xs text-[#25D366] font-semibold mt-2">Chat with us →</p>
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${STORE_EMAIL}`}
              className="flex flex-col items-center gap-4 bg-white rounded-2xl p-7 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 rounded-full bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-navy mb-1">Email</p>
                <p className="text-sm text-navy/50">collide.sabre@gmail.com</p>
                <p className="text-xs text-blue font-semibold mt-2">Send us an email →</p>
              </div>
            </a>

            {/* Address */}
            <a href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
              target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 bg-white rounded-2xl p-7 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 rounded-full bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-navy mb-1">Location</p>
                <p className="text-sm text-navy/50 leading-snug">{STORE_ADDRESS}</p>
                <p className="text-xs text-blue font-semibold mt-2">View on Google Maps →</p>
              </div>
            </a>
          </div>

          {/* Map + Form side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-navy/8 min-h-[360px]">
              <iframe
                title="Collide Sport location"
                src={`https://maps.google.com/maps?q=${MAPS_QUERY}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[360px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-navy/8">
              <h3 className="font-display font-black text-xl text-navy uppercase tracking-tight mb-1">Send a Message</h3>
              <p className="text-sm text-navy/40 mb-6">We reply within one business day.</p>
              <ContactForm />
            </div>
          </div>

          {/* VAT number */}
          <p className="text-center text-xs font-mono text-navy/30 tracking-wider mt-10">
            VAT REG NO: 4950265141 · Collide Sport (Pty) Ltd · Western Cape, South Africa
          </p>
        </div>
      </section>
    </div>
  )
}
