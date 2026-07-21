export default function StatsGrid({ state }) {
  const s = state.stats
  const clueShop = state.clue_shop

  function mostUsedClue(usage) {
    const entries = Object.entries(usage || {})
    if (entries.length === 0) return '--'
    entries.sort((a, b) => b[1] - a[1])
    const key = entries[0][0]
    return clueShop[key] ? clueShop[key].label : key
  }

  const cards = [
    ['Total Score', s.total_score],
    ['Pokemon Found', s.correct_guesses],
    ['Rounds Played', s.rounds_played],
    ['Coins Spent', s.coins_spent_total],
    ['Best Round', s.best_round_score],
    ['Revealed (Gave Up)', s.revealed_count],
    ['Fastest Guess', s.fastest_guess_seconds != null ? `${s.fastest_guess_seconds}s` : '--'],
    ['Most Used Clue', mostUsedClue(s.clue_usage)],
  ]

  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
      {cards.map(([label, value]) => (
        <div key={label} className="bg-panel border border-panelBorder rounded-lg p-3">
          <div className="text-[10px] text-muted uppercase tracking-wide">{label}</div>
          <div className="font-pixel text-base mt-1.5 text-phosphor">{value}</div>
        </div>
      ))}
    </div>
  )
}
