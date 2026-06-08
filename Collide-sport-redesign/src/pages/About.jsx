export default function About() {
  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Our Story</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-[0.95]">
            Built by athletes,<br />for athletes.
          </h1>
        </div>
      </section>

      <section className="py-24 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-lg text-navy/70 leading-relaxed mb-6">
              Collide was born from frustration — endless group chats, missed games, lost stats. We built the platform we wished existed.
            </p>
            <p className="text-lg text-navy/70 leading-relaxed mb-6">
              We're a team of athletes and engineers who got tired of managing sport through spreadsheets and WhatsApp. So we built something better.
            </p>
            <p className="text-lg text-navy/70 leading-relaxed">
              Today, Collide helps thousands of players, coaches, and teams stay organised, track performance, and connect with their community — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            {[
              { value: '2023', label: 'Founded' },
              { value: '12K+', label: 'Players' },
              { value: '850+', label: 'Teams' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white rounded-2xl p-8 border border-navy/5">
                <p className="font-display font-extrabold text-4xl text-navy">{value}</p>
                <p className="text-sm text-navy/50 mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
