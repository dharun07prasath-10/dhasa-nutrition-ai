import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, MealPlan
from ..schemas import MealPlanGenerateRequest, MealPlanResponse
from ..services.meal_planner_service import generate_7day_meal_plan
from ..auth import get_current_user

router = APIRouter(prefix="/meal-plans", tags=["Meal Planner"])

@router.post("/generate", response_model=MealPlanResponse)
def generate_plan(
    req: MealPlanGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    """Generates an affordable 7-day high-protein Indian meal plan with ingredient reuse and consolidated grocery list."""
    return generate_7day_meal_plan(req)

@router.post("/save")
def save_meal_plan(
    plan: MealPlanResponse,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Deactivate older plans
    db.query(MealPlan).filter(MealPlan.user_id == current_user.id).update({"is_active": False})

    new_plan = MealPlan(
        user_id=current_user.id,
        title=plan.title,
        target_calories=plan.average_daily_calories,
        target_protein=plan.average_daily_protein,
        daily_budget_inr=round(plan.estimated_weekly_cost / 7.0, 1),
        plan_json=plan.json(),
        is_active=True
    )
    db.add(new_plan)
    db.commit()
    return {"message": "Meal plan saved successfully", "plan_id": new_plan.id}

@router.get("")
def get_user_meal_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).order_by(MealPlan.created_at.desc()).all()
    result = []
    for p in plans:
        try:
            data = json.loads(p.plan_json)
        except Exception:
            data = {}
        result.append({
            "id": p.id,
            "title": p.title,
            "is_active": p.is_active,
            "created_at": p.created_at.isoformat(),
            "plan_data": data
        })
    return result

