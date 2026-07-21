const BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('pokeveal_token')
}

function setToken(token) {
  if (token) localStorage.setItem('pokeveal_token', token)
  else localStorage.removeItem('pokeveal_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    setToken(null)
    window.location.reload()
    throw new Error('Session expired')
  }

  if (!res.ok) {
    let detail = 'Request failed'
    try {
      const body = await res.json()
      if (typeof body.detail === 'string') {
        detail = body.detail
      } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
        detail = body.detail[0].msg
      }
    } catch {}
    throw new Error(detail)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // auth
  register: (username, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  me: () => request('/auth/me'),
  setToken,
  getToken,
  logout: () => setToken(null),

  // game
  newGame: (region) => request('/game/new', { method: 'POST', body: JSON.stringify({ region }) }),
  getState: () => request('/game/state'),
  buyClue: (clueType) => request('/game/buy-clue', { method: 'POST', body: JSON.stringify({ clue_type: clueType }) }),
  guess: (guess) => request('/game/guess', { method: 'POST', body: JSON.stringify({ guess }) }),
  reveal: () => request('/game/reveal', { method: 'POST' }),
  pokedex: () => request('/game/pokedex'),
  deleteGame: () => request('/game', { method: 'DELETE' }),

  // leaderboard
  leaderboard: (sortBy) => request(`/leaderboard?sort_by=${sortBy}`),
}