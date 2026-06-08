export default function About() {
  return (
    <div className="pt-14">
      <section className="bg-navy py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Our Story</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-[0.95]">
            Built by athletes,<br />for athletes.
          </h1>
        </div>
      </section>
      <section className="py-24 bg-lavender">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 max-w-3xl">
          <p className="text-lg text-navy/70 leading-relaxed">
            Collide was born from frustration — endless group chats, missed games, lost stats. We built the platform we wished existed.
          </p>
        </div>
      </section>
    </div>
  )
}
