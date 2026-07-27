import { LockIcon, HourglassIcon, POKEBALL_IMG } from './icons.jsx'

const REGIONS = [
  { key: 'kanto', label: 'Kanto', count: 151, gen: 'Gen 1' },
  { key: 'johto', label: 'Johto', count: 100, gen: 'Gen 2' },
  { key: 'hoenn', label: 'Hoenn', count: 135, gen: 'Gen 3' },
  { key: 'sinnoh', label: 'Sinnoh', count: 107, gen: 'Gen 4' },
  { key: 'unova', label: 'Unova', count: 156, gen: 'Gen 5' },
  { key: 'kalos', label: 'Kalos', count: 72, gen: 'Gen 6' },
  { key: 'alola', label: 'Alola', count: 88, gen: 'Gen 7' },
  { key: 'galar', label: 'Galar', count: 89, gen: 'Gen 8' },
  { key: 'paldea', label: 'Paldea', count: 120, gen: 'Gen 9' },
]

export default function RegionGrid({ regionState, onPick }) {
  const unlockedMap = Object.fromEntries((regionState || []).map((r) => [r.key, r.unlocked]))

  return (
    <div className="w-full max-w-[960px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 my-2">
      {REGIONS.map((r, i) => {
        const playable = r.key === 'kanto'
        const unlocked = unlockedMap[r.key] ?? (r.key === 'kanto')
        const locked = !playable

        return (
          <div
            key={r.key}
            onClick={() => (playable ? onPick(r.key) : onPick(null, true))}
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
            className={`animate-popIn group relative flex items-center gap-2.5 p-2.5 px-3 rounded-xl border-[3px] shadow-sm transition-all duration-200 ease-out select-none cursor-pointer ${
              locked
                ? 'bg-[#e2dcc8] border-[#8a9988]/60 opacity-60 grayscale hover:opacity-75 hover:border-gray-500'
                : 'bg-[#f5f0dc] border-[#1b4332] shadow-[0_3px_10px_rgba(0,0,0,0.2)] hover:scale-[1.02] hover:shadow-[0_6px_16px_rgba(27,67,50,0.28)] active:scale-[0.98]'
            }`}
          >
            {/* Left circular icon badge inside dark chip */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-inner transition-transform duration-200 ${
              locked ? 'bg-[#3a443c]' : 'bg-[#1b4332] group-hover:scale-105'
            }`}>
              {playable ? (
                <img src={POKEBALL_IMG} alt={r.label} className="w-5 h-5 object-contain filter drop-shadow" />
              ) : (
                <LockIcon className="w-4 h-4 text-gray-300" />
              )}
            </div>

            {/* Right content: bold uppercase title & descriptor pill */}
            <div className="flex flex-col items-start min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1.5 w-full justify-between">
                <h3 className={`text-sm font-extrabold uppercase tracking-wider font-pixel ${
                  locked ? 'text-gray-600' : 'text-[#142319]'
                }`}>
                  {r.label}
                </h3>
                {locked && (
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-black/10 px-1.5 py-0.5 rounded-md">
                    Locked
                  </span>
                )}
              </div>

              {/* Green pill badge descriptor */}
              <div className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-semibold tracking-wide shadow-xs truncate max-w-full ${
                locked
                  ? 'bg-gray-500/20 text-gray-600'
                  : 'bg-[#2d6a4f] text-emerald-50'
              }`}>
                {r.label} — {r.gen} ({r.count})
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}