const ARTICLES = [
  { title: 'Collide reaches 10,000 players', date: 'Jun 1, 2026', tag: 'Milestone' },
  { title: 'New coaching tools dropped', date: 'May 20, 2026', tag: 'Product' },
  { title: 'Season recap: Spring League', date: 'May 10, 2026', tag: 'Community' },
]

export default function News() {
  return (
    <div className="pt-14">
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Latest</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight">News</h1>
        </div>
      </section>
      <section className="py-16 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map(({ title, date, tag }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-navy/5 hover:shadow-lg hover:shadow-navy/5 transition-all">
              <span className="text-xs font-mono tracking-widest text-blue uppercase">{tag}</span>
              <h2 className="font-display font-bold text-lg text-navy mt-3 mb-4">{title}</h2>
              <p className="text-xs font-mono text-navy/30">{date}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
