export default function RevealModal({ answer, image, score, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-popIn">
      <div className="bg-[#0a1124]/95 border-2 border-gold/80 rounded-3xl p-6 sm:p-8 w-full max-w-[380px] text-center shadow-[0_0_50px_rgba(255,203,5,0.3)] relative overflow-hidden flex flex-col items-center">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="text-xs uppercase tracking-[0.25em] text-slate-400 font-pixel mb-1">
          Pokémon Revealed
        </div>
        <h2 className="bubbly-logo text-3xl font-black text-gold tracking-wide drop-shadow-md mb-4">
          CORRECT!
        </h2>

        {image && (
          <div className="relative w-44 h-44 mb-4 flex items-center justify-center bg-radial from-gold/15 to-transparent rounded-full p-2">
            <img
              src={image}
              alt={answer}
              className="w-full h-full object-contain [image-rendering:pixelated] animate-flash drop-shadow-[0_0_24px_rgba(255,203,5,0.5)]"
            />
          </div>
        )}

        <div className="font-pixel text-xl font-extrabold text-white tracking-wider uppercase mb-3">
          {answer}
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold font-pixel font-bold text-sm mb-6 shadow-sm">
          <span>+{score}</span>
          <span className="text-xs font-mono text-gold/80">Coins Earned</span>
        </div>

        <button
          onClick={onNext}
          autoFocus
          className="w-full bg-red hover:bg-[#ff5230] text-white rounded-full py-3 px-6 text-sm font-mono font-black uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          Next Round
        </button>
      </div>
    </div>
  )
}