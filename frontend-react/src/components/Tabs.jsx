const TABS = [
  { key: 'game', label: 'Play' },
  { key: 'pokedex', label: 'Pokedex' },
  { key: 'stats', label: 'Stats' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'regions', label: 'Regions' },
  { key: 'leaderboard', label: 'Leaderboard' },
]
export default function Tabs({ active, onChange }) {
  return (
    <nav className="flex gap-1.5 flex-wrap mb-4">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`border rounded-lg px-3.5 py-1.5 text-xs font-mono transition-all duration-200 ease-out ${
            active === t.key
              ? 'bg-redDim text-white border-red shadow-[0_0_0_1px_rgba(227,53,13,0.3),0_4px_12px_rgba(227,53,13,0.25)] scale-[1.03]'
              : 'bg-panel text-muted border-panelBorder hover:text-text hover:border-muted hover:-translate-y-0.5'
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}