import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function PokedexGrid({ sessionId }) {
  const [entries, setEntries] = useState(null)

  useEffect(() => {
    api.getPokedex(sessionId).then((r) => setEntries(r.entries))
  }, [sessionId])

  if (!entries) {
    return (
      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))' }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="bg-panel border border-panelBorder rounded-lg p-2 h-[92px] animate-pulseSoft" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))' }}>
      {entries.map((e, i) => (
        <div
          key={e.id}
          style={{ animationDelay: `${Math.min(i, 60) * 12}ms`, animationFillMode: 'backwards' }}
          className={`animate-popIn bg-panel border rounded-lg p-2 text-center text-[10px] transition-all duration-200 ${
            e.collected
              ? `${e.correct ? 'border-gold' : 'border-phosphorDim'} text-text hover:-translate-y-1 hover:shadow-lg cursor-default`
              : 'border-panelBorder text-muted hover:border-muted'
          }`}
        >
          {e.collected ? (
            <>
              <img src={e.sprite} className="w-14 h-14 object-contain [image-rendering:pixelated] mx-auto" />
              <div>{e.name}</div>
              <div className="text-[9px] text-muted">
                #{String(e.id).padStart(3, '0')} {e.correct ? '✓' : '👁'}
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 mx-auto flex items-center justify-center text-panelBorder text-xl">?</div>
              <div className="text-[9px] text-muted">#{String(e.id).padStart(3, '0')}</div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}