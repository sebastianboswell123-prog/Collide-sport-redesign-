const EVENTS = [
  { title: 'City League Opener', date: 'Jun 14, 2026', sport: 'Football', location: 'Riverside Arena' },
  { title: 'Summer 3v3 Tournament', date: 'Jun 21, 2026', sport: 'Basketball', location: 'Central Courts' },
  { title: 'Regional Finals', date: 'Jul 5, 2026', sport: 'Rugby', location: 'North Stadium' },
  { title: 'Mixed Doubles Open', date: 'Jul 12, 2026', sport: 'Tennis', location: 'Eastfield Club' },
]

export default function Events() {
  return (
    <div className="pt-14">
      <section className="bg-navy-dark py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Upcoming</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">Events</h1>
        </div>
      </section>

      <section className="py-16 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 space-y-4">
          {EVENTS.map(({ title, date, sport, location }) => (
            <div key={title} className="bg-white rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-navy/5 hover:shadow-lg hover:shadow-navy/5 transition-all">
              <div>
                <span className="text-xs font-mono tracking-widest text-blue uppercase">{sport}</span>
                <h2 className="font-display font-bold text-xl text-navy mt-1">{title}</h2>
                <p className="text-sm text-navy/50 mt-1">{location}</p>
              </div>
              <div className="flex items-center gap-6 lg:gap-10">
                <span className="font-mono text-sm text-navy/40">{date}</span>
                <button className="bg-blue text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-light transition-colors whitespace-nowrap">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
