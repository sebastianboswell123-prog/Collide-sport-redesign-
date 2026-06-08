import { Link } from 'react-router-dom'

const PLAYERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Player ${i + 1}`,
  sport: ['Football', 'Basketball', 'Tennis', 'Rugby'][i % 4],
  role: ['Forward', 'Guard', 'Singles', 'Flanker'][i % 4],
}))

export default function Players() {
  return (
    <div className="pt-14">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Roster</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">Players</h1>
        </div>
      </section>

      <section className="py-16 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAYERS.map(({ id, name, sport, role }) => (
              <Link
                key={id}
                to={`/players/${id}`}
                className="bg-white rounded-2xl overflow-hidden border border-navy/5 group hover:shadow-lg hover:shadow-navy/5 transition-all"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-navy/5 to-blue/10 relative">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-mono tracking-widest text-blue uppercase">{sport}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-navy">{name}</h3>
                  <p className="text-sm text-navy/50">{role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
