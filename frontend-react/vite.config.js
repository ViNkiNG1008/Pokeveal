import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev server proxies /api requests to the FastAPI backend running on
// port 8000, so the React app never has to worry about CORS or hardcoding
// a host — it just calls fetch('/api/...') like a normal same-origin app.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
