"""
PokeVeal game logic.

Handles clue costs, coin budgets per round, session state shape,
scoring, and achievement checks. Persistence (SQLite) lives in main.py;
this module is pure game rules so it's easy to test/extend.
"""
import json
import random
import time
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
POKEMON = json.loads((DATA_DIR / "pokemon_kanto.json").read_text(encoding="utf-8"))
POKEMON_BY_ID = {p["id"]: p for p in POKEMON}
TOTAL_KANTO = len(POKEMON)  # 151

REGIONS = [
    {"key": "kanto", "label": "Kanto", "count": 151, "unlocked_by_default": True},
    {"key": "johto", "label": "Johto", "count": 100, "unlocked_by_default": False},
    {"key": "hoenn", "label": "Hoenn", "count": 135, "unlocked_by_default": False},
    {"key": "sinnoh", "label": "Sinnoh", "count": 107, "unlocked_by_default": False},
    {"key": "unova", "label": "Unova", "count": 156, "unlocked_by_default": False},
    {"key": "kalos", "label": "Kalos", "count": 72, "unlocked_by_default": False},
    {"key": "alola", "label": "Alola", "count": 88, "unlocked_by_default": False},
    {"key": "galar", "label": "Galar", "count": 89, "unlocked_by_default": False},
    {"key": "paldea", "label": "Paldea", "count": 120, "unlocked_by_default": False},
]

# Only Kanto has data bundled in this MVP; other regions are shown locked/"coming soon".
PLAYABLE_REGIONS = {"kanto"}

# Clue shop: type -> (tier, cost)
CLUE_SHOP = {
    "generation":       {"tier": "cheap",     "cost": 10, "label": "Generation"},
    "egg_group":        {"tier": "cheap",     "cost": 10, "label": "Egg Group"},
    "height_range":     {"tier": "cheap",     "cost": 10, "label": "Height Range"},
    "weight_range":     {"tier": "cheap",     "cost": 10, "label": "Weight Range"},
    "type":             {"tier": "medium",    "cost": 20, "label": "Type"},
    "species":          {"tier": "medium",    "cost": 20, "label": "Species"},
    "evolution_stage":  {"tier": "medium",    "cost": 20, "label": "Evolution Stage"},
    "ability":          {"tier": "expensive", "cost": 30, "label": "Ability"},
    "evolution_chain":  {"tier": "expensive", "cost": 30, "label": "Evolution Chain"},
    "pokedex_entry":    {"tier": "premium",   "cost": 40, "label": "Pokedex Entry"},
    "silhouette":       {"tier": "premium",   "cost": 40, "label": "Silhouette"},
}


def coins_for_round(round_number: int) -> int:
    """Round 1-indexed. Coin budget tiers (per the latest design)."""
    if round_number <= 25:
        return 100
    if round_number <= 50:
        return 90
    if round_number <= 75:
        return 80
    if round_number <= 100:
        return 60
    return 50


def new_pokemon_order(seed: int | None = None) -> list[int]:
    ids = [p["id"] for p in POKEMON]
    rng = random.Random(seed)
    rng.shuffle(ids)
    return ids


def height_range_label(h: float) -> str:
    if h is None:
        return "Unknown"
    if h < 0.5:
        return "Under 0.5 m"
    if h < 1.0:
        return "0.5 m - 1.0 m"
    if h < 1.5:
        return "1.0 m - 1.5 m"
    if h < 2.0:
        return "1.5 m - 2.0 m"
    return "Over 2.0 m"


def weight_range_label(w: float) -> str:
    if w is None:
        return "Unknown"
    if w < 5:
        return "Under 5 kg"
    if w < 20:
        return "5 kg - 20 kg"
    if w < 50:
        return "20 kg - 50 kg"
    if w < 100:
        return "50 kg - 100 kg"
    return "Over 100 kg"


