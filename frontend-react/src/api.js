const BASE = '/api'

async function request(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  createSession: () => request('/session', { method: 'POST' }),
  newGame: (sessionId, region) =>
    request('/game/new', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, region }),
    }),
  getState: (sessionId) => request(`/game/${sessionId}/state`),
  buyClue: (sessionId, clueType) =>
    request(`/game/${sessionId}/buy-clue`, {
      method: 'POST',
      body: JSON.stringify({ clue_type: clueType }),
    }),
  guess: (sessionId, guess) =>
    request(`/game/${sessionId}/guess`, {
      method: 'POST',
      body: JSON.stringify({ guess }),
    }),
  reveal: (sessionId) => request(`/game/${sessionId}/reveal`, { method: 'POST' }),
  getPokedex: (sessionId) => request(`/game/${sessionId}/pokedex`),
  deleteGame: (sessionId) => request(`/game/${sessionId}`, { method: 'DELETE' }),
}
