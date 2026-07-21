const TIERS = ['cheap', 'medium', 'expensive', 'premium']
const TIER_LABELS = { cheap: 'Cheap', medium: 'Medium', expensive: 'Expensive', premium: 'Premium' }

export default function ClueShop({ clueShop, round, onBuy }) {
  const byTier = TIERS.map((tier) => ({
    tier,
    entries: Object.entries(clueShop).filter(([, info]) => info.tier === tier),
  }))

  return (
    <div>
      {byTier.map(({ tier, entries }) => (
        <div key={tier} className="mb-1">
          <div className="text-[10px] uppercase tracking-widest text-muted mb-1.5 flex items-center gap-2">
            <span>{TIER_LABELS[tier]}</span>
            <span className="flex-1 h-px bg-panelBorder" />
          </div>
          <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {entries.map(([key, info]) => {
              const owned = round.bought_clues.includes(key)
              const disabled = owned || info.cost > round.coins_remaining
              return (
                <button
                  key={key}
                  disabled={disabled}
                  onClick={() => onBuy(key)}
                  className={`flex justify-between items-center gap-2 text-left border rounded-lg px-2.5 py-2 text-xs font-mono transition-all duration-150 ease-out ${
                    owned
                      ? 'border-phosphorDim text-phosphor bg-panel animate-popIn'
                      : 'border-panelBorder bg-panel text-text'
                  } ${
                    disabled
                      ? 'opacity-40 cursor-default'
                      : 'hover:border-gold hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(255,203,5,0.15)] cursor-pointer active:translate-y-0'
                  }`}
                >
                  <span>{owned ? '✓ ' : ''}{info.label}</span>
                  <span className="text-gold font-semibold whitespace-nowrap">{info.cost}c</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}