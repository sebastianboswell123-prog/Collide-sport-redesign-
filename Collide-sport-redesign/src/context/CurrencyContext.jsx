import { createContext, useContext, useState, useEffect } from 'react'

const CURRENCIES = {
  ZAR: { symbol: 'R', rate: 1, code: 'ZAR', flag: '🇿🇦' },
  USD: { symbol: '$', rate: 0.053, code: 'USD', flag: '🇺🇸' },
  GBP: { symbol: '£', rate: 0.042, code: 'GBP', flag: '🇬🇧' },
  BWP: { symbol: 'P', rate: 0.73, code: 'BWP', flag: '🇧🇼' },
}

function detectCurrency() {
  try {
    const stored = localStorage.getItem('collide_currency')
    if (stored && CURRENCIES[stored]) return stored
  } catch { /* ignore */ }
  return 'ZAR'
}

const CurrencyContext = createContext(null)

export function useCurrency() {
  return useContext(CurrencyContext)
}

export default function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState('ZAR')

  useEffect(() => {
    setCurrencyState(detectCurrency())
  }, [])

  function setCurrency(code) {
    setCurrencyState(code)
    try { localStorage.setItem('collide_currency', code) } catch { /* ignore */ }
  }

  function formatPrice(zarAmount) {
    const c = CURRENCIES[currency]
    const amount = zarAmount * c.rate
    if (currency === 'ZAR') return `${c.symbol} ${Math.round(amount).toLocaleString()}`
    return `${c.symbol}${amount.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  )
}
