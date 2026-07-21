import { useEffect, useRef, useState } from 'react'

export default function Header({ state }) {
  const showHud = !!state
  return (
    <header className="flex items-center justify-between gap-4 flex-wrap mb-5">
      <div className="flex items-center gap-3">
        <span className="w-3.5 h-3.5 rounded-full bg-red shadow-[0_0_12px_#e3350d] animate-pulseSoft" />
        <div>
          <h1 className="font-pixel text-sm tracking-wide">POKEVEAL</h1>
          <div className="text-muted text-[11px] mt-0.5">reveal clues · save coins · catch them all</div>
        </div>
      </div>

      {showHud && (
        <div className="flex gap-2.5 flex-wrap animate-slideDown">
          <Chip label="Round" value={state.completed ? '--' : `${state.round.round_number}/${state.round.total_rounds}`} color="text-text" />
          <Chip label="Coins" value={state.completed ? '--' : state.round.coins_remaining} color="text-gold" />
          <Chip label="Pokedex" value={`${state.pokedex_collected}/${state.pokedex_total}`} color="text-phosphor" />
        </div>
      )}
    </header>
  )
}

function Chip({ label, value, color }) {
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
    <div className="bg-panel border border-panelBorder rounded-lg px-3 py-2 flex flex-col min-w-[92px] transition-all duration-200 hover:border-muted hover:-translate-y-0.5">
      <div className="text-[9px] text-muted uppercase tracking-wider">{label}</div>
      <div className={`font-pixel text-sm mt-1 ${color} ${pop ? 'animate-coinPop' : ''}`}>{value}</div>
    </div>
  )
}