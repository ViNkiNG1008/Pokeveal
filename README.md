# PokeVeal

Reveal clues. Save coins. Catch them all.

A Pokemon guessing game: each round you get a coin budget, and you choose
which clues to buy (cheap/medium/expensive/premium) before guessing the
Pokemon. Wrong guesses cost nothing — only clues do. Your score for a round
is whatever coins you have left when you guess correctly. Give up and the
answer is revealed for free (worth 0 points), and the Pokemon still gets
added to your Pokedex. This MVP ships the full Kanto region (151 Pokemon,
each appearing once per playthrough), with a coin-based clue shop, Pokedex
tracking, stats, achievements, and a save system so you can close the
browser and pick up where you left off.

## What's included

- Kanto region (151 Pokemon), one appearance each per playthrough
- Coin budget per round: 100 (rounds 1-25) -> 90 (26-50) -> 80 (51-75) -> 60 (76-100) -> 50 (101-151)
- Clue shop: Generation, Egg Group, Height Range, Weight Range (cheap) /
  Type, Species, Evolution Stage (medium) / Ability, Evolution Chain (expensive) /
  Pokedex Entry, Silhouette (premium)
- No penalty for wrong guesses
- Pokedex progress tracking, stats (score, coins spent, best round, fastest
  guess, most-used clue, etc.), and a handful of achievements
- Region-unlock screen (Johto+ shown locked/"coming soon" — data for other
  regions isn't bundled in this MVP, see "What's not included")
- Save system: your session is stored in the browser (localStorage) and the
  game state lives in a local SQLite file, so refreshing or restarting the
  server resumes your game

## What's not included (v2 ideas from the design doc)

Daily Pokemon, leaderboards, trainer profiles/avatars, and multiplayer
aren't built — they'd need real backend infrastructure (accounts, a shared
server, scheduling) beyond a locally-run app.

## Tech stack

- Backend: Python + FastAPI, SQLite for save data
- Frontend: **two options are included**, both talk to the same backend:
  - `frontend/` — a single-file vanilla HTML/CSS/JS app, no build step, served directly by FastAPI
  - `frontend-react/` — a React + Vite + Tailwind app (matches the original design doc's tech choice)
- Data: Pokemon names/types/stats/descriptions/evolutions/abilities for
  Gen 1 are bundled locally in `backend/data/pokemon_kanto.json` (sourced
  from the open-source Purukitto/pokemon-data.json dataset). Sprite images
  are loaded from that same GitHub repo at runtime, so you'll need an
  internet connection to see Pokemon art (everything else works offline).

## Requirements

- Python 3.10+ installed on your machine
- Node.js 18+ (only if you want to run the React frontend)

## Run it locally

### Backend (required either way)

```bash
cd pokeveal/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

This starts the API on **http://localhost:8000**.

### Option A — no-build frontend (simplest)

With the backend running, just open **http://localhost:8000** in your
browser. FastAPI serves the vanilla JS app directly — nothing else to
install or run.

### Option B — React frontend

In a **second terminal**, with the backend still running from above:

```bash
cd pokeveal/frontend-react
npm install
npm run dev
```

Then open **http://localhost:5173**. The Vite dev server proxies all
`/api/*` requests to the backend on port 8000, so both need to be running
at the same time — backend in one terminal, `npm run dev` in another.

To build a static production bundle instead of running the dev server:

```bash
npm run build
```

This outputs static files to `frontend-react/dist/`, which you could serve
with any static file host (or point FastAPI at, with a small config change)
if you want a single deployable folder.

## Resetting your save

Click "Reset save" in the app, or just delete `backend/pokeveal.db` and
refresh the page.

## Project structure

```
pokeveal/
  backend/
    main.py              FastAPI app (API routes + serves the vanilla frontend)
    game.py              Game rules: coin tiers, clue shop, scoring, achievements
    requirements.txt
    data/
      pokemon_kanto.json Bundled Gen 1 Pokemon data
    pokeveal.db          Created automatically on first run (your save data)
  frontend/
    index.html           No-build vanilla JS frontend (Option A)
  frontend-react/
    src/                 React + Vite + Tailwind frontend (Option B)
    package.json
```
