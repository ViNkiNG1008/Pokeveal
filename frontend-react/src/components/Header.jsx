import { useEffect, useRef, useState } from 'react'
import { CoinIcon, BookIcon, POKEBALL_IMG } from './icons.jsx'

export default function Header({ state }) {
  return (
    <header className="flex items-center gap-3 mb-5">
      <img src={POKEBALL_IMG} alt="" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(227,53,13,0.5)]" />
      <div>
        <h1 className="font-pixel font-semibold text-lg tracking-wide text-text">POKÉVEAL</h1>
        <div className="text-muted text-[11px] mt-0.5">reveal clues · save coins · catch them all</div>
      </div>
    </header>
  )
}

export function StatsBar({ state }) {
  const showHud = !!state
  if (!showHud) return null
  return (
    <div className="flex gap-2.5 flex-wrap animate-slideDown">
      <Chip imgIcon={POKEBALL_IMG} label="Round" value={state.completed ? '--' : `${state.round.round_number}/${state.round.total_rounds}`} color="text-text" />
      <Chip icon={CoinIcon} label="Coins" value={state.completed ? '--' : state.round.coins_remaining} color="text-gold" />
      <Chip icon={BookIcon} label="Pokedex" value={`${state.pokedex_collected}/${state.pokedex_total}`} color="text-phosphor" />
    </div>
  )
}

export function UserAvatar({ username, className = '' }) {
  const initial = username ? username.charAt(0).toUpperCase() : '?'
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-pixel text-xs font-semibold text-white flex-shrink-0 border border-panelBorder shadow-inner ${className}`}
      style={{ background: 'linear-gradient(135deg, #e3350d, #f4b400)' }}
    >
      {initial}
    </div>
  )
}

function Chip({ icon: Icon, imgIcon, label, value, color }) {
  const [pop, setPop] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      setPop(true)
      prev.current = value
      const t = setTimeout(() => setPop(false), 350)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <div className="bg-panel border border-panelBorder rounded-xl px-3 py-2 flex items-center gap-2.5 min-w-[104px] transition-all duration-200 hover:border-muted hover:-translate-y-0.5">
      <span className="w-6 h-6 rounded-lg bg-screen flex items-center justify-center flex-shrink-0 text-phosphorDim overflow-hidden">
        {imgIcon ? <img src={imgIcon} alt="" className="w-4 h-4 object-contain" /> : Icon && <Icon className="w-3.5 h-3.5" />}
      </span>
      <div>
        <div className="text-[9px] text-muted uppercase tracking-wider">{label}</div>
        <div className={`font-pixel font-medium text-sm mt-0.5 ${color} ${pop ? 'animate-coinPop' : ''}`}>{value}</div>
      </div>
    </div>
  )
}