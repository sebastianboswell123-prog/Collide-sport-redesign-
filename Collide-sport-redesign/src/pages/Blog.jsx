import { motion } from 'framer-motion'

const CATEGORY_COLORS = {
  'Gear Guide': { bg: 'bg-blue/10', text: 'text-blue', gradient: 'from-blue/60 to-blue/30' },
  'Health & Safety': { bg: 'bg-green/10', text: 'text-green', gradient: 'from-green/60 to-green/30' },
  'Player Spotlight': { bg: 'bg-navy/10', text: 'text-navy', gradient: 'from-navy/60 to-navy/30' },
  Training: { bg: 'bg-orange-400/10', text: 'text-orange-500', gradient: 'from-orange-400/60 to-orange-300/30' },
  Tech: { bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500/60 to-purple-400/30' },
  Community: { bg: 'bg-teal-500/10', text: 'text-teal-600', gradient: 'from-teal-500/60 to-teal-400/30' },
}

const ARTICLES = [
  {
    title: 'How to Choose the Right Scrum Cap',
    category: 'Gear Guide',
    date: 'June 10, 2026',
    excerpt:
      "Not all scrum caps are created equal. Here's what to look for when choosing protection for the field.",
    readTime: '4 min',
  },
  {
    title: 'Concussion Prevention in Rugby: What Every Player Needs to Know',
    category: 'Health & Safety',
    date: 'June 5, 2026',
    excerpt:
      'Understanding the risks and how proper headgear can make a difference.',
    readTime: '6 min',
  },
  {
    title: "Meet Marco P. — Western Province's Rising Star",
    category: 'Player Spotlight',
    date: 'May 28, 2026',
    excerpt:
      'From school rugby to provincial colours, Marco shares his journey and why he trusts Collide Sport.',
    readTime: '5 min',
  },
  {
    title: '5 Scrum Drills Every Forward Should Master',
    category: 'Training',
    date: 'May 20, 2026',
    excerpt:
      'Improve your scrummaging technique with these essential drills from professional coaches.',
    readTime: '7 min',
  },
  {
    title: 'The Science Behind Dual Expansion Foam',
    category: 'Tech',
    date: 'May 15, 2026',
    excerpt:
      'How our proprietary foam technology provides superior impact absorption compared to standard padding.',
    readTime: '3 min',
  },
  {
    title: 'Collide Sport x Schools Rugby: Our Partnership Programme',
    category: 'Community',
    date: 'May 10, 2026',
    excerpt:
      "How we're making quality rugby protection accessible to school teams across South Africa.",
    readTime: '4 min',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || { bg: 'bg-navy/10', text: 'text-navy' }
  return (
    <span
      className={`inline-block text-xs font-mono font-semibold tracking-widest uppercase px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}
    >
      {category}
    </span>
  )
}

function GradientPlaceholder({ category, className = '' }) {
  const colors = CATEGORY_COLORS[category] || { gradient: 'from-navy/60 to-navy/30' }
  return (
    <div
      className={`bg-gradient-to-br ${colors.gradient} flex items-center justify-center ${className}`}
    >
      <svg
        className="w-10 h-10 text-white/30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    </div>
  )
}

function FeaturedCard({ article }) {
  const { title, category, date, excerpt, readTime } = article
  return (
    <motion.a
      href="#"
      variants={cardVariants}
      className="group block rounded-2xl overflow-hidden bg-white border border-navy/5 hover:shadow-xl hover:shadow-navy/8 transition-shadow"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <GradientPlaceholder
          category={category}
          className="h-56 sm:h-64 lg:h-full min-h-[280px] rounded-t-2xl lg:rounded-tr-none lg:rounded-l-2xl"
        />
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <CategoryBadge category={category} />
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-navy mt-4 mb-4 leading-tight group-hover:text-blue transition-colors">
            {title}
          </h2>
          <p className="text-navy/55 leading-relaxed mb-6">{excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-navy/40">
            <span>{date}</span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-navy/20" />
            <span>{readTime} read</span>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue group-hover:gap-3 transition-all">
            Read More
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </motion.a>
  )
}

function ArticleCard({ article }) {
  const { title, category, date, excerpt, readTime } = article
  return (
    <motion.a
      href="#"
      variants={cardVariants}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-navy/5 hover:shadow-lg hover:shadow-navy/6 transition-shadow"
    >
      <GradientPlaceholder category={category} className="h-44 sm:h-48" />
      <div className="p-6 flex flex-col flex-1">
        <CategoryBadge category={category} />
        <h3 className="font-display font-bold text-lg text-navy mt-3 mb-3 leading-snug group-hover:text-blue transition-colors">
          {title}
        </h3>
        <p className="text-sm text-navy/50 leading-relaxed flex-1">{excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-navy/40 mt-4 pt-4 border-t border-navy/5">
          <span>{date}</span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-navy/15" />
          <span>{readTime} read</span>
        </div>
      </div>
    </motion.a>
  )
}

export default function Blog() {
  const [featured, ...rest] = ARTICLES

  return (
    <div className="pt-14 min-h-screen bg-lavender">
      {/* Hero */}
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-mono tracking-widest text-blue uppercase mb-3"
          >
            Blog
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-extrabold text-4xl lg:text-6xl text-white tracking-tight"
          >
            The Scrum
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-white/50 max-w-xl"
          >
            Gear guides, player stories, and rugby insights
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-lavender">
        <motion.div
          className="mx-auto max-w-[1440px] px-6 lg:px-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Featured article */}
          <FeaturedCard article={featured} />

          {/* Article grid */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {rest.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
