"""
PokeVeal backend.

Run with:
    uvicorn main:app --reload

Serves:
  - REST API under /api/*
  - The static frontend (frontend/index.html) at /

State is persisted in a local SQLite file (pokeveal.db) so a browser
refresh (or restarting the server) continues the same game, per the
"Save System" in the design doc.
"""
import json
import sqlite3
import time
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import game

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "pokeveal.db"

app = FastAPI(title="PokeVeal API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------------------------
# Persistence
# --------------------------------------------------------------------------

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            state TEXT NOT NULL,
            updated_at REAL NOT NULL
        )"""
    )
    return conn


def load_state(session_id: str) -> Optional[dict]:
    conn = get_conn()
    try:
        row = conn.execute(
            "SELECT state FROM sessions WHERE session_id = ?", (session_id,)
        ).fetchone()
        return json.loads(row[0]) if row else None
    finally:
        conn.close()


def save_state(session_id: str, state: dict) -> None:
    conn = get_conn()
    try:
        conn.execute(
            """INSERT INTO sessions (session_id, state, updated_at)
               VALUES (?, ?, ?)
               ON CONFLICT(session_id) DO UPDATE SET state=excluded.state, updated_at=excluded.updated_at""",
            (session_id, json.dumps(state), time.time()),
        )
        conn.commit()
    finally:
        conn.close()


# --------------------------------------------------------------------------
# State helpers
# --------------------------------------------------------------------------

def default_region_unlocks() -> dict:
    return {r["key"]: r["unlocked_by_default"] for r in game.REGIONS}


def start_round(state: dict) -> None:
    round_number = state["current_index"] + 1
    state["round"] = {
        "coins_start": game.coins_for_round(round_number),
        "coins_remaining": game.coins_for_round(round_number),
        "bought_clues": [],
        "wrong_guesses": [],
        "start_time": time.time(),
    }


def new_game_state(region: str) -> dict:
    order = game.new_pokemon_order()
    state = {
        "region": region,
        "order": order,
        "current_index": 0,
        "pokedex": {},
        "stats": {
            "total_score": 0,
            "correct_guesses": 0,
            "revealed_count": 0,
            "coins_spent_total": 0,
            "clue_usage": {},
            "best_round_score": 0,
            "rounds_played": 0,
            "fastest_guess_seconds": None,
            "last_round_clue_count": None,
            "last_round_correct": None,
        },
        "achievements": [],
        "region_unlocks": default_region_unlocks(),
        "completed": False,
    }
    start_round(state)
    return state


def current_pokemon(state: dict) -> dict:
    pid = state["order"][state["current_index"]]
    return game.POKEMON_BY_ID[pid]


def public_state(state: dict) -> dict:
    """State view safe to send to the client (no hidden answer)."""
    total = game.TOTAL_KANTO
    collected = sum(1 for v in state["pokedex"].values() if v["collected"])
    completed = state["completed"]

    round_view = None
    if not completed:
        pkmn = current_pokemon(state)
        rnd = state["round"]
        bought = rnd["bought_clues"]
        clues_owned = {
            c: game.get_clue_value(pkmn, c) for c in bought
        }
        round_view = {
            "round_number": state["current_index"] + 1,
            "total_rounds": len(state["order"]),
            "coins_start": rnd["coins_start"],
            "coins_remaining": rnd["coins_remaining"],
            "bought_clues": bought,
            "clue_values": clues_owned,
            "wrong_guesses": rnd["wrong_guesses"],
        }

    return {
        "region": state["region"],
        "round": round_view,
        "completed": completed,
        "pokedex_collected": collected,
        "pokedex_total": total,
        "clue_shop": game.CLUE_SHOP,
        "stats": state["stats"],
        "achievements": {
            "unlocked": state["achievements"],
            "catalog": game.ACHIEVEMENT_DEFS,
        },
        "regions": [
            {**r, "unlocked": state["region_unlocks"].get(r["key"], False)}
            for r in game.REGIONS
        ],
    }


def finish_round(state: dict, correct: bool, revealed: bool):
    pkmn = current_pokemon(state)
    rnd = state["round"]
    stats = state["stats"]

    stats["rounds_played"] += 1
    stats["coins_spent_total"] += rnd["coins_start"] - rnd["coins_remaining"]

    clue_count = len(rnd["bought_clues"])
    stats["last_round_clue_count"] = clue_count
    stats["last_round_correct"] = correct

    round_score = 0
    if correct:
        round_score = rnd["coins_remaining"]
        stats["total_score"] += round_score
        stats["correct_guesses"] += 1
        stats["best_round_score"] = max(stats["best_round_score"], round_score)
        duration = time.time() - rnd["start_time"]
        if stats["fastest_guess_seconds"] is None or duration < stats["fastest_guess_seconds"]:
            stats["fastest_guess_seconds"] = round(duration, 1)
    if revealed:
        stats["revealed_count"] += 1

    state["pokedex"][str(pkmn["id"])] = {
        "id": pkmn["id"],
        "name": pkmn["name"],
        "sprite": pkmn["sprite"],
        "collected": True,
        "correct": correct,
    }

    stats["collected_count"] = sum(1 for v in state["pokedex"].values() if v["collected"])
    new_achievements = game.check_new_achievements(stats, set(state["achievements"]))
    state["achievements"].extend(new_achievements)

    # advance
    state["current_index"] += 1
    if state["current_index"] >= len(state["order"]):
        state["completed"] = True
        idx = [r["key"] for r in game.REGIONS].index(state["region"])
        if idx + 1 < len(game.REGIONS):
            state["region_unlocks"][game.REGIONS[idx + 1]["key"]] = True
    else:
        start_round(state)

    return round_score, new_achievements


# --------------------------------------------------------------------------
# API models
# --------------------------------------------------------------------------

class NewGameRequest(BaseModel):
    session_id: str
    region: str = "kanto"


class BuyClueRequest(BaseModel):
    clue_type: str


class GuessRequest(BaseModel):
    guess: str


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------

@app.post("/api/session")
def create_session():
    return {"session_id": str(uuid.uuid4())}


@app.post("/api/game/new")
def new_game(req: NewGameRequest):
    if req.region not in game.PLAYABLE_REGIONS:
        raise HTTPException(400, f"Region '{req.region}' is not playable yet.")
    state = new_game_state(req.region)
    save_state(req.session_id, state)
    return public_state(state)


@app.get("/api/game/{session_id}/state")
def get_state(session_id: str):
    state = load_state(session_id)
    if state is None:
        raise HTTPException(404, "No saved game for this session. Start a new game.")
    return public_state(state)


@app.post("/api/game/{session_id}/buy-clue")
def buy_clue(session_id: str, req: BuyClueRequest):
    state = load_state(session_id)
    if state is None:
        raise HTTPException(404, "No saved game for this session.")
    if state["completed"]:
        raise HTTPException(400, "Region already completed.")
    if req.clue_type not in game.CLUE_SHOP:
        raise HTTPException(400, "Unknown clue type.")
    rnd = state["round"]
    if req.clue_type in rnd["bought_clues"]:
        raise HTTPException(400, "Clue already purchased this round.")
    cost = game.CLUE_SHOP[req.clue_type]["cost"]
    if cost > rnd["coins_remaining"]:
        raise HTTPException(400, "Not enough coins.")
    rnd["coins_remaining"] -= cost
    rnd["bought_clues"].append(req.clue_type)
    usage = state["stats"]["clue_usage"]
    usage[req.clue_type] = usage.get(req.clue_type, 0) + 1
    save_state(session_id, state)
    pkmn = current_pokemon(state)
    return {
        "clue_type": req.clue_type,
        "value": game.get_clue_value(pkmn, req.clue_type),
        "coins_remaining": rnd["coins_remaining"],
    }


@app.post("/api/game/{session_id}/guess")
def guess(session_id: str, req: GuessRequest):
    state = load_state(session_id)
    if state is None:
        raise HTTPException(404, "No saved game for this session.")
    if state["completed"]:
        raise HTTPException(400, "Region already completed.")
    pkmn = current_pokemon(state)
    correct = game.check_guess(pkmn, req.guess)
    if correct:
        round_score, new_achievements = finish_round(state, correct=True, revealed=False)
        save_state(session_id, state)
        return {
            "correct": True,
            "answer": pkmn["name"],
            "hires": pkmn["hires"],
            "round_score": round_score,
            "new_achievements": new_achievements,
            "state": public_state(state),
        }
    else:
        state["round"]["wrong_guesses"].append(req.guess.strip())
        save_state(session_id, state)
        return {"correct": False, "state": public_state(state)}


@app.post("/api/game/{session_id}/reveal")
def reveal(session_id: str):
    state = load_state(session_id)
    if state is None:
        raise HTTPException(404, "No saved game for this session.")
    if state["completed"]:
        raise HTTPException(400, "Region already completed.")
    pkmn = current_pokemon(state)
    round_score, new_achievements = finish_round(state, correct=False, revealed=True)
    save_state(session_id, state)
    return {
        "answer": pkmn["name"],
        "sprite": pkmn["sprite"],
        "round_score": round_score,
        "new_achievements": new_achievements,
        "state": public_state(state),
    }


@app.get("/api/game/{session_id}/pokedex")
def pokedex(session_id: str):
    state = load_state(session_id)
    if state is None:
        raise HTTPException(404, "No saved game for this session.")
    all_entries = []
    for p in game.POKEMON:
        entry = state["pokedex"].get(str(p["id"]))
        all_entries.append({
            "id": p["id"],
            "name": p["name"] if entry else None,
            "sprite": p["sprite"] if entry else None,
            "collected": bool(entry),
            "correct": entry["correct"] if entry else False,
        })
    return {"entries": all_entries}


@app.delete("/api/game/{session_id}")
def delete_game(session_id: str):
    conn = get_conn()
    try:
        conn.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
        conn.commit()
    finally:
        conn.close()
    return {"deleted": True}


# --------------------------------------------------------------------------
# Root info route (React frontend runs separately via `npm run dev`)
# --------------------------------------------------------------------------

@app.get("/")
def index():
    return {"message": "PokeVeal API is running. Start the React frontend with 'npm run dev' in frontend-react/ and open http://localhost:5173"}