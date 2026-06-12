import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileBottomBar from './MobileBottomBar'
import WhatsAppButton from '../WhatsAppButton'
import NewsletterPopup from '../NewsletterPopup'
import CartFlyProvider from '../CartFlyAnimation'
import MagneticCursor from '../MagneticCursor'
import MatchDayBanner from '../MatchDayBanner'
import EasterEgg from '../EasterEgg'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <CartFlyProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pb-16 lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileBottomBar />
        <NewsletterPopup />
        <MagneticCursor />
        <MatchDayBanner />
        <EasterEgg />
      </div>
    </CartFlyProvider>
  )
}
