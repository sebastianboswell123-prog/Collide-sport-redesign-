/**
 * CollideLogo — scalable brand wordmark with lightning-crack effect
 *
 * Props
 *   size     'sm' | 'md' | 'lg' | 'xl'  default 'sm'
 *   variant  'dark' | 'light'            dark = navy text (on light bg)
 *                                        light = white text (on dark bg)
 *   layout   'stacked' | 'inline'        stacked = SPORT below, inline = SPORT right
 *   showSport boolean                    show "SPORT™" sub-label
 *   className string
 */

const SIZES = {
  sm: { collide: 'text-[22px]', sport: 'text-[7px]',  crack: 2,   glow: 6   },
  md: { collide: 'text-[30px]', sport: 'text-[9px]',  crack: 2.5, glow: 7.5 },
  lg: { collide: 'text-[52px]', sport: 'text-[14px]', crack: 3.5, glow: 11  },
  xl: { collide: 'text-[80px]', sport: 'text-[20px]', crack: 5,   glow: 16  },
}

// Lightning bolt path inside a 20×60 viewBox.
// Enters top-centre, zigzags (classic ⚡ shape), exits lower-left.
// Positioned at left:42%, width:20% of the wordmark container so it
// falls on the "L-L-I" zone of COLLIDE.
const BOLT  = 'M10,1 L3.5,27 L11.5,27 L4.5,59'
const BRANCH = 'M11.5,27 L17,44'

let _uid = 0
function uid() { return `clg${++_uid}` }

export default function CollideLogo({
  size      = 'sm',
  variant   = 'dark',
  layout    = 'inline',
  showSport = true,
  className = '',
}) {
  const id = uid()
  const s  = SIZES[size]

  const wordColor  = variant === 'light' ? '#ffffff'    : '#0e1b4d'
  const sportColor = variant === 'light' ? 'rgba(255,255,255,0.45)' : 'rgba(14,27,77,0.38)'

  // The wordmark + bolt SVG block
  const wordmark = (
    <div className="relative inline-block leading-none flex-shrink-0">
      {/* Text — italic via skewX */}
      <span
        className={`font-display font-black ${s.collide} tracking-tight leading-none`}
        style={{
          color:           wordColor,
          display:         'inline-block',
          transform:       'skewX(-10deg)',
          transformOrigin: 'bottom left',
        }}
      >
        COLLIDE
      </span>

      {/* Lightning overlay — 42-62 % of text width, covers L-L-I zone */}
      <svg
        aria-hidden="true"
        className="absolute top-0 h-full pointer-events-none"
        style={{ left: '42%', width: '20%' }}
        viewBox="0 0 20 60"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
      >
        {/* Blue energy glow — wide, soft */}
        <path d={BOLT}   stroke="#4770db" strokeWidth={s.glow}        fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
        <path d={BRANCH} stroke="#4770db" strokeWidth={s.glow * 0.65} fill="none" strokeLinecap="round"                        opacity="0.22" />

        {/* White crack — sharp, bright */}
        <path d={BOLT}   stroke="#ffffff" strokeWidth={s.crack}        fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={BRANCH} stroke="#ffffff" strokeWidth={s.crack * 0.65} fill="none" strokeLinecap="round" opacity="0.82" />

        {/* Tiny spark dots at the kink point */}
        <circle cx="11.5" cy="27" r={s.crack * 0.9} fill="#4770db" opacity="0.7" />
        <circle cx="11.5" cy="27" r={s.crack * 0.45} fill="#ffffff" />
      </svg>
    </div>
  )

  const sportLabel = showSport && (
    <span
      className={`font-display font-semibold uppercase tracking-[0.28em] leading-none flex-shrink-0`}
      style={{
        fontSize:  s.sport,
        color:     sportColor,
        letterSpacing: '0.28em',
      }}
    >
      SPORT™
    </span>
  )

  if (layout === 'inline') {
    return (
      <div className={`inline-flex items-end gap-1.5 select-none ${className}`}>
        {wordmark}
        {sportLabel && (
          <span
            className="font-display font-semibold uppercase leading-none flex-shrink-0"
            style={{ fontSize: s.sport, color: sportColor, letterSpacing: '0.28em', marginBottom: '3px' }}
          >
            SPORT™
          </span>
        )}
      </div>
    )
  }

  // stacked
  return (
    <div className={`inline-flex flex-col items-start select-none leading-none gap-[3px] ${className}`}>
      {wordmark}
      {showSport && (
        <span
          className="font-display font-semibold uppercase self-end leading-none"
          style={{ fontSize: s.sport, color: sportColor, letterSpacing: '0.28em' }}
        >
          SPORT™
        </span>
      )}
    </div>
  )
}
