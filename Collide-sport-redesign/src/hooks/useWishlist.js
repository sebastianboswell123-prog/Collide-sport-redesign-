import { useState, useEffect } from 'react'

export default function useWishlist() {
  const [count, setCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collide_wishlist') || '[]').length } catch { return 0 }
  })

  useEffect(() => {
    function sync() {
      try { setCount(JSON.parse(localStorage.getItem('collide_wishlist') || '[]').length) } catch { setCount(0) }
    }
    window.addEventListener('storage', sync)
    const t = setInterval(sync, 800)
    return () => { window.removeEventListener('storage', sync); clearInterval(t) }
  }, [])

  return count
}
