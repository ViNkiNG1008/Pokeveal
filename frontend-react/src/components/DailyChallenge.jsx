export default function DailyChallenge({ dc }) {
  if (!dc) return null
  const pct = Math.min(100, Math.round((dc.progress / dc.target) * 100))
  const done = dc.progress >= dc.target

  return (
    <div className="bg-panel border border-panelBorder rounded-xl p-3.5 mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[10px] uppercase tracking-wider text-muted font-pixel">Daily Challenge</div>
        {done && <span className="text-[10px] text-gold">✓ Done</span>}
      </div>
      <div className="text-[12.5px] text-text mb-0.5">Guess {dc.target} Pokemon</div>
      <div className="text-[11px] text-muted mb-2">Reward: {dc.reward} Coins</div>
      <div className="w-full h-2 rounded-full bg-screen overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-gold' : 'bg-phosphor'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[11px] text-muted mt-1.5 text-right">{Math.min(dc.progress, dc.target)}/{dc.target}</div>
    </div>
  )
}