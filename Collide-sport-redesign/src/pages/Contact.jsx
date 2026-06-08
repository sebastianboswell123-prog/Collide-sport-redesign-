export default function Contact() {
  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Get in touch</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">Contact</h1>
        </div>
      </section>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 max-w-lg">
        <form className="space-y-4">
          <input type="text" placeholder="Name" className="w-full bg-white border border-navy/8 rounded-xl px-5 py-4 text-navy focus:outline-none focus:border-blue/50 transition-colors" />
          <input type="email" placeholder="Email" className="w-full bg-white border border-navy/8 rounded-xl px-5 py-4 text-navy focus:outline-none focus:border-blue/50 transition-colors" />
          <textarea rows={5} placeholder="Message" className="w-full bg-white border border-navy/8 rounded-xl px-5 py-4 text-navy focus:outline-none focus:border-blue/50 transition-colors resize-none" />
          <button type="submit" className="bg-blue text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-light transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
