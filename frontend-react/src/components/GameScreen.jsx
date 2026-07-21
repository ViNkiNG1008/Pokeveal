import { useState, useEffect } from 'react'
import ClueShop from './ClueShop.jsx'
import { api } from '../api.js'
import { POKEMON_NAMES } from '../pokemonNames.js'
import { BatteryIcon, POKEBALL_IMG } from './icons.jsx'

export default function GameScreen({ state, onStateUpdate, showCaught, toast }) {
  const [guessText, setGuessText] = useState('')
  const [flashImg, setFlashImg] = useState(null)
  const [caption, setCaption] = useState(null)
  const [shake, setShake] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const { round, completed, clue_shop: clueShop, stats } = state


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
  setFlashImg(null)
  setCaption(null)
  setSuggestions([])
  try {
    const r = await api.guess(guess)
      setGuessText('')
      if (r.correct) {
        setFlashImg(r.hires)
        setCaption(`Caught! ${r.answer} — scored ${r.round_score} coins`)
        toast(`Correct! ${r.answer} — +${r.round_score} score`)
        ;(r.new_achievements || []).forEach((a, i) =>
          setTimeout(() => toast(`🏅 Achievement unlocked: ${a.replace(/_/g, ' ')}`), 700 * (i + 1))
        )
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        toast("Not quite — try another guess or buy a clue.")
      }
      onStateUpdate(r.state)
    } catch (e) {
      toast(e.message)
    }
  }

  async function giveUp() {
    setFlashImg(null)
    setCaption(null)
    try {
      const r = await api.reveal()
      setFlashImg(r.sprite)
      setCaption(`It was ${r.answer}! (0 coins — no penalty)`)
      toast(`It was ${r.answer}!`)
      ;(r.new_achievements || []).forEach((a, i) =>
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
      <div className="animate-popIn">
        <div className="bg-gradient-to-br from-gold/15 to-red/15 border border-gold rounded-xl p-6 text-center mb-4 shadow-[0_8px_30px_rgba(255,203,5,0.15)]">
          <h2 className="font-pixel text-base text-gold mb-2">🏆 KANTO CHAMPION</h2>
          <div className="text-sm text-text">You revealed all {state.pokedex_total} Kanto Pokemon. Total score: {stats.total_score}</div>
        </div>
        <div className="bg-screen border border-panelBorder rounded-xl p-4 text-phosphorDim text-xs font-mono">
          &gt; Kanto region cleared. Start over with Reset save, or check your Pokedex tab.
        </div>
        <button
          onClick={resetSave}
          className="mt-4 border border-panelBorder text-muted hover:text-text hover:border-muted hover:-translate-y-0.5 rounded-lg px-3.5 py-2 text-xs font-mono transition-all duration-150"
        >
          Reset save
        </button>
      </div>
    )
  }

  const showSilhouette = round.bought_clues.includes('silhouette')
  const displayImg = flashImg || (showSilhouette ? round.clue_values.silhouette : null)

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: '300px 1fr' }}>
      <div>
        {/* Pokedex viewfinder — cooler, darker glass-like panel */}
        <div className="relative bg-gradient-to-b from-[#12253f] to-[#050d1a] border-2 border-phosphorDim/30 rounded-xl p-4 min-h-[300px] flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_0_32px_rgba(0,0,0,0.55)] transition-shadow duration-300 hover:border-phosphorDim/50 hover:shadow-[inset_0_0_32px_rgba(0,0,0,0.55),0_0_16px_rgba(95,137,179,0.12)]">
          {/* soft ambient glow blobs for a cool "dark blur" feel */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-phosphorDim/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-14 -left-10 w-40 h-40 rounded-full bg-black/40 blur-2xl pointer-events-none" />

          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] text-phosphorDim/70 uppercase">Pokedex</div>
          <BatteryIcon className="absolute top-2.5 right-2.5 w-4 h-4 text-phosphorDim/60" />

          <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-phosphorDim/60 rounded-tl-md" />
          <span className="absolute top-2.5 right-8 w-4 h-4 border-t-2 border-r-2 border-phosphorDim/60 rounded-tr-md" />
          <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-phosphorDim/60 rounded-bl-md" />
          <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-phosphorDim/60 rounded-br-md" />

          {displayImg ? (
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              <img
                src={displayImg}
                className={`w-full h-full object-contain [image-rendering:pixelated] transition-all duration-300 ${
                  !flashImg && showSilhouette ? 'silhouette' : 'animate-flash'
                }`}
              />
            </div>
          ) : (
            <div className="relative font-pixel text-6xl font-bold text-gold [text-shadow:0_0_20px_rgba(255,203,5,0.5)] animate-pulseSoft">?</div>
          )}
          <div className="relative text-[11px] text-phosphorDim mt-2.5 tracking-wide transition-opacity duration-200 text-center px-2">
            {caption || (showSilhouette ? 'Silhouette clue active' : 'No visual clue purchased yet')}
          </div>

          <div className="relative flex items-center justify-center gap-2 mt-3 opacity-60">
            <span className="w-10 h-1.5 rounded-full bg-phosphorDim/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-red/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-phosphor/70" />
          </div>
        </div>

        {/* Clue terminal log */}
        <div className="bg-screen border border-panelBorder rounded-xl px-4 py-3.5 mt-3 min-h-[130px] max-h-[220px] overflow-y-auto text-[12.5px] leading-7 text-phosphor font-mono">
          {round.bought_clues.length === 0 ? (
            <div className="text-phosphorDim">&gt; awaiting clue purchase...</div>
          ) : (
            round.bought_clues.map((c, i) => {
              const info = clueShop[c]
              let val = round.clue_values[c]
              if (c === 'silhouette') val = '(shown above)'
              if (c === 'pokedex_entry') val = `"${val}"`
              return (
                <div
                  key={c}
                  className="whitespace-pre-wrap break-words animate-slideDown"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
                >
                  <span className="text-phosphorDim">&gt;</span> {info ? info.label : c}: {val}
                </div>
              )
            })
          )}
        </div>

        {round.wrong_guesses.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {round.wrong_guesses.map((g, i) => (
              <span
                key={i}
                className="bg-danger/10 text-danger border border-danger/35 rounded px-2 py-0.5 text-[11px] animate-popIn"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3.5">
        <ClueShop clueShop={clueShop} round={round} onBuy={buyClue} />

        <div className="bg-phosphorDim/10 border border-phosphorDim/25 rounded-2xl p-3">
          <div className={`flex gap-2 items-stretch ${shake ? 'animate-wiggle' : ''}`}>
            <div className="relative flex-1">
              <input
                value={guessText}
                onChange={(e) => handleGuessChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
                placeholder="Who's that Pokemon?"
                autoComplete="off"
                className={`w-full h-full bg-panel border rounded-lg px-3 py-2.5 text-[13px] font-mono focus:outline-none transition-all duration-200 ${
                  shake ? 'border-danger' : 'border-panelBorder focus:border-gold focus:shadow-[0_0_0_3px_rgba(255,203,5,0.15)]'
                }`}
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-panel border border-panelBorder rounded-lg overflow-hidden z-10 shadow-lg">
                  {suggestions.map((name) => (
                    <div
                      key={name}
                      onClick={() => pickSuggestion(name)}
                      className="px-3 py-2 text-[13px] font-mono cursor-pointer hover:bg-screen hover:text-gold"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:flex w-11 h-11 items-center justify-center flex-shrink-0 self-center drop-shadow-[0_0_10px_rgba(227,53,13,0.35)]">
              <img src={POKEBALL_IMG} alt="" className="w-10 h-10 object-contain" />
            </div>

            <button
              onClick={submitGuess}
              className="bg-red hover:bg-[#ff5230] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(227,53,13,0.35)] text-white rounded-lg px-5 py-2.5 text-sm font-mono font-bold uppercase tracking-wide transition-all duration-150"
            >
              Guess
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={giveUp}
              className="border border-panelBorder text-muted hover:text-text hover:border-muted hover:-translate-y-0.5 rounded-lg px-3.5 py-2 text-xs font-mono transition-all duration-150"
            >
              Give up &amp; reveal
            </button>
            <button
              onClick={resetSave}
              className="border border-panelBorder text-muted hover:text-text hover:border-muted hover:-translate-y-0.5 rounded-lg px-3.5 py-2 text-xs font-mono transition-all duration-150"
            >
              Reset save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}