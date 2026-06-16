import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Email endpoint ────────────────────────────────────────────────────────────
// Set VITE_FORMSPREE_ID in your .env file to activate real email delivery.
// Get a free ID at https://formspree.io — no backend required.
// If not set, the form falls back to a mailto: link.
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID

const WHATSAPP_NUMBER = '27827804116'
const STORE_EMAIL     = 'info@collidesport.co.za'
const STORE_PHONE     = '082 780 4116'
const MAP_QUERY       = 'Cape+Town+Western+Cape+South+Africa'

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/collide.sport.2023',
    color: '#1877F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/collide_sport/',
    color: '#E1306C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#ig-grad)">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433"/>
            <stop offset="25%" stopColor="#e6683c"/>
            <stop offset="50%" stopColor="#dc2743"/>
            <stop offset="75%" stopColor="#cc2366"/>
            <stop offset="100%" stopColor="#bc1888"/>
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
]

export default function Contact() {
  const [form, setForm]           = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [errors, setErrors]       = useState({})
  const [status, setStatus]       = useState('idle') // idle | sending | success | error

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('sending')

    if (FORMSPREE_ID) {
      // ── Real email via Formspree ──────────────────────────────────────────
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name:    form.name,
            email:   form.email,
            phone:   form.phone,
            subject: form.subject || 'General Enquiry',
            message: form.message,
          }),
        })
        if (res.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    } else {
      // ── Fallback: open mailto ─────────────────────────────────────────────
      const body = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
      window.open(`mailto:${STORE_EMAIL}?subject=${encodeURIComponent(form.subject || 'Website enquiry')}&body=${encodeURIComponent(body)}`)
      setStatus('success')
    }
  }

  function resetForm() {
    setForm({ name:'', email:'', phone:'', subject:'', message:'' })
    setStatus('idle')
    setErrors({})
  }

  return (
    <div className="pt-14 min-h-screen bg-lavender">

      {/* Header */}
      <section className="bg-navy-dark py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Get in Touch</p>
            <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight mb-3">Contact Us</h1>
            <p className="text-white/50 text-base max-w-lg">Questions about an order, sizing, or team kits? We're here to help.</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* ── Left: Form ── */}
          <div>
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity:0, scale:0.96 }}
                  animate={{ opacity:1, scale:1 }}
                  className="bg-white rounded-2xl p-10 text-center shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-navy mb-2">Message sent!</h2>
                  <p className="text-navy/50 text-sm mb-1">Thanks {form.name.split(' ')[0]}, we'll get back to you within 1 business day.</p>
                  {!FORMSPREE_ID && (
                    <p className="text-xs text-navy/30 mt-2">
                      (Your email client opened — set <span className="font-mono">VITE_FORMSPREE_ID</span> for server-side delivery.)
                    </p>
                  )}
                  <button onClick={resetForm} className="mt-6 text-sm text-blue font-semibold hover:text-blue-light transition-colors">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm space-y-5"
                >
                  <h2 className="font-display font-bold text-navy text-xl mb-1">Send us a message</h2>
                  {!FORMSPREE_ID && (
                    <div className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                      Email delivery active via <strong>mailto:</strong> — set{' '}
                      <span className="font-mono">VITE_FORMSPREE_ID</span> for server-side sending.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" error={errors.name} required>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Siya Kolisi" className={ic(errors.name)} />
                    </Field>
                    <Field label="Email Address" error={errors.email} required>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.co.za" className={ic(errors.email)} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Phone (optional)" error={null}>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+27 82 000 0000" className={ic(false)} />
                    </Field>
                    <Field label="Subject" error={null}>
                      <select name="subject" value={form.subject} onChange={handleChange} className={ic(false) + ' cursor-pointer'}>
                        <option value="">Select a topic</option>
                        <option>Order enquiry</option>
                        <option>Returns &amp; refunds</option>
                        <option>Product question</option>
                        <option>Team / bulk order</option>
                        <option>Wholesale</option>
                        <option>Other</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Message" error={errors.message} required>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="How can we help?" className={ic(errors.message) + ' resize-none'} />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`w-full py-4 rounded-full font-bold text-base transition-all ${status === 'sending' ? 'bg-lavender text-navy/40 cursor-not-allowed' : 'bg-blue text-white hover:bg-blue-light active:scale-[0.98]'}`}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>

                  {status === 'error' && (
                    <p className="text-xs text-red-500 text-center">Something went wrong. Please try again or email us directly.</p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Contact info + map ── */}
          <div className="space-y-5">

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Collide%20Sport%2C%20I%20have%20a%20question%20about%20your%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/25 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-navy">WhatsApp</p>
                <p className="text-sm text-navy/50">{STORE_PHONE}</p>
                <p className="text-xs text-[#25D366] font-semibold mt-0.5">Usually replies within an hour</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-navy">Email</p>
                <p className="text-sm text-blue">{STORE_EMAIL}</p>
                <p className="text-xs text-navy/40 mt-0.5">Mon–Fri 8am–5pm SAST</p>
              </div>
            </a>

            {/* Location + map */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-navy">Location</p>
                  <address className="text-sm text-navy/60 not-italic leading-relaxed mt-1">
                    Cape Town, Western Cape<br />South Africa
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue font-semibold hover:text-blue-light transition-colors mt-2 inline-block"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-navy/8">
                <iframe
                  title="Collide Sport — Cape Town"
                  width="100%"
                  height="220"
                  className="border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${MAP_QUERY}&output=embed&z=11`}
                />
              </div>
            </div>

            {/* Social media */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="font-display font-bold text-navy mb-3">Follow Us</p>
              <div className="flex gap-3">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 flex-1 justify-center border border-navy/10 rounded-xl py-3 hover:bg-lavender transition-colors text-sm font-semibold text-navy">
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="font-display font-bold text-navy mb-3">Business Hours</p>
              <div className="space-y-1.5 text-sm">
                {[
                  { day: 'Monday – Friday', hours: '08:00 – 17:00' },
                  { day: 'Saturday',        hours: '09:00 – 13:00' },
                  { day: 'Sunday',          hours: 'Closed' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-navy/60">{day}</span>
                    <span className={`font-medium ${hours === 'Closed' ? 'text-navy/30' : 'text-navy'}`}>{hours}</span>
                  </div>
                ))}
                <p className="text-xs text-navy/30 pt-1">All times SAST (UTC+2)</p>
              </div>
            </div>

            {/* CPA notice */}
            <p className="text-xs text-navy/40 leading-relaxed px-1">
              For returns and refund enquiries please see our{' '}
              <Link to="/returns-policy" className="text-blue hover:text-blue-light underline">Returns Policy</Link>.
              Under the CPA, you have the right to return goods within 5 business days if they don't conform to the product description.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ic(hasError) {
  return `w-full bg-white border rounded-xl px-4 py-3 text-sm text-navy outline-none transition-colors ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-navy/15 focus:border-blue'
  }`
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest text-navy/40 uppercase mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  )
}
