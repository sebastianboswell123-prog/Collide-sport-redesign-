import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// ── Store contact details — update these when confirmed ──────────────────────
const STORE_EMAIL     = 'info@collidesport.co.za'
const STORE_PHONE     = '082 780 4116'
const WHATSAPP_NUMBER = '27827804116'           // digits only, no +
const WHATSAPP_MSG    = 'Hi, I need help with my order.'
const STORE_ADDRESS   = null                    // set to string when confirmed
const MAPS_EMBED_URL  = null                    // paste your Google Maps embed src here
const FACEBOOK_URL    = 'https://www.facebook.com/collide.sport.2023'
const INSTAGRAM_URL   = 'https://www.instagram.com/collide_sport/'

const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`

// ── Formspree — replace YOUR_FORM_ID with the ID from formspree.io ───────────
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'

// ── FAQ items ─────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard delivery is 3–5 business days across South Africa. Free shipping on orders over R1 000.' },
  { q: 'Can I return or exchange an item?', a: 'Yes — unworn items in original packaging can be returned within 14 days. Contact us to arrange an exchange.' },
  { q: 'Do you ship outside South Africa?', a: 'Currently we ship within South Africa only. International shipping is coming soon — follow us for updates.' },
  { q: 'Can I order for a team or school?', a: 'Absolutely. We offer bulk pricing for teams and schools. Use the form or WhatsApp us directly for a quote.' },
]

// ── Shared UI components ──────────────────────────────────────────────────────
function inputClass(hasError) {
  return `w-full bg-lavender border rounded-xl px-5 py-4 text-navy placeholder-navy/30 focus:outline-none transition-colors text-sm ${
    hasError
      ? 'border-red-400 focus:border-red-400 ring-1 ring-red-200'
      : 'border-navy/8 focus:border-blue/50 focus:ring-2 focus:ring-blue/8 focus:bg-white'
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

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      className="w-full text-left border-b border-navy/8 py-5 focus:outline-none group"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-semibold text-navy leading-snug">{q}</span>
        <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-blue/8 flex items-center justify-center transition-transform duration-200 mt-0.5 ${open ? 'rotate-45' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#4770db" strokeWidth="1.8" strokeLinecap="round">
            <line x1="5" y1="0" x2="5" y2="10"/><line x1="0" y1="5" x2="10" y2="5"/>
          </svg>
        </span>
      </div>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm text-navy/50 leading-relaxed mt-3 pr-8"
        >
          {a}
        </motion.p>
      )}
    </button>
  )
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors]       = useState({})
  const [sending, setSending]     = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sendError, setSendError] = useState('')

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.subject.trim()) e.subject = 'Please select a topic'
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
        className="py-16 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display font-extrabold text-xl text-navy mb-2">Message sent!</h3>
        <p className="text-navy/50 text-sm mb-6">
          Thanks {form.name.split(' ')[0]}, we'll be in touch within 1 business day.
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" error={errors.name}>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="Your name" className={inputClass(errors.name)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@email.com" className={inputClass(errors.email)} />
        </Field>
      </div>

      <Field label="Topic" error={errors.subject}>
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
          rows={6} placeholder="Tell us how we can help…"
          className={`${inputClass(errors.message)} resize-none`} />
      </Field>

      {sendError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{sendError}</p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={sending}
          className="bg-blue text-white font-semibold px-10 py-4 rounded-full hover:bg-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
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
        <p className="text-xs text-navy/35">Replies within 1 business day</p>
      </div>
    </form>
  )
}

