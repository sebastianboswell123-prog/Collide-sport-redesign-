import { useState } from 'react'

export default function Join() {
  const [form, setForm] = useState({ name: '', email: '', role: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-14 min-h-screen bg-navy-dark grid-bg flex items-center">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-24 w-full">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Early Access</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Join Collide.
          </h1>
          <p className="text-white/50 mb-10">
            Get early access and be the first to experience the platform built for serious sport.
          </p>

          {submitted ? (
            <div className="bg-green/10 border border-green/20 rounded-2xl p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-green mx-auto mb-4 animate-pulse-glow" />
              <p className="font-display font-bold text-white text-xl">You're on the list.</p>
              <p className="text-white/50 text-sm mt-2">
                Thanks {form.name.split(' ')[0]}, we'll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 text-white/70 focus:outline-none focus:border-blue/50 transition-colors"
              >
                <option value="" disabled>I am a...</option>
                <option value="player">Player</option>
                <option value="coach">Coach</option>
                <option value="organiser">Team Organiser</option>
              </select>
              <button
                type="submit"
                className="w-full bg-green text-navy font-extrabold py-4 rounded-full hover:bg-green-dim transition-colors active:scale-95"
              >
                Join the Waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
