import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CollideLogo from '../components/CollideLogo'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

// ── Store contact details — update these when confirmed ──────────────────────
const STORE_EMAIL     = 'info@collidesport.co.za'
const WHATSAPP_NUMBER = '27827804116'           // digits only, no +
const WHATSAPP_MSG    = 'Hi, I need help with my order.'
const STORE_ADDRESS   = null                    // set to string when confirmed, e.g. '12 Rugby Rd, Bellville, Cape Town, 7530'
const MAPS_EMBED_URL  = null                    // paste your Google Maps embed src here

const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`

// ── Formspree — replace YOUR_FORM_ID with the ID from formspree.io ───────────
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'

const TIMELINE = [
  { year: '2023', title: 'Founded', desc: 'Collide Sport launches in South Africa with a mission to make quality rugby protection accessible to every player.' },
  { year: '2023', title: 'First Batch Ships', desc: 'Our first run of scrum caps sells out in weeks. Word spreads through school and club rugby circuits across the Western Cape.' },
  { year: '2024', title: 'Activewear Launch', desc: 'We expand beyond scrum caps — compression tops, running tops, and undershorts join the Collide Sport lineup.' },
  { year: '2024', title: 'Tribal & Warrior Caps', desc: 'Our boldest designs yet. The Tribal and Warrior scrum caps become instant bestsellers on Takealot.' },
  { year: '2025', title: 'Predator Range', desc: 'The premium Predator series launches with advanced dual expansion foam technology for semi-pro and professional players.' },
  { year: '2026', title: '5,000+ Players', desc: 'Collide Sport gear is worn by players across South Africa — from school fields to provincial stadiums.' },
]

const VALUES = [
  { title: 'Protection First', desc: 'Every product is designed around player safety. Closed-cell foam, dual expansion technology, and rigorous testing.' },
  { title: 'Made for SA Rugby', desc: "We're South African, we play rugby, and we build gear that works on our fields, in our climate, for our players." },
  { title: 'Accessible Quality', desc: 'Premium protection shouldn\'t cost a fortune. Our scrum caps deliver pro-level safety at prices that work for school and club teams.' },
]

// ── Contact form component (shared with Contact.jsx) ─────────────────────────
function inputClass(hasError) {
  return `w-full bg-white border rounded-xl px-5 py-4 text-navy placeholder-navy/30 focus:outline-none transition-colors text-sm ${
    hasError ? 'border-red-400 focus:border-red-400 ring-1 ring-red-200' : 'border-navy/10 focus:border-blue/50 focus:ring-2 focus:ring-blue/8'
  }`
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-[10px] font-mono tracking-widest text-navy/40 uppercase mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function ContactForm() {
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors]     = useState({})
  const [sending, setSending]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sendError, setSendError] = useState('')

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (sendError) setSendError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSending(true)
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setSendError('Something went wrong. Please reach out via WhatsApp or email directly.')
      }
    } catch {
      setSendError('Connection error. Please try WhatsApp or email instead.')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-10 text-center border border-navy/6"
      >
        <div className="w-14 h-14 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display font-extrabold text-xl text-navy mb-2">Message sent!</h3>
        <p className="text-navy/50 text-sm mb-6">
          Thanks {form.name.split(' ')[0]}, we'll get back to you within 1 business day.
        </p>
        <button
          onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false) }}
          className="text-sm text-blue font-semibold hover:text-blue-light transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" error={errors.name}>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="Your name" className={inputClass(errors.name)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@email.com" className={inputClass(errors.email)} />
        </Field>
      </div>
      <Field label="Subject" error={errors.subject}>
        <select name="subject" value={form.subject} onChange={handleChange} className={inputClass(errors.subject)}>
          <option value="">Select a topic…</option>
          <option value="Order enquiry">Order enquiry</option>
          <option value="Sizing help">Sizing help</option>
          <option value="Team / bulk order">Team / bulk order</option>
          <option value="Returns & exchanges">Returns &amp; exchanges</option>
          <option value="Product feedback">Product feedback</option>
          <option value="Other">Other</option>
        </select>
      </Field>
      <Field label="Message" error={errors.message}>
        <textarea name="message" value={form.message} onChange={handleChange}
          rows={5} placeholder="How can we help?"
          className={`${inputClass(errors.message)} resize-none`} />
      </Field>

      {sendError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{sendError}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto bg-blue text-white font-semibold px-10 py-4 rounded-full hover:bg-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
      >
        {sending ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Sending…
          </>
        ) : 'Send Message'}
      </button>

      <p className="text-[11px] text-navy/35">
        We typically reply within 1 business day. For urgent help, use WhatsApp below.
      </p>
    </form>
  )
}

// ── Main About page ───────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="pt-14 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-navy-dark py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-line opacity-20" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-4">About Us</p>
            <div className="mb-5">
              <CollideLogo size="xl" variant="light" layout="stacked" />
            </div>
            <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-[0.95] mb-6">
              Built for rugby.<br />
              <span className="text-stroke-blue">Built in South Africa.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl leading-relaxed">
              Collide Sport makes technical, comfortable, and durable rugby gear — scrum caps designed to protect players at every level of the game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Our Story</p>
              <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight mb-6">
                From the field to the factory
              </h2>
              <div className="space-y-4 text-navy/60 text-base leading-relaxed">
                <p>
                  Collide Sport was born from a simple frustration — finding quality rugby headgear in South Africa
                  that was both protective and affordable. Most options were either imported at premium prices or
                  lacked the engineering that serious players need.
                </p>
                <p>
                  We set out to build scrum caps with closed-cell foam design, dual expansion technology, and the
                  durability to survive season after season — all at a price that works for school teams, club
                  players, and aspiring professionals.
                </p>
                <p>
                  Today, Collide Sport gear is trusted by thousands of players across South Africa. From the
                  school fields of the Western Cape to provincial academies, our scrum caps keep players safe
                  and looking sharp on the field.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img src={`${CDN}/Sabre_Sport_Banner_2_02d6cd8e-fd57-410e-baac-c9e18c9daaa4.jpg?v=1689090191&width=600`} alt="Rugby action" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                <img src={`${CDN}/2_4240e760-94b0-44bb-8213-0b752403e682.jpg?v=1715450720&width=600`} alt="Tribal cap on field" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 lg:py-28 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Our Journey</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">
              From first batch to 5,000+ players
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px bg-navy/10 lg:-translate-x-px" />
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
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

      {/* ── Values ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">What We Stand For</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-lavender rounded-2xl p-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{title}</h3>
                <p className="text-sm text-navy/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '2023', label: 'Founded' },
              { value: '5K+',  label: 'Players Protected' },
              { value: '27+',  label: 'Products' },
              { value: '5★',   label: 'Takealot Rating' },
            ].map(({ value, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <p className="font-display font-extrabold text-4xl text-white">{value}</p>
                <p className="text-sm text-white/40 mt-2">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact section ───────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-lavender" id="contact">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          {/* Heading */}
          <div className="mb-14">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Get In Touch</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight max-w-xl">
              We're here to help — before, during, and after your order.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

            {/* Left — Contact tiles + address ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* WhatsApp */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 border border-navy/6 hover:border-[#25D366]/40 hover:shadow-md hover:shadow-[#25D366]/10 transition-all group"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-navy text-sm">WhatsApp</p>
                  <p className="text-navy/50 text-xs mt-0.5">Chat now — fastest response</p>
                </div>
                <svg className="ml-auto w-4 h-4 text-navy/20 group-hover:text-[#25D366] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>

              {/* Email */}
              <a
                href={`mailto:${STORE_EMAIL}`}
                className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 border border-navy/6 hover:border-blue/30 hover:shadow-md hover:shadow-blue/8 transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-navy text-sm">Email</p>
                  <p className="text-navy/50 text-xs mt-0.5 font-mono">{STORE_EMAIL}</p>
                </div>
                <svg className="ml-auto w-4 h-4 text-navy/20 group-hover:text-blue transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>

              {/* Address / Online store */}
              <div className="bg-white rounded-2xl px-6 py-5 border border-navy/6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-navy/6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-navy/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-bold text-navy text-sm">Location</p>
                    {STORE_ADDRESS ? (
                      <>
                        <p className="text-navy/50 text-xs mt-0.5 leading-relaxed">{STORE_ADDRESS}</p>
                        {MAPS_EMBED_URL && (
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(STORE_ADDRESS)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue font-semibold mt-2 inline-block hover:text-blue-light transition-colors">
                            Get directions →
                          </a>
                        )}
                      </>
                    ) : (
                      <p className="text-navy/50 text-xs mt-0.5 leading-relaxed">Online store — shipping across South Africa</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Response time note */}
              <div className="flex items-center gap-2 px-4">
                <span className="w-2 h-2 rounded-full bg-green animate-pulse flex-shrink-0" />
                <p className="text-xs text-navy/40">Typical reply time: within 1 business day</p>
              </div>
            </div>

            {/* Right — Contact form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-navy/6">
                <h3 className="font-display font-bold text-lg text-navy mb-6">Send us a message</h3>
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Google Maps embed — only shown if MAPS_EMBED_URL is set */}
          {MAPS_EMBED_URL && (
            <div className="mt-10 rounded-2xl overflow-hidden border border-navy/8 h-72">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Collide Sport location"
              />
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