def get_clue_value(pokemon: dict, clue_type: str):
    """Return the clue payload for a given pokemon + clue type."""
    if clue_type == "generation":
        return "Generation I"
    if clue_type == "egg_group":
        return ", ".join(pokemon["egg_groups"]) or "Unknown"
    if clue_type == "height_range":
        return height_range_label(pokemon["height_m"])
    if clue_type == "weight_range":
        return weight_range_label(pokemon["weight_kg"])
    if clue_type == "type":
        return ", ".join(pokemon["types"])
    if clue_type == "species":
        return pokemon["species"]
    if clue_type == "evolution_stage":
        stage = pokemon["evolution_stage"]
        total = len(pokemon["evolution_chain"])
        return f"Stage {stage} of {total}"
    if clue_type == "ability":
        # Reveal one random (non-hidden preferred) ability name, not all of them.
        abilities = pokemon["abilities"]
        non_hidden = [a for a in abilities if not a["hidden"]]
        pick = (non_hidden or abilities)[0]
        return pick["name"]
    if clue_type == "evolution_chain":
        chain = pokemon["evolution_chain"]
        stage = pokemon["evolution_stage"]
        total = len(chain)
        if total == 1:
            return "Does not evolve"
        if stage == total:
            return f"Final form — evolves through {total} stages total"
        return f"Evolves through {total} stages total (this one is stage {stage})"
    if clue_type == "pokedex_entry":
        return pokemon["description"]
    if clue_type == "silhouette":
        return pokemon["sprite"]
    raise ValueError(f"Unknown clue type: {clue_type}")


POKEMON_BY_NORM_NAME = {}
for _p in POKEMON:
    POKEMON_BY_NORM_NAME[_p["name"].strip().lower().replace(".", "").replace("'", "").replace(" ", "")] = _p


def guess_feedback(guessed_pokemon: dict, answer: dict) -> dict:
    """Hot/cold comparison between a wrongly-guessed (but real) Pokemon and the answer."""
    type_match = bool(set(guessed_pokemon["types"]) & set(answer["types"]))
    gen_match = True  # Kanto-only MVP: all Gen I, kept for future multi-region use
    aw, gw = answer["weight_kg"], guessed_pokemon["weight_kg"]
    if aw and gw:
        weight_similarity = round(max(0, 100 - (abs(aw - gw) / max(aw, gw)) * 100))
    else:
        weight_similarity = None
    return {
        "type_match": type_match,
        "generation_match": gen_match,
        "weight_similarity": weight_similarity,
    }


def normalize_guess(text: str) -> str:
    return text.strip().lower().replace(".", "").replace("'", "").replace(" ", "")


def levenshtein_distance(a: str, b: str) -> int:
    """Standard edit distance: how many single-character edits (insert/delete/
    substitute) turn a into b. Used to tolerate small typos on guesses."""
    if a == b:
        return 0
    if len(a) == 0:
        return len(b)
    if len(b) == 0:
        return len(a)
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        curr = [i] + [0] * len(b)
        for j, cb in enumerate(b, 1):
            cost = 0 if ca == cb else 1
            curr[j] = min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
        prev = curr
    return prev[-1]


def check_guess(pokemon: dict, guess: str) -> bool:
    norm_guess = normalize_guess(guess)
    norm_name = normalize_guess(pokemon["name"])
    if not norm_guess:
        return False
    if norm_guess == norm_name:
        return True
    # Tolerate small typos: 1 character off for short names, 2 for longer ones.
    max_dist = 1 if len(norm_name) <= 5 else 2
    return levenshtein_distance(norm_guess, norm_name) <= max_dist


ACHIEVEMENT_DEFS = [
    {"key": "first_catch", "label": "First Catch", "desc": "Correctly guess your first Pokemon."},
    {"key": "catch_25", "label": "Getting the Hang of It", "desc": "Catch 25 Pokemon."},
    {"key": "catch_100", "label": "Serious Collector", "desc": "Catch 100 Pokemon."},
    {"key": "no_clues", "label": "Pure Instinct", "desc": "Guess correctly without buying any clues."},
    {"key": "one_clue", "label": "Sharp Eye", "desc": "Guess correctly using only one clue."},
    {"key": "kanto_champion", "label": "Kanto Champion", "desc": "Complete the Kanto Pokedex (151/151)."},
]


def check_new_achievements(stats: dict, already_unlocked: set) -> list[str]:
    newly = []

    def award(key):
        if key not in already_unlocked:
            newly.append(key)

    if stats["correct_guesses"] >= 1:
        award("first_catch")
    if stats["correct_guesses"] >= 25:
        award("catch_25")
    if stats["correct_guesses"] >= 100:
        award("catch_100")
    if stats.get("last_round_clue_count") == 0 and stats.get("last_round_correct"):
        award("no_clues")
    if stats.get("last_round_clue_count") == 1 and stats.get("last_round_correct"):
        award("one_clue")
    if stats["collected_count"] >= TOTAL_KANTO:
        award("kanto_champion")
    return newly