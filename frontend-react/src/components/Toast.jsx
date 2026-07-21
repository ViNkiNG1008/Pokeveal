import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 2200)
    const doneTimer = setTimeout(onDone, 2600)
    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`bg-panel border border-gold text-gold px-4 py-2.5 rounded-lg text-xs shadow-2xl font-mono transition-all duration-300 whitespace-nowrap ${
        leaving ? 'opacity-0 translate-y-2' : 'animate-popIn opacity-100'
      }`}
    >
      {message}
    </div>
  )
}