import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CurrencyProvider from './context/CurrencyContext.jsx'
import CurtainReveal from './components/CurtainReveal.jsx'
import useLenis from './hooks/useLenis.js'

function Root() {
  useLenis()
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <CurtainReveal />
    </CurrencyProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
