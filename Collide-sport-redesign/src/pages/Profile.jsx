import { useParams, Link } from 'react-router-dom'
import { PLAYERS } from '../data/players'

export default function Profile() {
  const { id } = useParams()
  const player = PLAYERS.find(p => p.id === Number(id))

  if (!player) {
    return (
      <div className="pt-14 min-h-screen bg-lavender flex items-center justify-center">
        <div className="text-center">
          <p className="font-display font-extrabold text-6xl text-navy/10 mb-4">404</p>
          <p className="font-display font-bold text-xl text-navy mb-2">Player not found</p>
          <Link to="/players" className="text-blue text-sm font-semibold hover:text-blue-light transition-colors">
            ← Back to players
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Games',   value: player.games },
    ...(player.sport === 'Football' || player.sport === 'Rugby'
      ? [{ label: 'Goals', value: player.goals }, { label: 'Assists', value: player.assists }]
      : player.sport === 'Basketball'
      ? [{ label: 'Assists', value: player.assists }]
      : []
    ),
  ]

  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <Link
            to="/players"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white/70 transition-colors mb-6"
          >
            ← Players
          </Link>
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">{player.sport}</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-none">
            {player.name}
          </h1>
          <p className="text-white/50 mt-3">{player.role} · {player.team}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Avatar card */}
            <div className="bg-gradient-to-br from-navy/5 to-blue/10 rounded-2xl aspect-[3/4] lg:aspect-auto lg:min-h-[320px] flex items-end p-6 border border-navy/5">
              <div>
                <p className="text-xs font-mono tracking-widest text-blue uppercase mb-1">{player.sport}</p>
                <p className="font-display font-extrabold text-2xl text-navy">{player.name}</p>
                <p className="text-navy/50 text-sm">{player.role}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 border border-navy/5">
                <h2 className="text-xs font-mono tracking-widest text-navy/40 uppercase mb-5">Career Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {stats.map(({ label, value }) => (
                    <div key={label} className="border-l-2 border-blue/20 pl-4">
                      <p className="font-display font-extrabold text-3xl text-navy">{value}</p>
                      <p className="text-xs text-navy/40 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-navy/5">
                <h2 className="text-xs font-mono tracking-widest text-navy/40 uppercase mb-4">Details</h2>
                <dl className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Team',  value: player.team },
                    { label: 'Sport', value: player.sport },
                    { label: 'Position', value: player.role },
                    { label: 'Status', value: 'Active' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-xs font-mono text-navy/30 uppercase tracking-widest">{label}</dt>
                      <dd className="font-semibold text-navy mt-0.5">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
