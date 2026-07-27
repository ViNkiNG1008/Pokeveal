import { useState, useEffect } from 'react'
import ClueShop from './ClueShop.jsx'
import { api } from '../api.js'
import { POKEMON_NAMES } from '../pokemonNames.js'
import { BatteryIcon, POKEBALL_IMG, CLUE_ICONS } from './icons.jsx'
import RevealModal from './RevealModal.jsx'
import DailyChallenge from './DailyChallenge.jsx'

export default function GameScreen({ state, onStateUpdate, showCaught, toast }) {
  const [guessText, setGuessText] = useState('')
  const [flashImg, setFlashImg] = useState(null)
  const [caption, setCaption] = useState(null)
  const [shake, setShake] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [pendingReveal, setPendingReveal] = useState(null)
  const [guessLog, setGuessLog] = useState([])

  const { round, completed, clue_shop: clueShop, stats } = state

  useEffect(() => {
    setGuessLog([])
  }, [round?.round_number])

  async function buyClue(clueType) {
    setFlashImg(null)
    setCaption(null)
    try {
      await api.buyClue(clueType)
      const fresh = await api.getState()
      onStateUpdate(fresh)
    } catch (e) {
      toast(e.message)
    }
  }

  function handleGuessChange(value) {
    setGuessText(value)
    const q = value.trim().toLowerCase()
    if (!q) {
      setSuggestions([])
      return
    }
    const matches = POKEMON_NAMES.filter((n) =>
      n.toLowerCase().startsWith(q)
    ).slice(0, 6)
    setSuggestions(matches)
  }

  function pickSuggestion(name) {
    setGuessText(name)
    setSuggestions([])
  }

  async function submitGuess() {
    const guess = guessText.trim()
    if (!guess) return
    setSuggestions([])
    try {
      const r = await api.guess(guess)
      setGuessText('')
      if (r.correct) {
        setPendingReveal({
          answer: r.answer,
          hires: r.hires,
          roundScore: r.round_score,
          newAchievements: r.new_achievements || [],
          nextState: r.state,
        })
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        setGuessLog((log) => [...log, { guess, feedback: r.feedback }])
        toast("Not quite — try another guess or buy a clue.")
        onStateUpdate(r.state)
      }
    } catch (e) {
      toast(e.message)
    }
  }

  function advanceRound() {
    if (!pendingReveal) return
    pendingReveal.newAchievements.forEach((a, i) =>
      setTimeout(() => toast(`🏅 Achievement unlocked: ${a.replace(/_/g, ' ')}`), 700 * (i + 1))
    )
    onStateUpdate(pendingReveal.nextState)
    setPendingReveal(null)
  }

  async function giveUp() {
    setFlashImg(null)
    setCaption(null)
    try {
      const r = await api.reveal()
      setFlashImg(r.sprite)
      setCaption(`It was ${r.answer}! (0 coins — no penalty)`)
      toast(`It was ${r.answer}!`)
        ; (r.new_achievements || []).forEach((a, i) =>
          setTimeout(() => toast(`🏅 Achievement unlocked: ${a.replace(/_/g, ' ')}`), 700 * (i + 1))
        )
      onStateUpdate(r.state)
    } catch (e) {
      toast(e.message)
    }
  }

  async function resetSave() {
    if (!confirm('Reset your PokeVeal save? This clears all progress.')) return
    await api.deleteGame()
    location.reload()
  }

  if (completed) {
    return (
      <div className="animate-popIn max-w-[600px] mx-auto my-6">
        <div className="bg-slate-900/80 border-2 border-gold/80 backdrop-blur-md rounded-2xl p-6 text-center mb-4 shadow-[0_8px_30px_rgba(255,203,5,0.25)]">
          <h2 className="bubbly-logo text-2xl text-gold mb-2">🏆 KANTO CHAMPION</h2>
          <div className="text-sm font-mono text-slate-200">
            You revealed all {state.pokedex_total} Kanto Pokémon! Total score: <span className="text-gold font-bold">{stats.total_score}</span>
          </div>
        </div>
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-emerald-400 text-xs font-mono text-center">
          &gt; Kanto region cleared. Start over with Reset save, or view your Pokedex tab.
        </div>
        <div className="flex justify-center mt-5">
          <button
            onClick={resetSave}
            className="border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full px-5 py-2.5 text-xs font-mono font-bold transition-all shadow cursor-pointer active:scale-95"
          >
            Reset save
          </button>
        </div>
      </div>
    )
  }

  const showSilhouette = round.bought_clues.includes('silhouette')
  const displayImg = flashImg || (showSilhouette ? round.clue_values.silhouette : null)

  return (
    <>
      {pendingReveal && (
        <RevealModal
          answer={pendingReveal.answer}
          image={pendingReveal.hires}
          score={pendingReveal.roundScore}
          onNext={advanceRound}
        />
      )}

      {/* Main 3-column responsive layout strictly locked inside viewport frame */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-4 sm:gap-5 my-1 flex-1 min-h-0 lg:h-full overflow-y-auto lg:overflow-hidden">

        {/* Left Column — Pokédex Viewfinder */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 h-full min-h-[360px] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_35px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md">
          {/* Ambient glow blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-14 -left-10 w-40 h-40 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />

          {/* Viewfinder Header & Battery */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] text-cyan-400/80 font-pixel uppercase">
            Pokédex
          </div>
          <BatteryIcon className="absolute top-3 right-3 w-4 h-4 text-cyan-400/70" />

          {/* 4 Corner Brackets */}
          <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-md" />
          <span className="absolute top-3 right-9 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-md" />
          <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-md" />
          <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br-md" />

          {/* Central Sprite Viewport */}
          {displayImg ? (
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              <img
                src={displayImg}
                alt="Pokemon silhouette"
                className={`w-full h-full object-contain [image-rendering:pixelated] transition-all duration-300 ${!flashImg && showSilhouette ? 'silhouette' : 'animate-flash'
                  }`}
              />
            </div>
          ) : (
            <div className="relative font-pixel text-6xl font-black text-gold [text-shadow:0_0_24px_rgba(255,203,5,0.6)] animate-pulseSoft my-6 select-none">
              ?
            </div>
          )}

          {/* Viewfinder Caption */}
          <div className="relative text-[11px] text-cyan-300/80 mt-2 tracking-wide text-center px-2 font-mono">
            {caption || (showSilhouette ? 'Silhouette clue active' : 'No visual clue purchased yet')}
          </div>

          {/* Bottom LED indicator bar */}
          <div className="relative flex items-center justify-center gap-2 mt-3 opacity-75">
            <span className="w-10 h-1.5 rounded-full bg-cyan-400/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Middle Column — Clue Shop + Guess Bar */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-xl backdrop-blur-md flex flex-col h-full justify-between gap-2.5">
          <div className="flex-1 flex flex-col justify-center">
            <ClueShop clueShop={clueShop} round={round} onBuy={buyClue} />
          </div>

          {/* Guess Bar Container (Pinned at bottom of middle column) */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 shadow-inner shrink-0">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              <div className="relative flex-1">
                <div className={`flex items-center gap-2 bg-slate-950/90 border-2 ${shake ? 'border-red-500 animate-wiggle' : 'border-slate-700 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/30'
                  } rounded-full px-3 py-1.5 transition-all`}>
                  <img src={POKEBALL_IMG} alt="" className="w-4 h-4 object-contain opacity-80 shrink-0" />
                  <input
                    value={guessText}
                    onChange={(e) => handleGuessChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
                    placeholder="Who's that Pokémon?"
                    autoComplete="off"
                    className="w-full bg-transparent text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Autocomplete Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden z-20 shadow-2xl">
                    {suggestions.map((name) => (
                      <div
                        key={name}
                        onClick={() => pickSuggestion(name)}
                        className="px-3 py-1.5 text-xs font-mono cursor-pointer text-slate-200 hover:bg-slate-800 hover:text-gold transition-colors"
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Red Pokéball Guess Button */}
              <button
                onClick={submitGuess}
                className="flex items-center justify-center gap-1.5 bg-red hover:bg-[#ff5230] text-white rounded-full px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>Guess</span>
              </button>
            </div>

            {/* Give Up / Reset Buttons */}
            <div className="flex justify-between items-center mt-2 pt-1">
              <button
                onClick={giveUp}
                className="border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full px-3.5 py-1 text-[11px] font-mono transition-all cursor-pointer active:scale-95"
              >
                Give up &amp; reveal
              </button>
              <button
                onClick={resetSave}
                className="border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full px-3.5 py-1 text-[11px] font-mono transition-all cursor-pointer active:scale-95"
              >
                Reset save
              </button>
            </div>
          </div>
        </div>

        {/* Right Column — Purchased Clues / Guess Log / Daily Challenge (Scrollable inside fixed height) */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md flex flex-col h-full overflow-y-auto gap-3">

          {/* Purchased Clues Section */}
          <div className="bg-black/25 border border-white/10 rounded-xl p-3 min-h-[120px] max-h-[220px] overflow-y-auto">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-pixel mb-2">
              Purchased Clues
            </div>
            {round.bought_clues.length === 0 ? (
              <div className="text-slate-500 text-xs italic">
                No clues purchased yet — buy one from the shop to get started.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {round.bought_clues.map((c, i) => {
                  const info = clueShop[c]
                  const Icon = CLUE_ICONS[c]
                  let val = round.clue_values[c]
                  if (c === 'silhouette') val = '(shown in viewfinder)'
                  if (c === 'pokedex_entry') val = `"${val}"`

                  return (
                    <div
                      key={c}
                      className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 flex items-start gap-2.5 shadow-xs animate-slideDown"
                      style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#1b4332] text-[#f5f0dc] flex items-center justify-center shrink-0 mt-0.5">
                        {Icon ? <Icon className="w-3.5 h-3.5" /> : <span className="text-[10px]">✓</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400 font-pixel">
                          {info ? info.label : c}
                        </div>
                        <div className="text-xs font-mono font-medium text-white break-words mt-0.5">
                          {val}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Your Guesses (Hot / Cold status chips) */}
          {guessLog.length > 0 && (
            <div className="bg-black/25 border border-white/10 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-pixel mb-2">
                Your Guesses
              </div>
              <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto">
                {guessLog.map((entry, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs animate-popIn">
                    <div className="font-extrabold text-red-400 font-mono text-xs">
                      ❌ {entry.guess}
                    </div>
                    {entry.feedback && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${entry.feedback.type_match
                          ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300'
                          : 'bg-rose-950/90 border-rose-500/60 text-rose-300'
                          }`}>
                          {entry.feedback.type_match ? '✓ Type Match' : '✗ Type Mismatch'}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${entry.feedback.generation_match
                          ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300'
                          : 'bg-rose-950/90 border-rose-500/60 text-rose-300'
                          }`}>
                          {entry.feedback.generation_match ? '✓ Gen Match' : '✗ Gen Mismatch'}
                        </span>

                        {entry.feedback.weight_similarity !== null && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-950/90 border-amber-500/60 text-amber-300">
                            ⚖️ {entry.feedback.weight_similarity}% Weight
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Challenge Card */}
          <DailyChallenge dc={state.daily_challenge} />
        </div>
      </div>
    </>
  )
}