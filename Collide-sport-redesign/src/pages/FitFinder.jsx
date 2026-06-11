import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'

/* ── Quiz questions ─────────────────────────────────────────────────────── */

const QUESTIONS = [
  {
    key: 'headSize',
    heading: "What's your head circumference?",
    options: [
      { label: 'Small (52-54cm)', value: 'small' },
      { label: 'Medium (55-57cm)', value: 'medium' },
      { label: 'Large (58-60cm)', value: 'large' },
      { label: 'Not sure', value: 'unsure' },
    ],
  },
  {
    key: 'position',
    heading: 'What position do you play?',
    options: [
      { label: 'Forward (Prop, Hooker, Lock)', value: 'forward' },
      { label: 'Back Row (Flanker, No.8)', value: 'backrow' },
      { label: 'Backs (Scrumhalf to Fullback)', value: 'backs' },
      { label: 'Multiple positions', value: 'multiple' },
    ],
  },
  {
    key: 'level',
    heading: 'What level do you play?',
    options: [
      { label: 'School / Junior', value: 'school' },
      { label: 'Club / Amateur', value: 'club' },
      { label: 'Semi-Pro / Professional', value: 'pro' },
    ],
  },
  {
    key: 'style',
    heading: 'Style preference?',
    options: [
      { label: 'Classic solid colours', value: 'classic' },
      { label: 'Bold patterns & camo', value: 'camo' },
      { label: 'Tribal designs', value: 'tribal' },
      { label: 'Premium / special edition', value: 'premium' },
    ],
  },
  {
    key: 'budget',
    heading: 'Budget?',
    options: [
      { label: 'Under R500', value: 'under500' },
      { label: 'R500 — R600', value: '500to600' },
      { label: 'R650+', value: '650plus' },
      { label: 'No limit', value: 'nolimit' },
    ],
  },
]

/* ── Recommendation logic ───────────────────────────────────────────────── */

function scoreCap(product, answers) {
  let score = 0
  const name = product.name.toLowerCase()

  // Style matching
  if (answers.style === 'tribal') {
    if (name.includes('tribal') || name.includes('warrior')) score += 10
  } else if (answers.style === 'camo') {
    if (name.includes('camo') || product.colours?.includes('Camo')) score += 10
  } else if (answers.style === 'premium') {
    if (product.category === 'premium-caps') score += 10
    if (product.badge === 'Premium') score += 5
  } else if (answers.style === 'classic') {
    const hasCamo = name.includes('camo') || product.colours?.includes('Camo')
    const hasTribal = name.includes('tribal') || name.includes('warrior') || name.includes('graffiti')
    if (!hasCamo && !hasTribal) score += 8
  }

  // Budget matching
  if (answers.budget === 'under500') {
    if (product.price < 500) score += 8
    else if (product.price <= 550) score += 2
  } else if (answers.budget === '500to600') {
    if (product.price >= 500 && product.price <= 600) score += 8
  } else if (answers.budget === '650plus' || answers.budget === 'nolimit') {
    if (product.category === 'premium-caps') score += 6
    if (product.price >= 650) score += 5
  }

  // Level matching — pros get premium, school gets affordable
  if (answers.level === 'pro') {
    if (product.category === 'premium-caps') score += 4
    if (name.includes('predator')) score += 3
  } else if (answers.level === 'school') {
    if (product.price <= 500) score += 4
  }

  // Position — forwards favour durability (premium / warrior)
  if (answers.position === 'forward') {
    if (name.includes('warrior') || name.includes('predator')) score += 3
    if (product.category === 'premium-caps') score += 2
  } else if (answers.position === 'backs') {
    if (name.includes('tribal') || answers.style === 'camo') score += 2
  }

  // New badge bonus — surface fresh products
  if (product.badge === 'New') score += 2

  // In-stock bonus
  if (product.stock > 5) score += 1

  return score
}

function getRecommendations(answers) {
  const caps = PRODUCTS.filter(
    (p) => p.category === 'scrum-caps' || p.category === 'premium-caps'
  )
  const scored = caps.map((p) => ({ product: p, score: scoreCap(p, answers) }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 3).map((s) => s.product)
}

/* ── Animation variants ─────────────────────────────────────────────────── */

const pageVariants = {
  enter: (dir) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -280 : 280, opacity: 0 }),
}

const pageTransition = { type: 'tween', duration: 0.35, ease: 'easeInOut' }

/* ── Component ──────────────────────────────────────────────────────────── */

