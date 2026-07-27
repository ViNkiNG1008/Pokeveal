import { CLUE_ICONS } from './icons.jsx'

const TIERS = ['cheap', 'medium', 'expensive', 'premium']
const TIER_LABELS = { cheap: 'Cheap', medium: 'Medium', expensive: 'Expensive', premium: 'Premium' }

export default function ClueShop({ clueShop, round, onBuy }) {
  const byTier = TIERS.map((tier) => ({
    tier,
    entries: Object.entries(clueShop).filter(([, info]) => info.tier === tier),
  }))

  return (
    <div className="flex flex-col gap-1.5">
      {byTier.map(({ tier, entries }) => (
        <div key={tier}>
          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-pixel mb-1 flex items-center gap-1.5">
            <span>{TIER_LABELS[tier]}</span>
            <span className="flex-1 h-px bg-slate-700/50" />
          </div>
          <div className="grid gap-1.5 grid-cols-2">
            {entries.map(([key, info]) => {
              const owned = round.bought_clues.includes(key)
              const disabled = owned || info.cost > round.coins_remaining
              const Icon = CLUE_ICONS[key]

              return (
                <button
                  key={key}
                  disabled={disabled}
                  onClick={() => onBuy(key)}
                  className={`flex items-center justify-between gap-1.5 p-1.5 px-2.5 rounded-lg border-2 shadow-xs transition-all duration-150 text-left select-none ${
                    owned
                      ? 'bg-[#1b4332]/10 border-[#2d6a4f] text-[#1b4332] shadow-inner'
                      : disabled
                      ? 'bg-[#e2dcc8] border-[#8a9988]/50 opacity-40 grayscale cursor-not-allowed'
                      : 'bg-[#f5f0dc] border-[#1b4332] text-[#142319] hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(27,67,50,0.2)] active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 ${
                      owned ? 'bg-[#2d6a4f] text-white' : 'bg-[#1b4332] text-[#f5f0dc]'
                    }`}>
                      {Icon ? <Icon className="w-3 h-3" /> : null}
                    </div>
                    <span className="text-[11px] font-extrabold truncate font-mono">
                      {info.label}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {owned ? (
                      <span className="bg-[#2d6a4f] text-white px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                        Owned
                      </span>
                    ) : (
                      <span className="bg-[#2d6a4f] text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                        {info.cost}c
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}