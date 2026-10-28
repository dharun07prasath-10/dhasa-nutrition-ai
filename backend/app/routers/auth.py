from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, UserOut, UserUpdate, Token
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if username or email exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name or "Fitness Enthusiast",
        daily_calorie_target=user_data.daily_calorie_target or 2200.0,
        daily_protein_target=user_data.daily_protein_target or 110.0,
        daily_budget_inr=user_data.daily_budget_inr or 180.0,
        dietary_preference=user_data.dietary_preference or "all",
        preferred_cuisine=user_data.preferred_cuisine or "South Indian & Tamil"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.username})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(updates: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

