import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileBottomBar from './MobileBottomBar'
import WhatsAppButton from '../WhatsAppButton'
import NewsletterPopup from '../NewsletterPopup'
import CartFlyProvider from '../CartFlyAnimation'
import MatchDayBanner from '../MatchDayBanner'
import EasterEgg from '../EasterEgg'
import Seo from '../Seo'
import { PRODUCTS } from '../../data/products'

// Per-route meta (title + description). Dynamic product pages are handled below.
const SEO_MAP = {
  '__default':        { title: null,            description: 'Premium rugby scrum caps and activewear, designed in South Africa and built for the field. Free delivery over R1,000.' },
  '/':                { title: null,            description: 'Premium rugby scrum caps and activewear, designed in South Africa and built for the field. Trusted by players across SA.' },
  '/catalogue':       { title: 'Shop Scrum Caps & Activewear', description: "Browse Collide Sport's full range of rugby scrum caps, premium caps and activewear. Free delivery over R1,000." },
  '/about':           { title: 'About Us',      description: 'The Collide Sport story — South African rugby protection, engineered for every level of the game.' },
  '/contact':         { title: 'Contact',       description: 'Get in touch with Collide Sport via WhatsApp, email or our contact form. We reply within one business day.' },
  '/cart':            { title: 'Your Cart',     description: 'Review your Collide Sport cart and check out securely.' },
  '/checkout':        { title: 'Checkout',      description: 'Secure checkout — delivery details, shipping and PayFast payment.' },
  '/order-confirmation': { title: 'Order Confirmed', description: 'Thank you for your Collide Sport order.' },
  '/fit-finder':      { title: 'Fit Finder',    description: 'Find your perfect scrum cap size and fit with the Collide Sport Fit Finder.' },
  '/team-kit':        { title: 'Team Kit',      description: 'Kit out your club or school team with Collide Sport scrum caps. Bulk & custom orders.' },
  '/compare':         { title: 'Compare Caps',  description: 'Compare Collide Sport scrum caps side by side to choose the right protection.' },
  '/blog':            { title: 'The Scrum — Blog', description: 'Rugby tips, gear guides and stories from Collide Sport.' },
  '/ambassadors':     { title: 'Ambassadors',   description: 'Meet the players and teams who wear Collide Sport on the field.' },
}

function getMeta(pathname) {
  const pm = pathname.match(/^\/product\/(.+)$/)
  if (pm) {
    const p = PRODUCTS.find(x => String(x.id) === pm[1])
    if (p) {
      const price = p.salePrice ?? p.price
      return {
        title: p.name,
        description: `${p.name} — R${price}. Premium rugby protection from Collide Sport. Free delivery over R1,000, 14-day returns.`,
        type: 'product',
        image: p.image.replace(/width=\d+/, 'width=1200'),
      }
    }
  }
  return SEO_MAP[pathname] || SEO_MAP.__default
}

export default function Layout() {
  const { pathname } = useLocation()
  const meta = getMeta(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <CartFlyProvider>
      <Seo {...meta} />

      {/* Skip link — first focusable element for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Skip to content
      </a>

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 pb-16 lg:pb-0 outline-none">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileBottomBar />
        <NewsletterPopup />
        <MatchDayBanner />
        <EasterEgg />
      </div>
    </CartFlyProvider>
  )
}
