import { useState, useEffect } from 'react'
import ClueShop from './ClueShop.jsx'
import { api } from '../api.js'

export default function GameScreen({ state, sessionId, onStateUpdate, showCaught, toast }) {
  const [guessText, setGuessText] = useState('')
  const [flashImg, setFlashImg] = useState(null)
  const [caption, setCaption] = useState(null)
  const [shake, setShake] = useState(false)

  const { round, completed, clue_shop: clueShop, stats } = state
  

  async function buyClue(clueType) {
  setFlashImg(null)
  setCaption(null)
  try {
    await api.buyClue(sessionId, clueType)
    const fresh = await api.getState(sessionId)
    onStateUpdate(fresh)
  } catch (e) {
    toast(e.message)
  }
}

  async function submitGuess() {
  const guess = guessText.trim()
  if (!guess) return
  setFlashImg(null)
  setCaption(null)
  try {
    const r = await api.guess(sessionId, guess)
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
      const r = await api.reveal(sessionId)
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
    await api.deleteGame(sessionId)
    localStorage.removeItem('pokeveal_session')
    location.reload()
  }

  if (completed) {
    return (
      <div className="animate-popIn">
        <div className="bg-gradient-to-br from-gold/15 to-red/15 border border-gold rounded-xl p-6 text-center mb-4 shadow-[0_8px_30px_rgba(255,203,5,0.15)]">
          <h2 className="font-pixel text-base text-gold mb-2">🏆 KANTO CHAMPION</h2>
          <div className="text-sm">You revealed all {state.pokedex_total} Kanto Pokemon. Total score: {stats.total_score}</div>
        </div>
        <div className="bg-screen border border-[#0f3323] rounded-xl p-4 text-phosphorDim text-xs font-mono">
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
        {/* Screen panel */}
        <div className="scanlines relative bg-screen border border-[#0f3323] rounded-xl p-4 min-h-[300px] flex flex-col items-center justify-center overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(31,138,92,0.4),0_0_24px_rgba(61,255,160,0.08)]">
          {displayImg ? (
            <div className="w-[200px] h-[200px] flex items-center justify-center">
              <img
                src={displayImg}
                className={`w-full h-full object-contain [image-rendering:pixelated] transition-all duration-300 ${
                  !flashImg && showSilhouette ? 'silhouette' : 'animate-flash'
                }`}
              />
            </div>
          ) : (
            <div className="font-pixel text-6xl text-phosphorDim [text-shadow:0_0_18px_#1f8a5c] animate-pulseSoft">?</div>
          )}
          <div className="text-[11px] text-phosphorDim mt-2.5 tracking-wide transition-opacity duration-200">
            {caption || (showSilhouette ? 'Silhouette clue active' : 'No visual clue purchased yet')}
          </div>
        </div>

        {/* Clue terminal log */}
        <div className="bg-screen border border-[#0f3323] rounded-xl px-4 py-3.5 mt-3 min-h-[130px] max-h-[220px] overflow-y-auto text-[12.5px] leading-7 text-phosphor font-mono">
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

        <div>
          <div className={`flex gap-2 ${shake ? 'animate-wiggle' : ''}`}>
            <input
              value={guessText}
              onChange={(e) => setGuessText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
              placeholder="Who's that Pokemon?"
              autoComplete="off"
              className={`flex-1 bg-panel border rounded-lg px-3 py-2.5 text-[13px] font-mono focus:outline-none transition-all duration-200 ${
                shake ? 'border-danger' : 'border-panelBorder focus:border-gold focus:shadow-[0_0_0_3px_rgba(255,203,5,0.15)]'
              }`}
            />
            <button
              onClick={submitGuess}
              className="bg-red hover:bg-[#ff5230] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(227,53,13,0.35)] text-white rounded-lg px-4.5 py-2.5 text-[13px] font-mono font-bold transition-all duration-150"
            >
              Guess
            </button>
          </div>
          <div className="flex justify-between items-center mt-1.5">
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