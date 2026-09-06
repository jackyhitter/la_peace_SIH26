from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.models.operator import Operator

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def authenticate_operator(session: AsyncSession, username: str, password: str) -> Optional[Operator]:
    result = await session.execute(select(Operator).where(Operator.username == username))
    operator = result.scalars().first()
    if not operator:
        return None
    if not verify_password(password, operator.password_hash):
        return None
    return operator

async def get_operator_by_id(session: AsyncSession, operator_id: int) -> Optional[Operator]:
    result = await session.execute(select(Operator).where(Operator.id == operator_id))
    return result.scalars().first()

async def get_operator_by_username(session: AsyncSession, username: str) -> Optional[Operator]:
    result = await session.execute(select(Operator).where(Operator.username == username))
    return result.scalars().first()
