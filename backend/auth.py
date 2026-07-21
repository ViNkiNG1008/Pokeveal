"""
PokeVeal auth module.

Handles user accounts (username/password), password hashing, and JWT
issuing/verification. Kept separate from main.py so the auth mechanism
can be swapped later without touching game routes.
"""
import sqlite3
import time
from pathlib import Path
from typing import Optional

import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Header

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "pokeveal.db"

# In a real deployment, load this from an environment variable instead.
JWT_SECRET = "change-this-secret-in-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_SECONDS = 60 * 60 * 24 * 30  # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at REAL NOT NULL
        )"""
    )
    return conn


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_user(user_id: str, username: str, password: str) -> None:
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO users (user_id, username, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (user_id, username, hash_password(password), time.time()),
        )
        conn.commit()
    finally:
        conn.close()


def get_user_by_username(username: str) -> Optional[dict]:
    conn = get_conn()
    try:
        row = conn.execute(
            "SELECT user_id, username, password_hash FROM users WHERE username = ?",
            (username,),
        ).fetchone()
        if row is None:
            return None
        return {"user_id": row[0], "username": row[1], "password_hash": row[2]}
    finally:
        conn.close()


def username_taken(username: str) -> bool:
    return get_user_by_username(username) is not None


def create_token(user_id: str, username: str) -> str:
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": time.time() + JWT_EXPIRY_SECONDS,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Session expired, please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid authentication token.")


def get_current_user(authorization: str = Header(default=None)) -> dict:
    """FastAPI dependency: extracts and verifies the Bearer token.
    Use as: user = Depends(get_current_user) in any route that needs auth.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid Authorization header.")
    token = authorization.removeprefix("Bearer ").strip()
    payload = decode_token(token)
    return {"user_id": payload["user_id"], "username": payload["username"]}