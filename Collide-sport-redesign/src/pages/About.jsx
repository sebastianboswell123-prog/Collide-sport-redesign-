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
    </div>
  )
}
