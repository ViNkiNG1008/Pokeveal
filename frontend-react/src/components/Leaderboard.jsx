import { useEffect, useState } from 'react'
import { api } from '../api.js'

const SORT_OPTIONS = [
  { key: 'total_score', label: 'Total Score' },
  { key: 'best_round_score', label: 'Best Round' },
  { key: 'completion_pct', label: 'Pokedex %' },
  { key: 'total_caught', label: 'Total Caught' },
]

export default function Leaderboard({ currentUsername }) {
  const [sortBy, setSortBy] = useState('total_score')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.leaderboard(sortBy).then((res) => {
      if (!cancelled) {
        setEntries(res.entries)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [sortBy])

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${
              sortBy === opt.key
                ? 'bg-gold text-casing border-gold'
                : 'bg-casing text-muted border-panelBorder'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted text-sm font-mono">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="text-muted text-sm font-mono">No scores yet — be the first!</div>
      ) : (
        <div className="border border-panelBorder rounded-xl overflow-hidden">
          <table className="w-full text-[13px] font-mono">
            <thead>
              <tr className="bg-casing/60 text-muted text-left">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Total Score</th>
                <th className="px-3 py-2">Best Round</th>
                <th className="px-3 py-2">Pokedex %</th>
                <th className="px-3 py-2">Caught</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.username}
                  className={`border-t border-panelBorder ${
                    e.username === currentUsername ? 'bg-gold/10 text-gold' : 'text-text'
                  }`}
                >
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{e.username}</td>
                  <td className="px-3 py-2">{e.total_score}</td>
                  <td className="px-3 py-2">{e.best_round_score}</td>
                  <td className="px-3 py-2">{e.completion_pct}%</td>
                  <td className="px-3 py-2">{e.total_caught}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}