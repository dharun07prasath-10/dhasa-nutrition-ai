import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ShoppingListItem, FoodItem
from ..schemas import ShoppingListItemCreate, ShoppingListItemOut
from ..auth import get_current_user

router = APIRouter(prefix="/shopping-lists", tags=["Shopping List"])

@router.get("", response_model=List[ShoppingListItemOut])
def get_shopping_list(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(ShoppingListItem).filter(ShoppingListItem.user_id == current_user.id).order_by(ShoppingListItem.is_checked.asc(), ShoppingListItem.id.desc()).all()

@router.post("", response_model=ShoppingListItemOut)
def add_shopping_item(item: ShoppingListItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_item = ShoppingListItem(
        user_id=current_user.id,
        item_name=item.item_name,
        quantity=item.quantity,
        estimated_cost_inr=item.estimated_cost_inr,
        category=item.category,
        is_checked=False
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.post("/from-recipe/{recipe_id}")
def add_from_recipe(recipe_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = db.query(FoodItem).filter(FoodItem.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    try:
        ingredients = json.loads(recipe.main_ingredients)
    except Exception:
        ingredients = [recipe.name]

    added = 0
    for ing in ingredients:
        # Check if already in list
        exists = db.query(ShoppingListItem).filter(
            ShoppingListItem.user_id == current_user.id,
            ShoppingListItem.item_name == ing
        ).first()
        if not exists:
            db.add(ShoppingListItem(
                user_id=current_user.id,
                item_name=ing,
                quantity="1 recipe portion",
                estimated_cost_inr=round(recipe.cost_per_serving_inr / max(len(ingredients), 1), 1),
                category="Recipe Ingredients",
                is_checked=False
            ))
            added += 1

    db.commit()
    return {"message": f"Added {added} ingredients to shopping list", "recipe": recipe.name}

@router.post("/bulk")
def add_bulk_items(items: List[Dict[str, Any]], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for item in items:
        name = item.get("item", item.get("item_name", "Pantry Item"))
        qty = item.get("quantity", "1 unit")
        cost = float(item.get("estimated_cost", 25.0))
        cat = item.get("category", "General")

        exists = db.query(ShoppingListItem).filter(
            ShoppingListItem.user_id == current_user.id,
            ShoppingListItem.item_name == name
        ).first()
        if not exists:
            db.add(ShoppingListItem(
                user_id=current_user.id,
                item_name=name,
                quantity=qty,
                estimated_cost_inr=cost,
                category=cat,
                is_checked=False
            ))
    db.commit()
    return {"message": f"Added {len(items)} grocery items to list"}

@router.patch("/{item_id}/toggle")
def toggle_item(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(ShoppingListItem).filter(
        ShoppingListItem.id == item_id,
        ShoppingListItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.is_checked = not item.is_checked
    db.commit()
    return {"id": item.id, "is_checked": item.is_checked}

@router.delete("/{item_id}")
def delete_item(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(ShoppingListItem).filter(
        ShoppingListItem.id == item_id,
        ShoppingListItem.user_id == current_user.id
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Item deleted"}

@router.delete("/clear/completed")
def clear_completed(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(ShoppingListItem).filter(
        ShoppingListItem.user_id == current_user.id,
        ShoppingListItem.is_checked == True
    ).delete()
    db.commit()
    return {"message": "Completed items cleared"}

