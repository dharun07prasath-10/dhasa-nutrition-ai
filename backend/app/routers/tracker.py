import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, DailyLogItem, DailyWaterLog
from ..schemas import DailyLogItemCreate, DailyLogItemOut, DailySummary
from ..auth import get_current_user

router = APIRouter(prefix="/tracker", tags=["Daily Nutrition Tracker"])

@router.get("/summary", response_model=DailySummary)
def get_daily_summary(
    date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_date = date or datetime.date.today().isoformat()

    items = db.query(DailyLogItem).filter(
        DailyLogItem.user_id == current_user.id,
        DailyLogItem.log_date == target_date
    ).all()

    water = db.query(DailyWaterLog).filter(
        DailyWaterLog.user_id == current_user.id,
        DailyWaterLog.log_date == target_date
    ).first()

    total_calories = sum(i.calories for i in items)
    total_protein = sum(i.protein for i in items)
    total_carbs = sum(i.carbs for i in items)
    total_fats = sum(i.fats for i in items)
    total_fiber = sum(i.fiber for i in items)
    total_sugar = sum(i.sugar for i in items)
    total_sodium = sum(i.sodium_mg for i in items)
    total_sat_fat = sum(i.saturated_fat for i in items)

    return DailySummary(
        date=target_date,
        total_calories=round(total_calories, 1),
        total_protein=round(total_protein, 1),
        total_carbs=round(total_carbs, 1),
        total_fats=round(total_fats, 1),
        total_fiber=round(total_fiber, 1),
        total_sugar=round(total_sugar, 1),
        total_sodium=round(total_sodium, 0),
        total_saturated_fat=round(total_sat_fat, 1),
        water_glasses=water.glasses if water else 0,
        water_ml=water.ml if water else 0,
        target_calories=current_user.daily_calorie_target,
        target_protein=current_user.daily_protein_target,
        items=items
    )

@router.post("/log", response_model=DailyLogItemOut)
def log_meal_item(
    item: DailyLogItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    log_item = DailyLogItem(
        user_id=current_user.id,
        log_date=item.log_date,
        meal_type=item.meal_type,
        food_name=item.food_name,
        serving_amount=item.serving_amount,
        serving_unit=item.serving_unit,
        calories=item.calories,
        protein=item.protein,
        carbs=item.carbs,
        fats=item.fats,
        fiber=item.fiber,
        sugar=item.sugar or 0.0,
        sodium_mg=item.sodium_mg or 0.0,
        saturated_fat=item.saturated_fat or 0.0
    )
    db.add(log_item)
    db.commit()
    db.refresh(log_item)
    return log_item

@router.delete("/item/{item_id}")
def delete_logged_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(DailyLogItem).filter(
        DailyLogItem.id == item_id,
        DailyLogItem.user_id == current_user.id
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Logged food entry deleted successfully"}

@router.post("/water")
def update_water_intake(
    glasses: int = Query(..., ge=0, le=30),
    date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_date = date or datetime.date.today().isoformat()
    water = db.query(DailyWaterLog).filter(
        DailyWaterLog.user_id == current_user.id,
        DailyWaterLog.log_date == target_date
    ).first()

    if not water:
        water = DailyWaterLog(user_id=current_user.id, log_date=target_date, glasses=glasses, ml=glasses * 250)
        db.add(water)
    else:
        water.glasses = glasses
        water.ml = glasses * 250
    db.commit()
    return {"glasses": water.glasses, "ml": water.ml, "date": target_date}

