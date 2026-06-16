import { useState } from 'react'
import { useCurrency } from '../context/CurrencyContext'

export default function CurrencySelector() {
  const { currency, setCurrency, currencies } = useCurrency()
  const [open, setOpen] = useState(false)

  const current = currencies[currency]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs font-medium border border-navy/15 rounded-full px-3 py-1.5 hover:border-blue transition-colors text-navy/60 hover:text-navy"
      >
        <span>{current.flag}</span>
        <span>{current.code}</span>
        <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-white border border-navy/10 rounded-xl shadow-lg p-1 z-50 min-w-[110px]">
            {Object.values(currencies).map(c => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false) }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-lg text-left transition-colors ${currency === c.code ? 'bg-lavender text-navy font-semibold' : 'text-navy/60 hover:bg-lavender/60'}`}
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
