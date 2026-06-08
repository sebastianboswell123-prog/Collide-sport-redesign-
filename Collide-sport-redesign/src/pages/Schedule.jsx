const SESSIONS = [
  { id: 1, title: 'City FC — Training',         day: 'Mon', time: '18:00', venue: 'Riverside Arena',  sport: 'Football',   type: 'Training'  },
  { id: 2, title: 'Storm RFC — Match vs Eagles', day: 'Sat', time: '14:00', venue: 'North Stadium',    sport: 'Rugby',      type: 'Match'     },
  { id: 3, title: 'Eastside Ballers — Practice', day: 'Tue', time: '19:30', venue: 'Central Courts',   sport: 'Basketball', type: 'Training'  },
  { id: 4, title: 'City FC — Match vs United',   day: 'Sat', time: '10:00', venue: 'City Ground',      sport: 'Football',   type: 'Match'     },
  { id: 5, title: 'Riverside Club — Drills',     day: 'Wed', time: '07:00', venue: 'Eastfield Club',   sport: 'Tennis',     type: 'Training'  },
  { id: 6, title: 'Storm RFC — Strength & Conditioning', day: 'Thu', time: '06:30', venue: 'Collide Hub', sport: 'Rugby', type: 'Fitness' },
  { id: 7, title: 'Youth Academy — Skills Day',  day: 'Sun', time: '09:00', venue: 'Collide Hub',      sport: 'Multi-Sport',type: 'Academy'   },
]

const TYPE_COLOURS = {
  Match:    'bg-blue/10 text-blue',
  Training: 'bg-green/15 text-green-dim',
  Fitness:  'bg-navy/8 text-navy/60',
  Academy:  'bg-lavender-dark text-navy/60',
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Schedule() {
  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">This Week</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">Schedule</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          {/* Day-grouped list */}
          <div className="flex flex-col gap-8">
            {DAYS.filter(day => SESSIONS.some(s => s.day === day)).map(day => (
              <div key={day}>
                <h2 className="text-xs font-mono tracking-widest text-navy/40 uppercase mb-3">{day}</h2>
                <div className="flex flex-col gap-3">
                  {SESSIONS.filter(s => s.day === day).map(({ id, title, time, venue, sport, type }) => (
                    <div
                      key={id}
                      className="bg-white rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-navy/5 hover:shadow-md hover:shadow-navy/5 transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <span className="font-mono text-sm text-navy/40 w-12 flex-shrink-0 pt-0.5 sm:pt-0">{time}</span>
                        <div>
                          <h3 className="font-display font-bold text-navy text-sm">{title}</h3>
                          <p className="text-xs text-navy/40 mt-0.5">{venue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-mono tracking-widest text-blue/70 uppercase">{sport}</span>
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${TYPE_COLOURS[type] ?? 'bg-lavender text-navy/50'}`}>
                          {type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
