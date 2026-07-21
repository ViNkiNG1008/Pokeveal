import { TrophyIcon, TargetIcon, LayersIcon, CoinIcon, StarIcon, EyeIcon, ClockIcon, TagIcon } from './icons.jsx'

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
    ['Total Score', s.total_score, TrophyIcon],
    ['Pokemon Found', s.correct_guesses, TargetIcon],
    ['Rounds Played', s.rounds_played, LayersIcon],
    ['Coins Spent', s.coins_spent_total, CoinIcon],
    ['Best Round', s.best_round_score, StarIcon],
    ['Revealed (Gave Up)', s.revealed_count, EyeIcon],
    ['Fastest Guess', s.fastest_guess_seconds != null ? `${s.fastest_guess_seconds}s` : '--', ClockIcon],
    ['Most Used Clue', mostUsedClue(s.clue_usage), TagIcon],
  ]

  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
      {cards.map(([label, value, Icon], i) => (
        <div
          key={label}
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
          className="animate-popIn bg-panel border border-panelBorder rounded-lg p-3 transition-all duration-200 hover:border-muted hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-screen flex items-center justify-center flex-shrink-0 text-gold">
              <Icon className="w-3.5 h-3.5" />
            </span>
            <div className="text-[10px] text-muted uppercase tracking-wide">{label}</div>
          </div>
          <div className="font-pixel font-medium text-base mt-2 text-phosphor">{value}</div>
        </div>
      ))}
    </div>
  )
}