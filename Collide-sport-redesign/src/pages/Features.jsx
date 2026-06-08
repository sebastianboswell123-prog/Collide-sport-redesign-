const FEATURES = [
  {
    title: 'Smart Scheduling',
    category: 'Organisation',
    desc: "Auto-generate fixtures around your squad's availability. Avoid clashes, set recurring sessions, and send instant reminders.",
  },
  {
    title: 'Player Profiles',
    category: 'Performance',
    desc: 'Track stats, form, and history across every session. Compare across seasons and share your highlights.',
  },
  {
    title: 'Live Events',
    category: 'Community',
    desc: 'Stream live scores, event updates, and match highlights as they happen. Keep the whole club in the loop.',
  },
  {
    title: 'Coach Tools',
    category: 'Coaching',
    desc: 'Drill boards, session plans, and performance insights. Communicate lineups and tactics in one place.',
  },
  {
    title: 'Team Chat',
    category: 'Communication',
    desc: 'Threaded discussions, announcements, and direct messaging — no more lost info in group chats.',
  },
  {
    title: 'Stats & Analytics',
    category: 'Performance',
    desc: 'From goals to attendance, track what matters. Visual dashboards make it easy to spot trends.',
  },
]

export default function Features() {
  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy-dark py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Features</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-[0.95]">
            One platform.<br />Everything sport.
          </h1>
        </div>
      </section>

      <section className="py-24 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ title, category, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 border border-navy/5 hover:shadow-xl hover:shadow-navy/5 transition-all group"
              >
                <span className="text-xs font-mono tracking-widest text-blue uppercase">{category}</span>
                <h2 className="font-display font-bold text-xl text-navy mt-3 mb-3">{title}</h2>
                <p className="text-sm text-navy/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
