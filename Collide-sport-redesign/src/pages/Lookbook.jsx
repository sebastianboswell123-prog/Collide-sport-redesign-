import { useState } from 'react'
import { motion } from 'framer-motion'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

const ALL_ITEMS = [
  { img:`${CDN}/Sabre_Sport_Banner_2_02d6cd8e-fd57-410e-baac-c9e18c9daaa4.jpg?v=1689090191&width=800`, tag:'Match Day',    tall:true },
  { img:`${CDN}/TribelLeft.jpg?v=1696703994&width=533`,                                                  tag:'Pro Series',   tall:false },
  { img:`${CDN}/Warrior_Scrum_Cap.jpg?v=1724349324&width=533`,                                           tag:'Training',     tall:false },
  { img:`${CDN}/2_4240e760-94b0-44bb-8213-0b752403e682.jpg?v=1715450720&width=800`,                     tag:'Match Day',    tall:true },
  { img:`${CDN}/ScrumCap-Navy_Gold.jpg?v=1689063348&width=533`,                                          tag:'Team Kit',     tall:false },
  { img:`${CDN}/Sabre_Sport_Banner_3_48fe279e-896b-4f4f-8ecc-42d42a6427a3.jpg?v=1689316782&width=800`, tag:'School Rugby', tall:true },
  { img:`${CDN}/ScrumCap-Turquoise_White.jpg?v=1689063382&width=533`,                                    tag:'Team Kit',     tall:false },
  { img:`${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533`,                                   tag:'Training',     tall:false },
  { img:`${CDN}/PHOTO-2023-09-22-12-03-492.jpg?v=1696703796&width=533`,                                  tag:'Pro Series',   tall:false },
  { img:`${CDN}/ScrumCap-RoyalBlue_Black_1.jpg?v=1689015686&width=533`,                                  tag:'Match Day',    tall:false },
  { img:`${CDN}/52E885BC-C2E8-4007-8B49-04A5AC567F56.jpg?v=1750614416&width=533`,                       tag:'Pro Series',   tall:true },
  { img:`${CDN}/SabreRunningTop-Black_1.jpg?v=1689063515&width=533`,                                     tag:'Training',     tall:false },
]

const FILTERS = ['All', 'Match Day', 'Training', 'Team Kit', 'School Rugby', 'Pro Series']

const TAG_COLOURS = {
  'Match Day':    'bg-blue/80',
  'Training':     'bg-green/80',
  'Team Kit':     'bg-navy/80',
  'School Rugby': 'bg-orange-500/80',
  'Pro Series':   'bg-purple-600/80',
}

export default function Lookbook() {
  const [filter, setFilter] = useState('All')
  const [count, setCount] = useState(ALL_ITEMS.length)

  const filtered = (filter === 'All' ? ALL_ITEMS : ALL_ITEMS.filter(i => i.tag === filter))
  const displayed = filtered.slice(0, count).concat(
    count > ALL_ITEMS.length ? [...filtered].slice(0, count - ALL_ITEMS.length) : []
  ).slice(0, Math.max(count, filtered.length))

  return (
    <div className="pt-14 min-h-screen bg-navy-dark">
      {/* Hero */}
      <div className="py-20 px-6 text-center">
        <p className="font-mono text-xs tracking-widest text-blue uppercase mb-4">Visual Journal</p>
        <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-[0.95] mb-4">The Lookbook</h1>
        <p className="text-white/40 font-mono text-sm">Real players. Real protection. Real moments.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap justify-center px-6 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-4 py-2 rounded-full transition-colors border ${filter === f ? 'bg-blue text-white border-blue' : 'border-white/15 text-white/50 hover:border-white/40 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="px-4 lg:px-8 columns-2 md:columns-3 lg:columns-4 gap-3">
        {displayed.map((item, i) => (
          <motion.div
            key={`${item.img}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="break-inside-avoid mb-3 rounded-xl overflow-hidden relative group cursor-pointer"
          >
            <img
              src={item.img}
              alt={item.tag}
              className="w-full object-cover"
              style={{ height: item.tall ? '360px' : '220px' }}
            />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100">
              <span className={`text-[10px] font-bold text-white uppercase tracking-wider px-2.5 py-1 rounded-full ${TAG_COLOURS[item.tag] || 'bg-navy/80'}`}>
                {item.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load more */}
      <div className="text-center py-12 px-6 space-y-4">
        <button
          onClick={() => setCount(c => c + 6)}
          className="border border-white/20 text-white/60 font-semibold px-8 py-3 rounded-full hover:border-white/50 hover:text-white transition-colors text-sm"
        >
          Load More
        </button>
        <p className="text-white/30 text-sm">
          Tag us{' '}
          <a href="https://instagram.com/collide_sport" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            @collide_sport ↗
          </a>
          {' '}on Instagram
        </p>
      </div>
    </div>
  )
}
