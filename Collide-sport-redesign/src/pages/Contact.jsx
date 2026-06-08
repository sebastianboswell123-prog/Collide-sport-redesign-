import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitted(true)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Get in touch</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">Contact</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16">
        <div className="max-w-lg">
          {submitted ? (
            <div className="bg-white rounded-2xl border border-navy/8 p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-green-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-navy mb-2">Message sent!</h2>
              <p className="text-navy/50 text-sm mb-6">Thanks {form.name.split(' ')[0]}, we'll get back to you shortly.</p>
              <button
                onClick={() => { setForm({ name: '', email: '', message: '' }); setSubmitted(false) }}
                className="text-sm text-blue font-semibold hover:text-blue-light transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field label="Name" error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={inputClass(errors.name)}
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field label="Message" error={errors.message}>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="How can we help?"
                  className={`${inputClass(errors.message)} resize-none`}
                />
              </Field>

              <button
                type="submit"
                className="bg-blue text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-light transition-colors active:scale-95"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function inputClass(error) {
  return `w-full bg-white border rounded-xl px-5 py-4 text-navy focus:outline-none transition-colors ${
    error ? 'border-red-400 focus:border-red-400' : 'border-navy/8 focus:border-blue/50'
  }`
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest text-navy/40 uppercase mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
