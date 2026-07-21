import { useEffect, useState, useCallback } from 'react'
import { api } from './api.js'
import Header from './components/Header.jsx'
import Tabs from './components/Tabs.jsx'
import RegionGrid from './components/RegionGrid.jsx'
import GameScreen from './components/GameScreen.jsx'
import PokedexGrid from './components/PokedexGrid.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import Achievements from './components/Achievements.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('game')
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message }])
  }, [])
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  useEffect(() => {
    boot()
  }, [])

  async function boot() {
    let sid = localStorage.getItem('pokeveal_session')
    if (!sid) {
      const r = await api.createSession()
      sid = r.session_id
      localStorage.setItem('pokeveal_session', sid)
    }
    setSessionId(sid)
    try {
      const s = await api.getState(sid)
      setState(s)
    } catch {
      setState(null)
    }
    setLoading(false)
  }

  async function startRegion(regionKey, blocked) {
    if (blocked) {
      showToast('This region is not playable yet — coming in v2!')
      return
    }
    const s = await api.newGame(sessionId, regionKey)
    setState(s)
    setTab('game')
  }

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto p-5">
        <div className="bg-casing border border-panelBorder rounded-2xl p-5 text-muted text-sm font-mono">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto p-5 min-h-screen font-mono text-[#e7ecf3]">
      <div className="bg-casing border border-panelBorder rounded-2xl p-5 shadow-2xl">
        <Header state={state} />

        {state && (
          <Tabs active={tab} onChange={setTab} />
        )}

        {!state && (
          <div className="text-center py-8 px-2.5">
            <h2 className="font-pixel text-lg text-gold mb-2">POKEVEAL</h2>
            <p className="text-muted max-w-[480px] mx-auto mb-6 text-[13px] leading-7">
              How little information do you need before you can guess a Pokemon? Buy clues from the shop,
              guess before you run out of budget, and build your Pokedex. Wrong guesses cost nothing — only
              clues do.
            </p>
            <RegionGrid regionState={null} onPick={startRegion} />
          </div>
        )}

        {state && (
          <div key={tab} className="animate-slideDown">
            {tab === 'game' && (
              <GameScreen state={state} sessionId={sessionId} onStateUpdate={setState} toast={showToast} />
            )}
            {tab === 'pokedex' && <PokedexGrid sessionId={sessionId} />}
            {tab === 'stats' && <StatsGrid state={state} />}
            {tab === 'achievements' && <Achievements state={state} />}
            {tab === 'regions' && <RegionGrid regionState={state.regions} onPick={startRegion} />}
          </div>
        )}
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-2 z-50 items-center">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} onDone={() => dismissToast(t.id)} />
        ))}
      </div>
    </div>
  )
}