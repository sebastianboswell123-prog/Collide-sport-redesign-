import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ATHLETES = [
  { name:'Marco P.', pos:'Flyhalf', club:'WP U21', kit:'Predator Navy/Gold + Compression Top', g1:'#0e1b4d', g2:'#4770db', init:'MP' },
  { name:'Siya M.', pos:'Flanker', club:'Sharks Academy', kit:'Warrior Cap + Running Top', g1:'#0a1535', g2:'#1a2a6e', init:'SM' },
  { name:'Thando K.', pos:'Hooker', club:'Bulls U19', kit:'White Tribal Cap', g1:'#080f2e', g2:'#0e1b4d', init:'TK' },
  { name:'Jade V.', pos:'Centre', club:"WP Women's", kit:'Blue Camo Cap + Compression Top', g1:'#1a3a7c', g2:'#4770db', init:'JV' },
  { name:'Liam B.', pos:'Lock', club:'Maties RFC', kit:'Black/Grey Cap', g1:'#1a1a2e', g2:'#0e1b4d', init:'LB' },
  { name:'Naledi S.', pos:'Scrumhalf', club:'Pumas U21', kit:'Green/Black Cap + Undershorts', g1:'#0e2d1b', g2:'#1a5c36', init:'NS' },
]

export default function AthleteSpotlight() {
  return (
    <section className="py-20 bg-lavender">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="text-center mb-14">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Community</p>
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-navy tracking-tight">The Athletes</h2>
          <p className="text-navy/50 text-base mt-3">Meet the players who trust Collide Sport on the field</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATHLETES.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${a.g1}, ${a.g2})` }}
            >
              {/* Large background initials */}
              <div className="absolute inset-0 flex items-center justify-center text-8xl font-black text-white/10 select-none">
                {a.init}
              </div>

              {/* Avatar */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white"
                style={{ top: '35%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
              >
                {a.init}
              </div>

              {/* Info panel — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#080f2e]/90 backdrop-blur-sm p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="font-display font-bold text-white text-lg">{a.name}</h3>
                <p className="text-white/50 text-sm">{a.pos} · {a.club}</p>
                <p className="text-green/80 text-xs mt-2 font-medium">Kit: {a.kit}</p>
              </div>

              {/* Name always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#080f2e]/80 to-transparent p-5 group-hover:opacity-0 transition-opacity">
                <h3 className="font-display font-bold text-white">{a.name}</h3>
                <p className="text-white/50 text-xs">{a.pos}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/contact" className="text-blue font-semibold text-sm hover:text-blue-light transition-colors">
            Apply to become an ambassador →
          </Link>
        </div>
      </div>
    </section>
  )
}
