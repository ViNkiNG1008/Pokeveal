import { useEffect, useState, useCallback } from 'react'
import { api } from './api.js'
import Header, { StatsBar, UserAvatar } from './components/Header.jsx'
import Tabs from './components/Tabs.jsx'
import RegionGrid from './components/RegionGrid.jsx'
import GameScreen from './components/GameScreen.jsx'
import PokedexGrid from './components/PokedexGrid.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import Achievements from './components/Achievements.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Login from './components/Login.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const [username, setUsername] = useState(null)
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
    const token = api.getToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const me = await api.me()
      setUsername(me.username)
      const s = await api.getState()
      setState(s)
    } catch {
      setState(null)
    }
    setLoading(false)
  }

  function onAuthed(name) {
    setUsername(name)
    setState(null)
  }

  function logout() {
    api.logout()
    setUsername(null)
    setState(null)
    setTab('game')
  }

  async function startRegion(regionKey, blocked) {
    if (blocked) {
      showToast('This region is not playable yet — coming in v2!')
      return
    }
    const s = await api.newGame(regionKey)
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

  if (!username) {
    return (
      <div className="max-w-[1100px] mx-auto p-5 min-h-screen font-mono text-text">
        <div className="bg-casing border border-panelBorder rounded-2xl p-5 shadow-2xl">
          <Login onAuthed={onAuthed} toast={showToast} />
        </div>
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-2 z-50 items-center">
          {toasts.map((t) => (
            <Toast key={t.id} message={t.message} onDone={() => dismissToast(t.id)} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto p-5 min-h-screen font-mono text-text">
      <div className="bg-casing border border-panelBorder rounded-2xl p-5 shadow-2xl">
        <div className="flex justify-between items-start gap-4">
  <Header state={state} />
  <div className="flex items-center gap-4">
    <StatsBar state={state} />
    <div className="flex items-center gap-2 text-[12px] text-muted">
      <UserAvatar username={username} />
      <span>{username}</span>
      <button onClick={logout} className="underline hover:text-gold">Log out</button>
    </div>
  </div>
</div>

        <Tabs active={tab} onChange={setTab} />

        {!state && tab !== 'leaderboard' && (
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

        <div key={tab} className="animate-slideDown">
          {tab === 'game' && state && (
            <GameScreen state={state} onStateUpdate={setState} toast={showToast} />
          )}
          {tab === 'pokedex' && state && <PokedexGrid />}
          {tab === 'stats' && state && <StatsGrid state={state} />}
          {tab === 'achievements' && state && <Achievements state={state} />}
          {tab === 'regions' && state && <RegionGrid regionState={state.regions} onPick={startRegion} />}
          {tab === 'leaderboard' && <Leaderboard currentUsername={username} />}
        </div>
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-2 z-50 items-center">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} onDone={() => dismissToast(t.id)} />
        ))}
      </div>
    </div>
  )
}