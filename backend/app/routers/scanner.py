from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ScanHistory, DailyLogItem, FoodItem
from ..auth import get_current_user
from ..schemas import ScannerResult, PortionOption
from ..services.hf_vision import (
    identify_food_from_image,
    find_food_in_catalogue,
    generate_health_report,
    get_high_protein_alternatives,
    get_recommended_recipes_for_food
)

router = APIRouter(prefix="/scanner", tags=["AI Food Scanner"])

@router.post("/scan-image", response_model=ScannerResult)
async def scan_food_image(
    file: UploadFile = File(...),
    custom_hint: Optional[str] = Form(None),
    portion_multiplier: Optional[float] = Form(1.0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Scan food image using Hugging Face Vision API and return complete nutrition analysis."""
    try:
        contents = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read uploaded image file.")

    # Identify food
    identified_food_name, confidence = identify_food_from_image(contents, custom_hint=custom_hint)
    
    # Retrieve nutrient profile from verified database
    food_record = find_food_in_catalogue(identified_food_name)

    multiplier = max(0.1, float(portion_multiplier or 1.0))

    # Standard portion options
    portion_options = [
        PortionOption(label="Small Portion (50g)", multiplier=0.5, weight_g=50.0),
        PortionOption(label="Standard Serving (100g)", multiplier=1.0, weight_g=100.0),
        PortionOption(label="Medium Serving (150g)", multiplier=1.5, weight_g=150.0),
        PortionOption(label="Large Portion (200g)", multiplier=2.0, weight_g=200.0)
    ]

    # Health assessment
    health_assessment = generate_health_report(food_record, multiplier)

    # High protein alternatives and recipe recommendations
    alternatives = get_high_protein_alternatives(food_record)
    recipes = get_recommended_recipes_for_food(food_record)

    # Log to scan history
    scan_log = ScanHistory(
        user_id=current_user.id,
        identified_food=food_record["name"],
        confidence=confidence,
        portion_weight_g=food_record["serving_weight_g"] * multiplier,
        calories=round(food_record["calories"] * multiplier, 1),
        protein=round(food_record["protein"] * multiplier, 1),
        carbs=round(food_record["carbs"] * multiplier, 1),
        fats=round(food_record["fats"] * multiplier, 1),
        fiber=round(food_record["fiber"] * multiplier, 1),
        uncertainty_note="Visual estimation based on reference serving. Adjust portion slider for exact precision."
    )
    db.add(scan_log)
    db.commit()

    cals_per_100g = round((food_record["calories"] / max(food_record["serving_weight_g"], 1.0)) * 100.0, 1)

    return ScannerResult(
        identified_food=food_record["name"],
        confidence=round(confidence, 2),
        serving_size=f"{multiplier * food_record['serving_weight_g']:.0f}g ({food_record['weight_status']})",
        serving_weight_g=food_record["serving_weight_g"] * multiplier,
        calories=round(food_record["calories"] * multiplier, 1),
        calories_per_100g=cals_per_100g,
        protein=round(food_record["protein"] * multiplier, 1),
        carbs=round(food_record["carbs"] * multiplier, 1),
        fats=round(food_record["fats"] * multiplier, 1),
        fiber=round(food_record["fiber"] * multiplier, 1),
        sugar=round(food_record["sugar"] * multiplier, 1),
        added_sugar=round(food_record["added_sugar"] * multiplier, 1),
        good_fats_mufa=round(food_record["mufa"] * multiplier, 2),
        good_fats_pufa=round(food_record["pufa"] * multiplier, 2),
        omega3=round(food_record["omega3"] * multiplier, 2),
        omega6=round(food_record["omega6"] * multiplier, 2),
        saturated_fat=round(food_record["saturated_fat"] * multiplier, 2),
        trans_fat=round(food_record["trans_fat"] * multiplier, 2),
        cholesterol_mg=round(food_record["cholesterol_mg"] * multiplier, 1),
        sodium_mg=round(food_record["sodium_mg"] * multiplier, 0),
        potassium_mg=round(food_record["potassium_mg"] * multiplier, 0),
        calcium_mg=round(food_record["calcium_mg"] * multiplier, 0),
        iron_mg=round(food_record["iron_mg"] * multiplier, 1),
        vitamin_a_mcg=round(food_record["vitamin_a_mcg"] * multiplier, 0),
        vitamin_c_mg=round(food_record["vitamin_c_mg"] * multiplier, 1),
        vitamin_d_iu=round(food_record["vitamin_d_iu"] * multiplier, 0),
        vitamin_b12_mcg=round(food_record["vitamin_b12_mcg"] * multiplier, 1),
        magnesium_mg=round(food_record["magnesium_mg"] * multiplier, 0),
        health_assessment=health_assessment,
        portion_options=portion_options,
        uncertainty_note="Computer vision identifies visible foods; exact oil and sodium vary by recipe preparation. Values are estimates.",
        data_source=food_record["nutrition_source"],
        high_protein_alternatives=alternatives,
        recommended_recipes=recipes
    )

@router.post("/scan-text", response_model=ScannerResult)
def scan_food_by_text(
    food_name: str = Form(...),
    portion_multiplier: Optional[float] = Form(1.0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search or correct food name manually."""
    food_record = find_food_in_catalogue(food_name)
    multiplier = max(0.1, float(portion_multiplier or 1.0))

    portion_options = [
        PortionOption(label="Small Portion (50g)", multiplier=0.5, weight_g=50.0),
        PortionOption(label="Standard Serving (100g)", multiplier=1.0, weight_g=100.0),
        PortionOption(label="Medium Serving (150g)", multiplier=1.5, weight_g=150.0),
        PortionOption(label="Large Portion (200g)", multiplier=2.0, weight_g=200.0)
    ]

    health_assessment = generate_health_report(food_record, multiplier)
    alternatives = get_high_protein_alternatives(food_record)
    recipes = get_recommended_recipes_for_food(food_record)
    cals_per_100g = round((food_record["calories"] / max(food_record["serving_weight_g"], 1.0)) * 100.0, 1)

    return ScannerResult(
        identified_food=food_record["name"],
        confidence=0.99,
        serving_size=f"{multiplier * food_record['serving_weight_g']:.0f}g ({food_record['weight_status']})",
        serving_weight_g=food_record["serving_weight_g"] * multiplier,
        calories=round(food_record["calories"] * multiplier, 1),
        calories_per_100g=cals_per_100g,
        protein=round(food_record["protein"] * multiplier, 1),
        carbs=round(food_record["carbs"] * multiplier, 1),
        fats=round(food_record["fats"] * multiplier, 1),
        fiber=round(food_record["fiber"] * multiplier, 1),
        sugar=round(food_record["sugar"] * multiplier, 1),
        added_sugar=round(food_record["added_sugar"] * multiplier, 1),
        good_fats_mufa=round(food_record["mufa"] * multiplier, 2),
        good_fats_pufa=round(food_record["pufa"] * multiplier, 2),
        omega3=round(food_record["omega3"] * multiplier, 2),
        omega6=round(food_record["omega6"] * multiplier, 2),
        saturated_fat=round(food_record["saturated_fat"] * multiplier, 2),
        trans_fat=round(food_record["trans_fat"] * multiplier, 2),
        cholesterol_mg=round(food_record["cholesterol_mg"] * multiplier, 1),
        sodium_mg=round(food_record["sodium_mg"] * multiplier, 0),
        potassium_mg=round(food_record["potassium_mg"] * multiplier, 0),
        calcium_mg=round(food_record["calcium_mg"] * multiplier, 0),
        iron_mg=round(food_record["iron_mg"] * multiplier, 1),
        vitamin_a_mcg=round(food_record["vitamin_a_mcg"] * multiplier, 0),
        vitamin_c_mg=round(food_record["vitamin_c_mg"] * multiplier, 1),
        vitamin_d_iu=round(food_record["vitamin_d_iu"] * multiplier, 0),
        vitamin_b12_mcg=round(food_record["vitamin_b12_mcg"] * multiplier, 1),
        magnesium_mg=round(food_record["magnesium_mg"] * multiplier, 0),
        health_assessment=health_assessment,
        portion_options=portion_options,
        uncertainty_note="Direct database lookup with verified nutritional reference.",
        data_source=food_record["nutrition_source"],
        high_protein_alternatives=alternatives,
        recommended_recipes=recipes
    )

@router.get("/history")
def get_scan_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve previous food scans."""
    logs = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id).order_by(ScanHistory.scanned_at.desc()).limit(15).all()
    return logs

