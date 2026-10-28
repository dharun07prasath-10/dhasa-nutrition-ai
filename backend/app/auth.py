import hashlib
import jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .config import settings
from .database import get_db
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)

def hash_password(password: str) -> str:
    # Use SHA-256 with salt for guaranteed reliable compatibility across platforms
    salt = "ai_fitness_salt_2026"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # If no token provided or demo mode, return default user
    if not token:
        user = db.query(User).filter(User.username == "fitness_user").first()
        if not user:
            # Create default demo user
            user = User(
                username="fitness_user",
                email="user@aifitness.local",
                hashed_password=hash_password("fitness123"),
                full_name="Fitness Champion",
                daily_calorie_target=2200.0,
                daily_protein_target=110.0,
                daily_budget_inr=180.0,
                dietary_preference="all",
                preferred_cuisine="South Indian & Tamil"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

