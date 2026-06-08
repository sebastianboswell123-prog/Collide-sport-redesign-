const ARTICLES = [
  {
    title: 'Collide reaches 10,000 players',
    date: 'Jun 1, 2026',
    tag: 'Milestone',
    excerpt: 'A huge moment for the platform — ten thousand athletes are now managing their sport through Collide.',
  },
  {
    title: 'New coaching tools dropped',
    date: 'May 20, 2026',
    tag: 'Product',
    excerpt: 'Session planning, drill boards, and squad fitness tracking are live for all Pro coaches.',
  },
  {
    title: 'Season recap: Spring League',
    date: 'May 10, 2026',
    tag: 'Community',
    excerpt: "Over 200 games, 48 teams, and one unforgettable final. Here's how the Spring League unfolded.",
  },
  {
    title: 'Collide expands to rugby and tennis',
    date: 'Apr 28, 2026',
    tag: 'Product',
    excerpt: 'Sport-specific features for rugby and tennis are now available — fixtures, scorecards, and more.',
  },
  {
    title: 'Meet the coaches shaping the next generation',
    date: 'Apr 15, 2026',
    tag: 'Community',
    excerpt: 'We sat down with five coaches using Collide to share how technology is changing youth development.',
  },
  {
    title: 'Platform performance upgrades',
    date: 'Apr 3, 2026',
    tag: 'Engineering',
    excerpt: 'Faster load times, improved sync, and a new notification system rolled out across all devices.',
  },
]

export default function News() {
  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Latest</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">News</h1>
        </div>
      </section>

      <section className="py-16 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map(({ title, date, tag, excerpt }) => (
              <article
                key={title}
                className="bg-white rounded-2xl p-6 border border-navy/5 hover:shadow-lg hover:shadow-navy/5 transition-all flex flex-col"
              >
                <span className="text-xs font-mono tracking-widest text-blue uppercase">{tag}</span>
                <h2 className="font-display font-bold text-lg text-navy mt-3 mb-3 leading-snug">{title}</h2>
                <p className="text-sm text-navy/50 leading-relaxed flex-1">{excerpt}</p>
                <p className="text-xs font-mono text-navy/30 mt-4">{date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
