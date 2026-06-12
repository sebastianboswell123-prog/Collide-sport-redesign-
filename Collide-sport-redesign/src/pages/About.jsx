import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

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

export default function About() {
  return (
    <div className="pt-14 min-h-screen">
      {/* Hero */}
      <section className="relative bg-navy-dark py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-line opacity-20" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-4">About Us</p>
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

      {/* Story */}
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

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Our Journey</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">
              From first batch to 5,000+ players
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
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
                {/* Dot */}
                <div className="absolute left-5 lg:left-1/2 w-3 h-3 rounded-full bg-blue border-2 border-white -translate-x-1/2 mt-1.5 z-10" />

                {/* Content */}
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

      {/* Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">What We Stand For</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">
              Our Values
            </h2>
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

      {/* Stats */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '2023', label: 'Founded' },
              { value: '5K+', label: 'Players Protected' },
              { value: '27+', label: 'Products' },
              { value: '5★', label: 'Takealot Rating' },
            ].map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="font-display font-extrabold text-4xl text-white">{value}</p>
                <p className="text-sm text-white/40 mt-2">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-lavender text-center">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight mb-4">
            Ready to gear up?
          </h2>
          <p className="text-navy/50 text-lg max-w-md mx-auto mb-8">
            Browse our full range of scrum caps and activewear.
          </p>
          <Link
            to="/catalogue"
            className="inline-block bg-blue text-white font-semibold px-10 py-4 rounded-full hover:bg-blue-light transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ── Contact section ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Get in Touch</p>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">
              We'd love to hear from you
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            {/* WhatsApp */}
            <a
              href="https://wa.me/27000000000?text=Hi%20Collide%20Sport%2C%20I%20have%20a%20question%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 bg-lavender rounded-2xl p-8 hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 rounded-full bg-[#25D366]/15 flex items-center justify-center group-hover:bg-[#25D366]/25 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-navy mb-1">WhatsApp</p>
                <p className="text-sm text-navy/50">+27 00 000 0000</p>
                <p className="text-xs text-[#25D366] font-semibold mt-2">Chat with us →</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@collidesport.co.za"
              className="flex flex-col items-center gap-4 bg-lavender rounded-2xl p-8 hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 rounded-full bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-navy mb-1">Email</p>
                <p className="text-sm text-navy/50">info@collidesport.co.za</p>
                <p className="text-xs text-blue font-semibold mt-2">Send us an email →</p>
              </div>
            </a>

            {/* Address */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Cape+Town+South+Africa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 bg-lavender rounded-2xl p-8 hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 rounded-full bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4770db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-navy mb-1">Find Us</p>
                <p className="text-sm text-navy/50">Cape Town,<br />Western Cape, SA</p>
                <p className="text-xs text-blue font-semibold mt-2">View on Maps →</p>
              </div>
            </a>
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="inline-block bg-blue text-white font-semibold px-10 py-4 rounded-full hover:bg-blue-light transition-colors"
            >
              Send Us a Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
