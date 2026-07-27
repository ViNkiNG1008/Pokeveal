export default function DailyChallenge({ dc }) {
  if (!dc) return null
  const pct = Math.min(100, Math.round((dc.progress / dc.target) * 100))
  const done = dc.progress >= dc.target

  return (
    <div className="bg-black/25 border border-white/10 rounded-xl p-3.5 mt-2 shadow-inner backdrop-blur-sm">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-pixel">Daily Challenge</div>
        {done && <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">✓ Done</span>}
      </div>
      <div className="text-xs font-semibold text-white mb-0.5">Guess {dc.target} Pokémon</div>
      <div className="text-[11px] text-slate-400 mb-2">Reward: <span className="text-gold font-bold">{dc.reward} Coins</span></div>
      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-gold shadow-[0_0_8px_rgba(255,203,5,0.6)]' : 'bg-emerald-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[11px] text-slate-400 mt-1.5 text-right font-mono">{Math.min(dc.progress, dc.target)}/{dc.target}</div>
    </div>
  )
}