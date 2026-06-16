// Brand-accurate payment badges using Tailwind arbitrary values — no inline styles.

export function VisaBadge() {
  return (
    <div title="Visa" className="h-8 px-4 rounded flex items-center justify-center flex-shrink-0 bg-[#1A1F71]">
      <span className="font-black italic text-[15px] text-white tracking-[2px] leading-none select-none"
        style={{ fontFamily: '"Arial Black","Arial Bold",Arial,sans-serif' }}>
        VISA
      </span>
    </div>
  )
}

export function MastercardBadge() {
  return (
    <div title="Mastercard" className="h-8 px-3 rounded flex items-center gap-2 flex-shrink-0 bg-white">
      <div className="relative w-[34px] h-[22px] flex-shrink-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-[#EB001B]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-[#F79E1B] opacity-[0.88]" />
      </div>
      <span className="text-[10px] font-medium text-[#333333] tracking-[0.2px] leading-none select-none"
        style={{ fontFamily: 'Arial,sans-serif' }}>
        mastercard
      </span>
    </div>
  )
}

export function PayFastBadge() {
  return (
    <div title="PayFast" className="h-8 px-3 rounded flex items-center flex-shrink-0 bg-white">
      <span className="font-extrabold text-[13px] text-[#0066CC] leading-none select-none"
        style={{ fontFamily: '"Arial Black",Arial,sans-serif' }}>
        Pay
      </span>
      <span className="font-extrabold text-[13px] text-[#FF6600] leading-none select-none"
        style={{ fontFamily: '"Arial Black",Arial,sans-serif' }}>
        Fast
      </span>
    </div>
  )
}
