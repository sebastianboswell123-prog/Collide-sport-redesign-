/**
 * CollideLogo — scrum cap shield badge + wordmark
 *
 * Props
 *   size      'sm' | 'md' | 'lg' | 'xl'   default 'sm'
 *   variant   'dark' | 'light'
 *               dark  = navy badge + navy text  (on light bg — Navbar)
 *               light = white badge + white text (on dark bg — Footer / pages)
 *   layout    'inline' | 'stacked'
 *               inline  = SPORT right of COLLIDE  (Navbar)
 *               stacked = SPORT below COLLIDE      (Footer / hero sections)
 *   showSport boolean   default true
 *   className string
 */

const SIZES = {
  sm: { iconH: 28, collide: 'text-[20px]', sport: '6px',  gap: 8  },
  md: { iconH: 36, collide: 'text-[28px]', sport: '8px',  gap: 10 },
  lg: { iconH: 56, collide: 'text-[46px]', sport: '12px', gap: 12 },
  xl: { iconH: 84, collide: 'text-[70px]', sport: '18px', gap: 16 },
}

// Scrum cap shield badge
// ViewBox 36×40 — shield outer, cap dome + ear flaps + chin band inside,
// lightning bolt running through the centre foam-pad strip.
function ScrimCapIcon({ height, variant }) {
  const w     = Math.round(height * 0.9)   // 36:40 ≈ 0.9 aspect ratio
  const dark  = variant === 'dark'
  const shield = dark ? '#0e1b4d' : '#ffffff'
  const cap    = dark ? 'rgba(255,255,255,0.88)' : 'rgba(14,27,77,0.82)'
  // Lightning: blue glow + white crack (dark) / navy crack (light)
  const bolt   = dark ? '#ffffff' : '#0e1b4d'

  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 36 40"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Shield frame — sports badge shape */}
      <path
        d="M3,7 C3,4 6,1 10,1 H26 C30,1 33,4 33,7 V24 C33,35 18,39 18,39 C18,39 3,35 3,24 Z"
        fill={shield}
      />

      {/* Cap dome arc — skull-cap profile */}
      <path
        d="M8,20 C8,9 28,9 28,20"
        stroke={cap} strokeWidth="2.2" strokeLinecap="round"
      />

      {/* Left ear flap — the detail that makes it read as a scrum cap */}
      <path
        d="M8,20 L6,26 C5,30 8,33 12,32 L14,23 L14,20"
        stroke={cap} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Right ear flap */}
      <path
        d="M28,20 L30,26 C31,30 28,33 24,32 L22,23 L22,20"
        stroke={cap} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Chin strap band — closes the cap shape at the jaw */}
      <line x1="14" y1="23" x2="22" y2="23" stroke={cap} strokeWidth="1.6" opacity="0.6" />

      {/* Centre foam-pad strip (subtle background fill) */}
      <rect x="16.5" y="9" width="3" height="14" rx="1.5" fill={cap} opacity="0.18" />

      {/* Lightning bolt — blue energy glow layer */}
      <path
        d="M19.5,9 L15,20 L18.5,20 L15,31 L21.5,19 L18,19 Z"
        fill="#4770db" opacity="0.55"
      />
      {/* Lightning bolt — sharp crack on top */}
      <path
        d="M19.5,9 L15,20 L18.5,20 L15,31 L21.5,19 L18,19 Z"
        fill={bolt} opacity={dark ? 0.92 : 0.88}
      />
    </svg>
  )
}

export default function CollideLogo({
  size      = 'sm',
  variant   = 'dark',
  layout    = 'inline',
  showSport = true,
  className = '',
}) {
  const s = SIZES[size]
  const wordColor  = variant === 'light' ? '#ffffff'               : '#0e1b4d'
  const sportColor = variant === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(14,27,77,0.4)'

  const icon = <ScrimCapIcon height={s.iconH} variant={variant} />

  const wordmark = (
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
  )

  if (layout === 'inline') {
    return (
      <div
        className={`inline-flex items-center select-none ${className}`}
        style={{ gap: s.gap }}
      >
        {icon}
        <div className="inline-flex items-end" style={{ gap: 6 }}>
          {wordmark}
          {showSport && (
            <span
              className="font-display font-semibold uppercase leading-none"
              style={{ fontSize: s.sport, color: sportColor, letterSpacing: '0.28em', marginBottom: '3px' }}
            >
              SPORT™
            </span>
          )}
        </div>
      </div>
    )
  }

  // stacked — SPORT below COLLIDE, icon left of both
  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap: s.gap }}
    >
      {icon}
      <div className="flex flex-col items-start leading-none" style={{ gap: 3 }}>
        {wordmark}
        {showSport && (
          <span
            className="font-display font-semibold uppercase leading-none"
            style={{ fontSize: s.sport, color: sportColor, letterSpacing: '0.28em' }}
          >
            SPORT™
          </span>
        )}
      </div>
    </div>
  )
}