// ── Main Contact page ─────────────────────────────────────────────────────────
export default function Contact() {
  return (
    <div className="pt-14 min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-navy-dark py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-line opacity-20" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-4">Get In Touch</p>
            <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
              We'd love to hear from you.
            </h1>
            <p className="text-white/45 text-lg max-w-lg leading-relaxed">
              Questions about sizing, bulk orders, returns, or just want to say hi — we're here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Quick contact channels ── */}
      <section className="bg-white py-10 border-b border-navy/6">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* WhatsApp */}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl px-5 py-4 border border-navy/8 hover:border-[#25D366]/40 hover:shadow-md hover:shadow-[#25D366]/10 transition-all group"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-navy text-sm">WhatsApp</p>
                <p className="text-navy/45 text-xs">Chat now — fastest</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 border border-navy/8 hover:border-blue/30 hover:shadow-md hover:shadow-blue/8 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-blue/8 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-navy text-sm">Email</p>
                <p className="text-navy/45 text-xs font-mono">{STORE_EMAIL}</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${STORE_PHONE.replace(/\s/g, '')}`}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 border border-navy/8 hover:border-navy/20 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-navy/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.09 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.17 7.84a16 16 0 006.02 6.02l1.21-1.21a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-navy text-sm">Phone</p>
                <p className="text-navy/45 text-xs font-mono">{STORE_PHONE}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── Main content: form + sidebar ── */}
      <section className="py-16 lg:py-24 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

            {/* Left — form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 lg:p-10 border border-navy/6">
                <h2 className="font-display font-extrabold text-2xl text-navy tracking-tight mb-1">Send a message</h2>
                <p className="text-sm text-navy/40 mb-8">We read every message and reply personally.</p>
                <ContactForm />
              </div>
            </div>

            {/* Right — sidebar ── */}
            <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-[6.5rem]">

              {/* Hours */}
              <div className="bg-white rounded-2xl p-6 border border-navy/6">
                <h3 className="font-display font-bold text-navy text-sm mb-4">Response hours</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { days: 'Mon – Fri', time: '08:00 – 17:00' },
                    { days: 'Saturday', time: '09:00 – 13:00' },
                    { days: 'Sunday', time: 'WhatsApp only' },
                  ].map(({ days, time }) => (
                    <div key={days} className="flex justify-between">
                      <span className="text-navy/50">{days}</span>
                      <span className="font-semibold text-navy">{time}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-navy/6">
                  <span className="w-2 h-2 rounded-full bg-green animate-pulse flex-shrink-0" />
                  <p className="text-xs text-navy/40">Typical reply: within 1 business day</p>
                </div>
              </div>

              {/* Address + Maps */}
              <div className="bg-white rounded-2xl p-6 border border-navy/6">
                <h3 className="font-display font-bold text-navy text-sm mb-3">Our address</h3>
                {STORE_ADDRESS ? (
                  <>
                    <p className="text-sm text-navy/60 leading-relaxed mb-4">{STORE_ADDRESS}</p>
                    {MAPS_EMBED_URL && (
                      <div className="rounded-xl overflow-hidden border border-navy/6 h-44">
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
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(STORE_ADDRESS)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue font-semibold mt-3 hover:text-blue-light transition-colors"
                    >
                      Open in Google Maps
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                      </svg>
                    </a>
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-navy/50 leading-relaxed">
                      We're an online-first store, shipping across South Africa. A physical showroom is coming — watch this space.
                    </p>
                    <a href="https://collidesport.co.za" target="_blank" rel="noopener noreferrer" className="text-xs text-blue font-semibold hover:text-blue-light transition-colors">
                      Shop online →
                    </a>
                  </div>
                )}
              </div>

              {/* Social media */}
              <div className="bg-white rounded-2xl p-6 border border-navy/6">
                <h3 className="font-display font-bold text-navy text-sm mb-4">Follow us</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-navy/70 hover:text-navy transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </span>
                    <span>@collide_sport</span>
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-navy/70 hover:text-navy transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </span>
                    <span>collide.sport.2023</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl px-6 py-5 border border-[#25D366]/25 hover:border-[#25D366]/60 hover:shadow-lg hover:shadow-[#25D366]/12 transition-all group"
                style={{ background: 'linear-gradient(135deg, #f0fff6 0%, #ffffff 100%)' }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-navy text-sm">Need urgent help?</p>
                  <p className="text-xs text-navy/45 mt-0.5">Chat on WhatsApp — we reply fast</p>
                </div>
                <svg className="w-4 h-4 text-[#25D366] group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3 text-center">Common Questions</p>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-navy tracking-tight text-center mb-10">
              Quick answers
            </h2>
            {FAQS.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
            <p className="text-sm text-navy/40 mt-8 text-center">
              Still not sure?{' '}
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-blue font-semibold hover:text-blue-light transition-colors">
                Ask us on WhatsApp
              </a>{' '}
              or{' '}
              <a href={`mailto:${STORE_EMAIL}`} className="text-blue font-semibold hover:text-blue-light transition-colors">
                send an email
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── About link ── */}
      <section className="py-12 bg-lavender border-t border-navy/6 pb-24 lg:pb-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <p className="text-sm text-navy/40">
            Want to know more about us?{' '}
            <Link to="/about" className="text-blue font-semibold hover:text-blue-light transition-colors">
              Read our story →
            </Link>
          </p>
        </div>
      </section>

    </div>
  )
}
