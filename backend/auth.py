"""
PokeVeal auth module — MongoDB Atlas edition.

Handles user accounts (username/password), password hashing, and JWT
issuing/verification.
"""
import os
import time
import uuid
from typing import Optional

import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Header
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv

from pathlib import Path
load_dotenv(Path(__file__).parent / ".env")
print("Loaded environment variables from .env file.")
MONGO_URI = os.environ.get("MONGO_URI")
JWT_SECRET = os.environ.get("JWT_SECRET", "change-this-secret-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_SECONDS = 60 * 60 * 24 * 30  # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------------------------------------------------------------------
# MongoDB connection (module-level singleton)
# ---------------------------------------------------------------------------
_client: Optional[MongoClient] = None

def get_db():
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = _client["pokeveal"]
    # Ensure unique index on username
    db["users"].create_index("username", unique=True)
    return db


# ---------------------------------------------------------------------------
# Password helpers
# ---------------------------------------------------------------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


# ---------------------------------------------------------------------------
# User CRUD
# ---------------------------------------------------------------------------

def create_user(user_id: str, username: str, password: str) -> None:
    db = get_db()
    try:
        db["users"].insert_one({
            "_id": user_id,
            "username": username,
            "password_hash": hash_password(password),
            "created_at": time.time(),
        })
    except DuplicateKeyError:
        raise HTTPException(400, "Username already taken.")


def get_user_by_username(username: str) -> Optional[dict]:
    db = get_db()
    doc = db["users"].find_one({"username": username})
    if doc is None:
        return None
    return {
        "user_id": doc["_id"],
        "username": doc["username"],
        "password_hash": doc["password_hash"],
    }


def username_taken(username: str) -> bool:
    return get_user_by_username(username) is not None


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------

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
    """FastAPI dependency: extracts and verifies the Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid Authorization header.")
    token = authorization.removeprefix("Bearer ").strip()
    payload = decode_token(token)
    return {"user_id": payload["user_id"], "username": payload["username"]}

if __name__ == "__main__":
    db = get_db()
    print("Connected to:", db.client.address)
    print("Collections:", db.list_collection_names())