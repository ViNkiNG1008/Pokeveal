export default function RevealModal({ answer, image, score, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-popIn">
      <div className="bg-gradient-to-b from-[#12253f] to-[#050d1a] border-2 border-gold rounded-2xl p-6 w-full max-w-[360px] text-center shadow-[0_0_40px_rgba(255,203,5,0.25)]">
        <div className="text-gold font-pixel text-xs tracking-[0.3em] mb-1">═══════════════</div>
        <div className="font-pixel text-xl text-gold mb-1 [text-shadow:0_0_16px_rgba(255,203,5,0.5)]">CORRECT!</div>
        <div className="text-gold font-pixel text-xs tracking-[0.3em] mb-4">═══════════════</div>

        {image && (
          <div className="w-[160px] h-[160px] mx-auto mb-3 flex items-center justify-center">
            <img src={image} alt={answer} className="w-full h-full object-contain [image-rendering:pixelated] animate-flash" />
          </div>
        )}

        <div className="font-pixel text-lg text-text mb-3">{answer}</div>
        <div className="text-gold font-pixel text-base mb-5">+{score} Coins</div>

        <button
          onClick={onNext}
          autoFocus
          className="w-full bg-red hover:bg-[#ff5230] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(227,53,13,0.35)] text-white rounded-lg px-5 py-2.5 text-sm font-mono font-bold uppercase tracking-wide transition-all duration-150"
        >
          Next Round
        </button>
      </div>
    </div>
  )
}