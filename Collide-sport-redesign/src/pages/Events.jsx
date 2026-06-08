const EVENTS = [
  { title: 'City League Opener',    date: 'Jun 14, 2026', sport: 'Football',   location: 'Riverside Arena',  spots: 12 },
  { title: 'Summer 3v3 Tournament', date: 'Jun 21, 2026', sport: 'Basketball', location: 'Central Courts',   spots: 8  },
  { title: 'Regional Finals',       date: 'Jul 5, 2026',  sport: 'Rugby',      location: 'North Stadium',    spots: 0  },
  { title: 'Mixed Doubles Open',    date: 'Jul 12, 2026', sport: 'Tennis',     location: 'Eastfield Club',   spots: 5  },
  { title: 'Youth Skills Day',      date: 'Jul 19, 2026', sport: 'Football',   location: 'Collide Hub',      spots: 20 },
  { title: 'Coaches Symposium',     date: 'Aug 2, 2026',  sport: 'Multi-Sport',location: 'Conference Centre',spots: 30 },
]

export default function Events() {
  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy-dark py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Upcoming</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">Events</h1>
        </div>
      </section>

      <section className="py-16 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 space-y-4">
          {EVENTS.map(({ title, date, sport, location, spots }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-navy/5 hover:shadow-lg hover:shadow-navy/5 transition-all"
            >
              <div>
                <span className="text-xs font-mono tracking-widest text-blue uppercase">{sport}</span>
                <h2 className="font-display font-bold text-xl text-navy mt-1">{title}</h2>
                <p className="text-sm text-navy/50 mt-1">{location}</p>
              </div>
              <div className="flex items-center gap-6 lg:gap-10 flex-shrink-0">
                <span className="font-mono text-sm text-navy/40">{date}</span>
                {spots === 0 ? (
                  <span className="bg-navy/8 text-navy/40 text-sm font-semibold px-5 py-2 rounded-full whitespace-nowrap">
                    Full
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-navy/40 font-mono whitespace-nowrap">{spots} spots left</span>
                    <button className="bg-blue text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-light transition-colors whitespace-nowrap">
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
