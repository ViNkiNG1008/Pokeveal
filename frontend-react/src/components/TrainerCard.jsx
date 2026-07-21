function getRank(totalScore) {
  if (totalScore >= 5000) return 'Master'
  if (totalScore >= 2500) return 'Ultra'
  if (totalScore >= 1000) return 'Great'
  if (totalScore >= 300) return 'Poke'
  return 'Rookie'
}

export default function TrainerCard({ username, stats, region, onClose }) {
  const accuracy = stats.rounds_played > 0
    ? Math.round((stats.correct_guesses / stats.rounds_played) * 100)
    : 0
  const level = Math.floor((stats.correct_guesses || 0) / 10) + 1
  const rank = getRank(stats.total_score || 0)
  const regionLabel = region ? region.charAt(0).toUpperCase() + region.slice(1) : '—'

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-popIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-[#12253f] to-[#050d1a] border-2 border-gold rounded-2xl p-6 w-full max-w-[320px] shadow-[0_0_40px_rgba(255,203,5,0.2)]"
      >
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-pixel text-2xl font-semibold text-white border-2 border-gold shadow-inner mb-2"
            style={{ background: 'linear-gradient(135deg, #e3350d, #f4b400)' }}
          >
            {username ? username.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="font-pixel text-lg text-text">{username}</div>
          <div className="text-[11px] text-muted">Lv. {level} Trainer</div>
        </div>

        <div className="border-t border-panelBorder pt-3 space-y-2 text-[13px]">
          <Row label="Accuracy" value={`${accuracy}%`} />
          <Row label="Best Streak" value={stats.best_streak ?? 0} />
          <Row label="Coins Earned" value={stats.total_score ?? 0} />
          <Row label="Region" value={regionLabel} />
          <Row label="Rank" value={rank} color="text-gold" />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 border border-panelBorder text-muted hover:text-text hover:border-muted rounded-lg px-3.5 py-2 text-xs font-mono transition-all duration-150"
        >
          Close
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, color = 'text-text' }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted">{label}</span>
      <span className={`font-pixel font-medium ${color}`}>{value}</span>
    </div>
  )
}