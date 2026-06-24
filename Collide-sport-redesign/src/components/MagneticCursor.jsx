import { useState, useEffect, useRef, useCallback } from 'react'

export function useMagnetic() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let bounds
    function onEnter() {
      bounds = el.getBoundingClientRect()
    }
    function onMove(e) {
      if (!bounds) return
      const cx = bounds.left + bounds.width / 2
      const cy = bounds.top + bounds.height / 2
      const dx = (e.clientX - cx) * 0.22
      const dy = (e.clientY - cy) * 0.22
      el.style.transform = `translate(${dx}px, ${dy}px)`
      el.style.transition = 'transform 0.2s ease'
    }
    function onLeave() {
      el.style.transform = 'translate(0,0)'
      bounds = null
    }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return ref
}

export default function MagneticCursor() {
  const [mounted, setMounted] = useState(false)
  const [hover, setHover] = useState('default')
  const ringRef = useRef(null)
  const rx = useRef(0)
  const ry = useRef(0)
  const tx = useRef(0)
  const ty = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return
    setMounted(true)

    function onMove(e) {
      tx.current = e.clientX
      ty.current = e.clientY
      document.body.style.setProperty('--cx', e.clientX + 'px')
      document.body.style.setProperty('--cy', e.clientY + 'px')
    }

    function onOver(e) {
      const el = e.target
      if (el.closest('.group')) setHover('card')
      else if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('button, a')) setHover('cta')
      else setHover('default')
    }

    let raf
    function loop() {
      rx.current += (tx.current - rx.current) * 0.12
      ry.current += (ty.current - ry.current) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx.current}px, ${ry.current}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.body.style.cursor = ''
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!mounted) return null

  const ringSize = hover === 'card' ? 60 : hover === 'cta' ? 48 : 40

  return (
    <>
      {/* Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full bg-[#0e1b4d] -translate-x-1/2 -translate-y-1/2"
        style={{ transform: `translate(calc(var(--cx, -20px) - 50%), calc(var(--cy, -20px) - 50%))`, opacity: hover === 'card' ? 0 : 1, transition: 'opacity 0.2s' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-[#0e1b4d]/30 flex items-center justify-center"
        style={{
          width: ringSize,
          height: ringSize,
          background: hover === 'cta' ? 'rgba(71,112,219,0.07)' : 'transparent',
          borderColor: hover === 'cta' ? 'rgba(71,112,219,0.5)' : 'rgba(14,27,77,0.25)',
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.2s, background 0.2s',
        }}
      >
        {hover === 'card' && <span style={{ fontSize: 8, fontWeight: 700, color: '#0e1b4d', letterSpacing: 1 }}>VIEW</span>}
      </div>
    </>
  )
}
