from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import FoodItem, SavedRecipe, User
from ..schemas import FoodItemOut
from ..auth import get_current_user

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("", response_model=List[FoodItemOut])
def get_recipes(db: Session = Depends(get_db)):
    """Returns only entries that are complete cooked recipes/meals."""
    return db.query(FoodItem).filter(FoodItem.is_recipe == True).all()

@router.get("/{recipe_id}", response_model=FoodItemOut)
def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(FoodItem).filter(FoodItem.id == recipe_id, FoodItem.is_recipe == True).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.post("/save/{recipe_id}")
def save_recipe_to_favorites(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recipe = db.query(FoodItem).filter(FoodItem.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    existing = db.query(SavedRecipe).filter(
        SavedRecipe.user_id == current_user.id,
        SavedRecipe.food_item_id == recipe_id
    ).first()

    if existing:
        return {"message": "Recipe already saved in favorites", "saved": True}

    saved = SavedRecipe(user_id=current_user.id, food_item_id=recipe_id, notes="Saved from Recipe Explorer")
    db.add(saved)
    db.commit()
    return {"message": "Recipe saved to favorites successfully", "saved": True}

@router.get("/favorites/list")
def get_favorite_recipes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_items = db.query(SavedRecipe).filter(SavedRecipe.user_id == current_user.id).all()
    result = []
    for s in saved_items:
        if s.food_item:
            result.append({
                "saved_id": s.id,
                "notes": s.notes,
                "saved_at": s.saved_at.isoformat(),
                "recipe": s.food_item
            })
    return result

@router.delete("/favorites/{recipe_id}")
def remove_favorite_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved = db.query(SavedRecipe).filter(
        SavedRecipe.user_id == current_user.id,
        SavedRecipe.food_item_id == recipe_id
    ).first()
    if saved:
        db.delete(saved)
        db.commit()
    return {"message": "Recipe removed from favorites", "removed": True}

