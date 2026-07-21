import { useState } from 'react'
import { api } from '../api.js'

export default function Login({ onAuthed, toast }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const fn = mode === 'login' ? api.login : api.register
      const res = await fn(username.trim(), password)
      api.setToken(res.token)
      onAuthed(res.username)
    } catch (err) {
      toast(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-[360px] mx-auto py-10 px-2.5">
      <h2 className="font-pixel text-lg text-gold mb-2 text-center">POKEVEAL</h2>
      <p className="text-muted text-[13px] text-center mb-6">
        {mode === 'login' ? 'Log in to catch \'em all.' : 'Create an account to start playing.'}
      </p>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          className="bg-casing border border-panelBorder rounded-lg px-3 py-2 text-sm font-mono text-text"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          minLength={3}
          maxLength={20}
          required
        />
        <input
          className="bg-casing border border-panelBorder rounded-lg px-3 py-2 text-sm font-mono text-text"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={6}
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-gold text-casing font-bold rounded-lg py-2 text-sm disabled:opacity-50"
        >
          {busy ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>

      <p className="text-muted text-[12px] text-center mt-4">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          className="text-gold underline"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  )
}