export default function FitFinder() {
  const { addToCart } = useCart()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [direction, setDirection] = useState(1)
  const [done, setDone] = useState(false)
  const [addedIds, setAddedIds] = useState(new Set())

  const totalSteps = QUESTIONS.length
  const question = QUESTIONS[step]
  const currentAnswer = answers[question?.key]

  const recommendations = useMemo(
    () => (done ? getRecommendations(answers) : []),
    [done, answers]
  )

  function selectOption(value) {
    setAnswers((prev) => ({ ...prev, [question.key]: value }))
  }

  function next() {
    if (step < totalSteps - 1) {
      setDirection(1)
      setStep((s) => s + 1)
    } else {
      setDirection(1)
      setDone(true)
    }
  }

  function back() {
    if (step > 0) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  function retake() {
    setAnswers({})
    setStep(0)
    setDone(false)
    setDirection(-1)
    setAddedIds(new Set())
  }

  function handleAddToCart(product) {
    addToCart(product)
    setAddedIds((prev) => new Set(prev).add(product.id))
  }

  /* ── Progress bar ──────────────────────────────────────────────────────── */

  const progressPercent = done ? 100 : ((step + 1) / totalSteps) * 100

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0e1b4d] via-[#0e1b4d]/95 to-[#0b1537] text-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-8 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
          style={{ fontFamily: 'var(--font-display, "Montserrat", sans-serif)' }}
        >
          Cap Fit Finder
        </h1>
        <p className="text-white/60 text-lg">
          Answer 5 quick questions and we'll recommend the perfect scrum cap for you.
        </p>
      </div>

      {/* Progress bar */}
      <div className="max-w-xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between text-sm text-white/50 mb-2">
          <span>{done ? 'Complete' : `Step ${step + 1} of ${totalSteps}`}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#4770db] to-[#47db71]"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-2xl mx-auto px-4 pb-24" style={{ minHeight: 420 }}>
        <AnimatePresence mode="wait" custom={direction}>
          {!done ? (
            <motion.div
              key={step}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              {/* Question heading */}
              <h2
                className="text-2xl md:text-3xl font-bold text-center mb-8"
                style={{ fontFamily: 'var(--font-display, "Montserrat", sans-serif)' }}
              >
                {question.heading}
              </h2>

              {/* Option cards — 2x2 grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {question.options.map((opt) => {
                  const selected = currentAnswer === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => selectOption(opt.value)}
                      className={`
                        relative rounded-xl border-2 p-5 text-left transition-all duration-200
                        cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4770db]/50
                        ${
                          selected
                            ? 'border-[#4770db] bg-[#4770db]/10 shadow-lg shadow-[#4770db]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8'
                        }
                      `}
                    >
                      {/* Selection indicator */}
                      <span
                        className={`
                          absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${selected ? 'border-[#4770db] bg-[#4770db]' : 'border-white/30 bg-transparent'}
                        `}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="text-base md:text-lg font-semibold leading-snug pr-6">
                        {opt.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                {step > 0 ? (
                  <button
                    onClick={back}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={next}
                  disabled={!currentAnswer}
                  className={`
                    px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200
                    ${
                      currentAnswer
                        ? 'bg-[#4770db] hover:bg-[#3a5fc5] text-white shadow-lg shadow-[#4770db]/25 cursor-pointer'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }
                  `}
                >
                  {step === totalSteps - 1 ? 'See Results' : 'Next'}
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Results ──────────────────────────────────────────────── */
            <motion.div
              key="results"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-center mb-2"
                style={{ fontFamily: 'var(--font-display, "Montserrat", sans-serif)' }}
              >
                Your Recommended Caps
              </h2>
              <p className="text-center text-white/50 mb-8">
                Based on your preferences, here are our top picks for you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                {recommendations.map((product) => {
                  const inCart = addedIds.has(product.id)
                  return (
                    <div
                      key={product.id}
                      className="rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-[#0b1537]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {product.badge && (
                          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded bg-[#4770db] text-white">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <Link
                          to={`/catalogue?categories=${product.category}`}
                          className="text-sm font-semibold leading-snug hover:text-[#4770db] transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[#47db71] font-bold mt-2">
                          R{product.price.toLocaleString()}
                        </p>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={inCart}
                          className={`
                            mt-3 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                            ${
                              inCart
                                ? 'bg-[#47db71]/20 text-[#47db71] cursor-default'
                                : 'bg-[#4770db] hover:bg-[#3a5fc5] text-white cursor-pointer shadow-md shadow-[#4770db]/20'
                            }
                          `}
                        >
                          {inCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={retake}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retake Quiz
                </button>
                <Link
                  to="/catalogue"
                  className="px-6 py-3 rounded-lg bg-[#4770db] hover:bg-[#3a5fc5] text-white text-sm font-semibold transition-all shadow-md shadow-[#4770db]/20"
                >
                  Browse All Caps
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
