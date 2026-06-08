import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
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
      </Route>
    </Routes>
  )
}
