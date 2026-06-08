import { Link } from 'react-router-dom'

const LINKS = {
  Product:  ['Catalogue', 'Features', 'Players', 'Events', 'Schedule'],
  Company:  ['About', 'News', 'Contact'],
}

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white pt-16 pb-8">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <span className="font-display font-extrabold text-2xl tracking-tight">
              COLLIDE<span className="text-blue">.</span>
            </span>
            <p className="mt-3 text-sm text-white/50 max-w-xs leading-relaxed">
              The sports platform built for teams that play hard and grow together.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Collide Sport. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/20">Privacy</span>
            <span className="text-xs text-white/20">Terms</span>
            <Link
              to="/join"
              className="text-xs font-semibold text-blue hover:text-blue-light transition-colors"
            >
              Play Hard →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
