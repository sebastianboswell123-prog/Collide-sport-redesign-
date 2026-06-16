/**
 * Drop-in replacement for <img> that enforces lazy loading and async decoding.
 * Mirrors the Next.js <Image /> contract for portability:
 *   - fill   → absolutely fills the nearest `relative` parent (like Next.js fill)
 *   - width / height → sets intrinsic dimensions when not using fill
 * All other props (className, onLoad, onError, etc.) pass straight through.
 */
export default function AppImage({
  src,
  alt = '',
  className = '',
  fill = false,
  width,
  height,
  ...rest
}) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        {...rest}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
      {...rest}
    />
  )
}
