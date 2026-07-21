export default function Achievements({ state }) {
  const unlocked = new Set(state.achievements.unlocked)

  return (
    <div className="flex flex-col gap-2">
      {state.achievements.catalog.map((a, i) => {
        const got = unlocked.has(a.key)
        return (
          <div
            key={a.key}
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
            className={`animate-popIn flex gap-2.5 items-center bg-panel border border-panelBorder rounded-lg px-3 py-2.5 transition-all duration-200 ${
              got ? 'hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_6px_18px_rgba(255,203,5,0.12)]' : 'opacity-40 hover:opacity-55'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-transform duration-200 ${
                got ? 'bg-gold' : 'bg-panelBorder'
              }`}
            >
              {got ? '🏅' : '🔒'}
            </div>
            <div>
              <div className="font-bold text-[13px]">{a.label}</div>
              <div className="text-[11px] text-muted">{a.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}