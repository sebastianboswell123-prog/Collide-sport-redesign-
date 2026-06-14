import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CollideLogo from '../components/CollideLogo'

export default function NotFound() {
  return (
    <section className="min-h-screen bg-navy-dark grid-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center"
      >
        <div className="mb-6">
          <CollideLogo size="lg" variant="light" layout="stacked" />
        </div>
        <p className="font-mono text-xs tracking-widest text-blue uppercase mb-4">404 — Page Not Found</p>
        <h1 className="font-display font-extrabold text-[clamp(5rem,20vw,12rem)] leading-none text-white/10 tracking-tight select-none">
          404
        </h1>
        <p className="text-white/50 text-lg mt-4 mb-10">
          This page doesn't exist. It may have moved or the URL is wrong.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-light transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </section>
  )
}
