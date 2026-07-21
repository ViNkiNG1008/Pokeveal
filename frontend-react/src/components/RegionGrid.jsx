const REGIONS = [
  { key: 'kanto', label: 'Kanto', count: 151 },
  { key: 'johto', label: 'Johto', count: 100 },
  { key: 'hoenn', label: 'Hoenn', count: 135 },
  { key: 'sinnoh', label: 'Sinnoh', count: 107 },
  { key: 'unova', label: 'Unova', count: 156 },
  { key: 'kalos', label: 'Kalos', count: 72 },
  { key: 'alola', label: 'Alola', count: 88 },
  { key: 'galar', label: 'Galar', count: 89 },
  { key: 'paldea', label: 'Paldea', count: 120 },
]

export default function RegionGrid({ regionState, onPick }) {
  const unlockedMap = Object.fromEntries((regionState || []).map((r) => [r.key, r.unlocked]))

  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
      {REGIONS.map((r, i) => {
        const playable = r.key === 'kanto'
        const unlocked = unlockedMap[r.key] ?? (r.key === 'kanto')
        const locked = !playable
        const icon = !unlocked ? '🔒' : playable ? '▶' : '⏳'
        return (
          <div
            key={r.key}
            onClick={() => (playable ? onPick(r.key) : onPick(null, true))}
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
            className={`animate-popIn bg-panel border border-panelBorder rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ease-out ${
              locked
                ? 'opacity-45 hover:opacity-60'
                : 'hover:border-gold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,203,5,0.15)] active:translate-y-0'
            }`}
          >
            <div className="text-2xl transition-transform duration-200">{icon}</div>
            <h3 className="text-xs mt-2 mb-1">{r.label}</h3>
            <div className="text-[11px] text-muted">{r.count} Pokemon</div>
          </div>
        )
      })}
    </div>
  )
}