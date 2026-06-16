import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import AppImage from '../components/ui/AppImage'

const CDN = 'https://collidesport.co.za/cdn/shop/files'

const COLOURS = [
  { label:'Black',      hex:'#1a1a1a' },
  { label:'Navy',       hex:'#0e1b4d' },
  { label:'Blue',       hex:'#4770db' },
  { label:'Green',      hex:'#47db71' },
  { label:'White',      hex:'#f5f5f5' },
  { label:'Red',        hex:'#DC2626' },
  { label:'Gold',       hex:'#FFD700' },
  { label:'Turquoise',  hex:'#40E0D0' },
]

const BASE_CAPS = [
  { label:'Classic Black', img:`${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533` },
  { label:'Navy/Gold',     img:`${CDN}/ScrumCap-Navy_Gold.jpg?v=1689063348&width=533` },
  { label:'Tribal',        img:`${CDN}/TribelLeft.jpg?v=1696703994&width=533` },
  { label:'Warrior',       img:`${CDN}/Warrior_Scrum_Cap.jpg?v=1724349324&width=533` },
]

export default function Configurator() {
  const { addToCart } = useCart()
  const [shellColour, setShellColour] = useState('Navy')
  const [padColour, setPadColour]     = useState('Black')
  const [nameText, setNameText]       = useState('')
  const [baseCap, setBaseCap]         = useState(0)
  const [added, setAdded]             = useState(false)

  const shellHex = COLOURS.find(c => c.label === shellColour)?.hex || '#0e1b4d'
  const price = 700 + (nameText.trim() ? 50 : 0)

  function handleAdd() {
    addToCart({
      id: 9000 + baseCap,
      name: `Custom Cap${nameText.trim() ? ` — ${nameText.trim()}` : ''} (${shellColour}/${padColour})`,
      price,
      image: BASE_CAPS[baseCap].img,
      category: 'custom',
      stock: 10,
      colours: [shellColour],
      badge: 'Custom',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="pt-14 min-h-screen bg-lavender">
      {/* Header */}
      <div className="bg-navy py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Personalise</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-white tracking-tight">Build Your Cap</h1>
          <p className="text-white/50 mt-3">Design a scrum cap that's uniquely yours</p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1200px] px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Preview */}
        <div className="bg-white rounded-2xl p-8 text-center sticky top-20">
          <h2 className="font-display font-bold text-navy text-lg mb-6">Your Custom Cap</h2>

          <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-lavender">
            <AppImage src={BASE_CAPS[baseCap].img} alt="base cap" className="w-full h-full object-cover" />
            <div className="absolute inset-0 rounded-2xl" style={{ background: shellHex, opacity: 0.45, mixBlendMode: 'color' }} />
            {nameText.trim() && (
              <div className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold text-white tracking-widest uppercase" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                {nameText.trim()}
              </div>
            )}
            <span className="absolute top-3 right-3 bg-blue text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Custom Build</span>
          </div>

          <div className="mt-6 font-display font-extrabold text-3xl text-navy">R {price.toLocaleString()}</div>
          {nameText.trim() && <p className="text-xs text-navy/40 mt-1">Includes R50 embroidery fee</p>}

          <button
            onClick={handleAdd}
            className={`w-full mt-5 py-3.5 rounded-full font-semibold transition-colors ${added ? 'bg-green text-navy' : 'bg-blue text-white hover:bg-blue-light'}`}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          <Link to="/catalogue" className="block text-sm text-navy/40 hover:text-navy mt-3 transition-colors">Browse standard caps →</Link>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 space-y-7">

          {/* Shell colour */}
          <div>
            <h3 className="font-display font-bold text-navy mb-3">Shell Colour — <span className="text-blue font-normal">{shellColour}</span></h3>
            <div className="flex flex-wrap gap-2.5">
              {COLOURS.map(c => (
                <button
                  key={c.label}
                  onClick={() => setShellColour(c.label)}
                  title={c.label}
                  className={`w-9 h-9 rounded-full transition-all ${shellColour === c.label ? 'ring-2 ring-blue ring-offset-2 scale-110' : 'hover:scale-105'} ${c.label === 'White' ? 'border border-navy/20' : ''}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Pad colour */}
          <div>
            <h3 className="font-display font-bold text-navy mb-3">Pad Colour — <span className="text-blue font-normal">{padColour}</span></h3>
            <div className="flex flex-wrap gap-2.5">
              {COLOURS.map(c => (
                <button
                  key={c.label}
                  onClick={() => setPadColour(c.label)}
                  title={c.label}
                  className={`w-9 h-9 rounded-full transition-all ${padColour === c.label ? 'ring-2 ring-blue ring-offset-2 scale-110' : 'hover:scale-105'} ${c.label === 'White' ? 'border border-navy/20' : ''}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Name embroidery */}
          <div>
            <h3 className="font-display font-bold text-navy mb-1">Name / Number <span className="text-navy/40 font-normal text-sm">+R50</span></h3>
            <p className="text-xs text-navy/40 mb-3">Leave blank to skip embroidery</p>
            <input
              type="text"
              maxLength={12}
              value={nameText}
              onChange={e => setNameText(e.target.value)}
              placeholder="e.g. MARCO 7"
              className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy outline-none focus:border-blue transition-colors bg-lavender/40"
            />
          </div>

          {/* Base cap */}
          <div>
            <h3 className="font-display font-bold text-navy mb-3">Choose Base Cap</h3>
            <div className="flex gap-3 flex-wrap">
              {BASE_CAPS.map((cap, i) => (
                <button
                  key={i}
                  onClick={() => setBaseCap(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${baseCap === i ? 'border-blue scale-105' : 'border-transparent hover:border-navy/20'}`}
                >
                  <AppImage src={cap.img} alt={cap.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-lavender rounded-xl p-4 text-sm space-y-1.5 text-navy/70">
            <div className="flex justify-between"><span>Shell:</span><span className="font-semibold text-navy">{shellColour}</span></div>
            <div className="flex justify-between"><span>Pads:</span><span className="font-semibold text-navy">{padColour}</span></div>
            <div className="flex justify-between"><span>Embroidery:</span><span className="font-semibold text-navy">{nameText.trim() || 'None'}</span></div>
            <div className="flex justify-between"><span>Base:</span><span className="font-semibold text-navy">{BASE_CAPS[baseCap].label}</span></div>
            <div className="border-t border-navy/10 pt-2 flex justify-between font-display font-bold text-navy text-base">
              <span>Total</span><span>R {price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
