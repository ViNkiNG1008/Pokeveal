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
import TrainerCard from './components/TrainerCard.jsx'
import { TrophyIcon } from './components/icons.jsx'

function GearIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function WalletIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  )
}

function HeartIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CodeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function GithubIcon({ className = 'w-4.5 h-4.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function TwitterIcon({ className = 'w-4.5 h-4.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DiscordIcon({ className = 'w-4.5 h-4.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default function App() {
  const [username, setUsername] = useState(null)
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('game')
  const [toasts, setToasts] = useState([])
  const [showTrainerCard, setShowTrainerCard] = useState(false)

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
      <div className="max-w-[1100px] mx-auto p-5 min-h-screen font-mono text-text flex items-center justify-center">
        <div className="w-full max-w-[420px] bg-casing/90 backdrop-blur-md border border-panelBorder rounded-2xl p-6 shadow-2xl">
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

  const isLanding = !state && tab === 'game'

  return (
    <div className="w-full max-w-[1440px] mx-auto p-2 sm:p-3 px-3 sm:px-6 h-screen max-h-screen font-mono text-text flex flex-col overflow-hidden">
      {isLanding ? (
        /* Full-bleed Home / Landing view — fixed height, no scroll */
        <div className="w-full flex-1 flex flex-col items-center justify-center py-2 overflow-hidden">
          {/* Header row */}
          <div className="w-full max-w-[960px] mx-auto flex items-center justify-between px-3 mb-3">
            {/* Top-left circular settings gear icon button */}
            <button
              onClick={() => showToast('Settings — Volume & audio preferences coming soon!')}
              className="w-9 h-9 rounded-full bg-[#0a1124]/85 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 shadow-md backdrop-blur-md transition-all active:scale-95"
              title="Settings"
            >
              <GearIcon className="w-4 h-4" />
            </button>

            {/* Centered Bubbly Gold Logo with Navy Outline & Glow Halo */}
            <div className="logo-glow-halo text-center px-2">
              <h1 className="bubbly-logo text-3xl sm:text-4xl font-black tracking-wider uppercase drop-shadow-xl select-none">
                POKÉVEAL
              </h1>
            </div>

            {/* Top-right circular icon button (Leaderboard / Avatar shortcut) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('leaderboard')}
                className="w-9 h-9 rounded-full bg-[#0a1124]/85 border border-slate-700/60 flex items-center justify-center text-gold hover:bg-slate-800 shadow-md backdrop-blur-md transition-all active:scale-95"
                title="Leaderboard"
              >
                <TrophyIcon className="w-4 h-4" />
              </button>
              <UserAvatar username={username} onClick={() => setShowTrainerCard(true)} />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-center font-extrabold text-white text-sm tracking-wide drop-shadow-md mb-2">
            GUESS THE POKÉMON!
          </p>

          {/* Region selection grid — horizontal 3-column */}
          <RegionGrid regionState={null} onPick={startRegion} />

          {/* Compact bottom row: Want more + socials inline */}
          <div className="w-full max-w-[960px] mx-auto mt-3 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-pixel">Want more?</span>
              <div className="flex items-center gap-1.5">
                <a href="fintrack-finatic.streamlit.app" target="_blank" rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-emerald-400 hover:scale-110 transition-all" title="FinTrack">
                  <WalletIcon className="w-3.5 h-3.5" />
                </a>
                <a href="#" target="_blank" rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-cyan-400 hover:scale-110 transition-all" title="CareWise">
                  <HeartIcon className="w-3.5 h-3.5" />
                </a>
                <a href="https://github.com/ViNkiNG1008/Pokeveal" target="_blank" rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-purple-400 hover:scale-110 transition-all" title="GitHub">
                  <CodeIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <a href="https://github.com/ViNkiNG1008/Pokeveal" target="_blank" rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#0a1124]/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:scale-110 transition-all" title="GitHub">
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#0a1124]/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:scale-110 transition-all" title="Twitter / X">
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#0a1124]/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all" title="Discord">
                <DiscordIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* In-game: no wrapper — content floats directly over wallpaper */
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Top bar: glass pill header row */}
          <div className="flex justify-between items-center gap-4 mb-1 shrink-0 bg-black/30 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
            <Header state={state} />
            <div className="flex items-center gap-4">
              <StatsBar state={state} />
              <div className="flex items-center gap-2 text-[12px] text-white/80">
                <UserAvatar username={username} onClick={() => setShowTrainerCard(true)} />
                <span>{username}</span>
                <button onClick={logout} className="underline hover:text-gold transition-colors">Log out</button>
              </div>
            </div>
          </div>

          {/* Tabs row */}
          <div className="shrink-0">
            <Tabs active={tab} onChange={setTab} />
          </div>

          <div key={tab} className="animate-slideDown flex-1 min-h-0 flex flex-col overflow-hidden">
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
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-2 z-50 items-center">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} onDone={() => dismissToast(t.id)} />
        ))}
      </div>

      {/* Trainer Card Modal */}
      {showTrainerCard && state && (
        <TrainerCard
          username={username}
          stats={state.stats}
          region={state.region}
          onClose={() => setShowTrainerCard(false)}
        />
      )}
    </div>
  )
}