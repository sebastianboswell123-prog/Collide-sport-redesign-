/**
 * Drop-in <img> with lazy loading, async decoding, and automatic responsive
 * `srcset` generation for Shopify-CDN images (`...?...&width=N`).
 *
 * The browser then downloads a small image on phones and a large, sharp one
 * on desktop / high-DPI — best of both. Pass `sizes` to describe the rendered
 * width (defaults to 100vw, fine for full-bleed media); pass `priority` for the
 * LCP hero (eager + high fetchpriority).
 *
 *   - fill   → absolutely fills the nearest `relative` parent
 *   - width / height → intrinsic dimensions when not using fill
 */

const SRCSET_WIDTHS = [320, 480, 640, 828, 1080, 1280, 1600, 1920]

// Build a responsive srcset from a Shopify-CDN url that has a `width=N` param.
// Exported so raw <img>/<motion.img> elsewhere can reuse it.
export function cdnSrcSet(src) {
  if (typeof src !== 'string' || !/[?&]width=\d+/.test(src)) return undefined
  return SRCSET_WIDTHS
    .map((w) => `${src.replace(/([?&])width=\d+/, `$1width=${w}`)} ${w}w`)
    .join(', ')
}

const buildSrcSet = cdnSrcSet

export default function AppImage({
  src,
  alt = '',
  className = '',
  fill = false,
  width,
  height,
  sizes = '100vw',
  priority = false,
  ...rest
}) {
  const srcSet = buildSrcSet(src)
  const loadingProps = priority
    ? { loading: 'eager', fetchpriority: 'high' }
    : { loading: 'lazy', decoding: 'async' }

  if (fill) {
    return (
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        {...loadingProps}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        {...rest}
      />
    )
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      {...loadingProps}
      className={className}
      {...rest}
    />
  )
}
