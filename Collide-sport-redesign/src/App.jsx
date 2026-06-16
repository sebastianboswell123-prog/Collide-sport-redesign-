import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import Players from './pages/Players'
import Events from './pages/Events'
import Schedule from './pages/Schedule'
import News from './pages/News'
import Join from './pages/Join'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import Catalogue from './pages/Catalogue'
import Cart from './pages/Cart'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import FitFinder from './pages/FitFinder'
import Compare from './pages/Compare'
import TeamKit from './pages/TeamKit'
import Ambassadors from './pages/Ambassadors'
import Blog from './pages/Blog'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import ReturnsPolicy from './pages/ReturnsPolicy'
import Configurator from './pages/Configurator'
import Bundles from './pages/Bundles'
import Sustainability from './pages/Sustainability'
import Lookbook from './pages/Lookbook'
import LoyaltyPage from './pages/LoyaltyPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="features" element={<Features />} />
          <Route path="players" element={<Players />} />
          <Route path="players/:id" element={<Profile />} />
          <Route path="events" element={<Events />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="news" element={<News />} />
          <Route path="join" element={<Join />} />
          <Route path="contact" element={<Contact />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="catalogue/:id" element={<Product />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="returns-policy" element={<ReturnsPolicy />} />
          <Route path="fit-finder" element={<FitFinder />} />
          <Route path="compare" element={<Compare />} />
          <Route path="team-kit" element={<TeamKit />} />
          <Route path="ambassadors" element={<Ambassadors />} />
          <Route path="blog" element={<Blog />} />
          <Route path="configurator" element={<Configurator />} />
          <Route path="bundles" element={<Bundles />} />
          <Route path="sustainability" element={<Sustainability />} />
          <Route path="lookbook" element={<Lookbook />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}
