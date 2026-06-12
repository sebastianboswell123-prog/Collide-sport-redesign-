import Lenis from 'lenis'
import { useEffect } from 'react'

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    let raf
    function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      lenis.destroy()
      cancelAnimationFrame(raf)
    }
  }, [])
}
