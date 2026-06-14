/**
 * CollideLogo — the original Collide Sport wordmark
 *
 * The original brand logo as it appeared on collidesport.co.za:
 * bold italic "COLLIDE" with white lightning cracks through the letters,
 * "SPORT" below-right, ™ top-right. Sourced from the original CDN asset
 * (COLLIDE_TM_SPORT.png) and bundled locally.
 *
 * The artwork is black-on-transparent. For the `light` variant (used on
 * dark backgrounds) it is inverted to render white.
 *
 * Props (API kept stable across the four placements)
 *   size      'sm' | 'md' | 'lg' | 'xl'   default 'sm'
 *   variant   'dark' | 'light'
 *               dark  = black wordmark   (on light bg — Navbar)
 *               light = white wordmark   (on dark bg — Footer / pages)
 *   layout    'inline' | 'stacked'        (accepted for API compatibility;
 *                                          the wordmark is a single unit)
 *   showSport boolean                     (accepted; logo always includes SPORT)
 *   className string
 */

import logoUrl from '../assets/collide-logo.png'

// Logo natural aspect ratio ≈ 600 × 180 (10:3). Heights tuned per slot.
const HEIGHTS = {
  sm: 24,   // Navbar
  md: 40,   // Footer
  lg: 60,   // 404 page
  xl: 96,   // About hero
}

export default function CollideLogo({
  size      = 'sm',
  variant   = 'dark',
  layout,        // eslint-disable-line no-unused-vars — kept for API compatibility
  showSport,     // eslint-disable-line no-unused-vars — logo always includes SPORT
  className = '',
}) {
  const height = HEIGHTS[size] ?? HEIGHTS.sm

  return (
    <img
      src={logoUrl}
      alt="Collide Sport"
      height={height}
      className={`inline-block w-auto select-none ${className}`}
      style={{
        height,
        // black artwork → white on dark backgrounds
        filter: variant === 'light' ? 'invert(1)' : 'none',
      }}
      draggable={false}
    />
  )
}
