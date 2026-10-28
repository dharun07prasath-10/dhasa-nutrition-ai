import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import FoodItem
from ..schemas import FoodItemOut, PriceAdjustmentRequest, ServingRecalcRequest

router = APIRouter(prefix="/foods", tags=["Food Catalogue"])

@router.get("", response_model=List[FoodItemOut])
def get_foods(
    search: Optional[str] = None,
    category: Optional[str] = None,
    dietary_type: Optional[str] = None,
    is_recipe: Optional[bool] = None,
    sort_by: Optional[str] = Query("id", regex="^(id|protein|cost_per_serving_inr|cost_per_10g_protein_inr|calories|fiber)$"),
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    query = db.query(FoodItem)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter((FoodItem.name.ilike(term)) | (FoodItem.cuisine.ilike(term)))

    if category and category.strip() and category != "all":
        query = query.filter(FoodItem.category.ilike(f"%{category.strip()}%"))

    if dietary_type and dietary_type.strip() and dietary_type != "all":
        query = query.filter(FoodItem.dietary_type == dietary_type.strip().lower())

    if is_recipe is not None:
        query = query.filter(FoodItem.is_recipe == is_recipe)

    # Sorting
    sort_column = getattr(FoodItem, sort_by, FoodItem.id)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    return query.all()

@router.get("/{food_id}", response_model=FoodItemOut)
def get_food_by_id(food_id: int, db: Session = Depends(get_db)):
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")
    return food

@router.post("/adjust-price", response_model=FoodItemOut)
def adjust_food_price(req: PriceAdjustmentRequest, db: Session = Depends(get_db)):
    """Allows user to customize local market ingredient prices."""
    food = db.query(FoodItem).filter(FoodItem.id == req.food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")

    new_price = max(0.5, float(req.new_cost_per_serving_inr))
    food.cost_per_serving_inr = round(new_price, 2)
    
    # Recalculate cost per 100g and cost per 10g protein
    if food.serving_weight_g > 0:
        food.cost_per_100g_inr = round((new_price / food.serving_weight_g) * 100.0, 2)
    if food.protein > 0:
        food.cost_per_10g_protein_inr = round((new_price / food.protein) * 10.0, 2)

    db.commit()
    db.refresh(food)
    return food

@router.post("/recalculate-serving")
def recalculate_recipe_serving(req: ServingRecalcRequest, db: Session = Depends(get_db)):
    """Dynamically recalculates all ingredient quantities and nutritional values when servings count changes."""
    food = db.query(FoodItem).filter(FoodItem.id == req.recipe_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Recipe not found")

    servings = max(0.25, float(req.servings))

    # Scale ingredients
    try:
        ingredients_list = json.loads(food.main_ingredients)
    except Exception:
        ingredients_list = []

    scaled_ingredients = []
    for ing in ingredients_list:
        scaled_ingredients.append(f"{ing} (scaled for {servings:.1f} servings)")

    return {
        "recipe_id": food.id,
        "name": food.name,
        "servings": servings,
        "calories": round(food.calories * servings, 1),
        "protein": round(food.protein * servings, 1),
        "carbs": round(food.carbs * servings, 1),
        "fats": round(food.fats * servings, 1),
        "fiber": round(food.fiber * servings, 1),
        "sugar": round(food.sugar * servings, 1),
        "mufa": round(food.mufa * servings, 1),
        "pufa": round(food.pufa * servings, 1),
        "omega3": round(food.omega3 * servings, 2),
        "saturated_fat": round(food.saturated_fat * servings, 1),
        "sodium_mg": round(food.sodium_mg * servings, 0),
        "potassium_mg": round(food.potassium_mg * servings, 0),
        "calcium_mg": round(food.calcium_mg * servings, 0),
        "iron_mg": round(food.iron_mg * servings, 1),
        "cost_total_inr": round(food.cost_per_serving_inr * servings, 1),
        "scaled_ingredients": scaled_ingredients
    }

