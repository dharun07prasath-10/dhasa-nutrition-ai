from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth & User
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = "Fitness Enthusiast"
    daily_calorie_target: Optional[float] = 2200.0
    daily_protein_target: Optional[float] = 110.0
    daily_budget_inr: Optional[float] = 180.0
    dietary_preference: Optional[str] = "all"
    preferred_cuisine: Optional[str] = "South Indian & Tamil"

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    daily_calorie_target: Optional[float] = None
    daily_protein_target: Optional[float] = None
    daily_carb_target: Optional[float] = None
    daily_fat_target: Optional[float] = None
    daily_fiber_target: Optional[float] = None
    daily_budget_inr: Optional[float] = None
    dietary_preference: Optional[str] = None
    preferred_cuisine: Optional[str] = None
    allergies: Optional[str] = None
    cooking_equipment: Optional[str] = None
    available_cooking_time: Optional[int] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    daily_calorie_target: float
    daily_protein_target: float
    daily_carb_target: float
    daily_fat_target: float
    daily_fiber_target: float
    daily_budget_inr: float
    dietary_preference: str
    preferred_cuisine: str
    allergies: str
    cooking_equipment: str
    available_cooking_time: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Food & Recipe
class FoodItemOut(BaseModel):
    id: int
    name: str
    category: str
    is_recipe: bool
    serving_size: str
    serving_weight_g: float
    weight_status: str
    dietary_type: str
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: float
    sugar: float
    added_sugar: float
    mufa: float
    pufa: float
    omega3: float
    omega6: float
    saturated_fat: float
    trans_fat: float
    cholesterol_mg: float
    sodium_mg: float
    potassium_mg: float
    calcium_mg: float
    iron_mg: float
    vitamin_a_mcg: float
    vitamin_c_mg: float
    vitamin_d_iu: float
    vitamin_b12_mcg: float
    magnesium_mg: float
    cost_per_serving_inr: float
    cost_per_100g_inr: float
    cost_per_10g_protein_inr: float
    prep_time_minutes: int
    cooking_time_minutes: int
    difficulty: str
    cuisine: str
    main_ingredients: str
    recipe_instructions: str
    budget_substitutions: str
    cooking_tips: str
    nutrition_source: str
    confidence_score: float
    image_url: str

    class Config:
        from_attributes = True

class PriceAdjustmentRequest(BaseModel):
    food_id: int
    new_cost_per_serving_inr: float

class ServingRecalcRequest(BaseModel):
    recipe_id: int
    servings: float = 1.0

# AI Recommendations
class RecommendationRequest(BaseModel):
    dietary_preference: str = "all"  # vegetarian, vegan, egg-based, non-vegetarian, all
    daily_budget_inr: float = 180.0
    available_ingredients: Optional[List[str]] = []
    preferred_cuisine: Optional[str] = "South Indian & Tamil"
    available_cooking_time: Optional[int] = 30
    allergies: Optional[List[str]] = []
    preferred_protein_range: Optional[str] = "20g - 35g"
    cooking_equipment: Optional[List[str]] = ["Pan", "Pressure Cooker"]

class RecommendedMealItem(BaseModel):
    id: Optional[int] = None
    name: str
    category: str
    dietary_type: str
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: float
    cost_inr: float
    prep_time: int
    match_reason: str
    budget_substitutions: List[str]
    ingredients: List[str]

class RecommendationResponse(BaseModel):
    recommended_meals: List[RecommendedMealItem]
    daily_budget_utilization: float
    protein_total_est: float
    budget_friendly_tips: List[str]
    tamil_cuisine_highlights: List[str]

# Meal Planner
class MealPlanGenerateRequest(BaseModel):
    daily_budget_inr: float = 180.0
    dietary_preference: str = "all"
    preferred_cuisine: str = "South Indian & Tamil"
    target_protein: float = 100.0
    target_calories: float = 2100.0
    allergies: Optional[List[str]] = []

class MealSlot(BaseModel):
    name: str
    category: str
    protein: float
    calories: float
    carbs: float
    fats: float
    fiber: float
    cost_inr: float
    ingredients: List[str]

class DayPlan(BaseModel):
    day: str  # "Day 1 (Monday)", etc.
    breakfast: MealSlot
    lunch: MealSlot
    evening_snack: MealSlot
    dinner: MealSlot
    total_cost: float
    total_protein: float
    total_calories: float

class MealPlanResponse(BaseModel):
    title: str
    days: List[DayPlan]
    estimated_weekly_cost: float
    average_daily_protein: float
    average_daily_calories: float
    grocery_list: List[Dict[str, Any]]
    ingredient_reuse_notes: List[str]

# Shopping List
class ShoppingListItemCreate(BaseModel):
    item_name: str
    quantity: str = "100g"
    estimated_cost_inr: float = 25.0
    category: str = "Pantry"

class ShoppingListItemOut(BaseModel):
    id: int
    item_name: str
    quantity: str
    estimated_cost_inr: float
    category: str
    is_checked: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Saved Recipes
class SavedRecipeOut(BaseModel):
    id: int
    notes: str
    saved_at: datetime
    recipe: FoodItemOut

    class Config:
        from_attributes = True

# Daily Tracker
class DailyLogItemCreate(BaseModel):
    log_date: str
    meal_type: str
    food_name: str
    serving_amount: float = 1.0
    serving_unit: str = "serving"
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: float
    sugar: Optional[float] = 0.0
    sodium_mg: Optional[float] = 0.0
    saturated_fat: Optional[float] = 0.0

class DailyLogItemOut(BaseModel):
    id: int
    log_date: str
    meal_type: str
    food_name: str
    serving_amount: float
    serving_unit: str
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: float
    sugar: float
    sodium_mg: float
    saturated_fat: float
    created_at: datetime

    class Config:
        from_attributes = True

class DailySummary(BaseModel):
    date: str
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fats: float
    total_fiber: float
    total_sugar: float
    total_sodium: float
    total_saturated_fat: float
    water_glasses: int
    water_ml: int
    target_calories: float
    target_protein: float
    items: List[DailyLogItemOut]

# Scanner
class PortionOption(BaseModel):
    label: str
    multiplier: float
    weight_g: float

class FoodHealthReport(BaseModel):
    status: str  # GREEN, YELLOW, RED
    nutrient_highlight: str
    explanation: str
    benefits: List[str]
    concerns: List[str]
    allergens: List[str]

class SimilarAlternative(BaseModel):
    name: str
    protein: float
    cost_per_serving: float
    saving_tip: str

class ScannerResult(BaseModel):
    identified_food: str
    confidence: float
    serving_size: str
    serving_weight_g: float
    calories: float
    calories_per_100g: float
    protein: float
    carbs: float
    fats: float
    fiber: float
    sugar: float
    added_sugar: float
    # Fats breakdown
    good_fats_mufa: float
    good_fats_pufa: float
    omega3: float
    omega6: float
    saturated_fat: float
    trans_fat: float
    # Micronutrients
    cholesterol_mg: float
    sodium_mg: float
    potassium_mg: float
    calcium_mg: float
    iron_mg: float
    vitamin_a_mcg: float
    vitamin_c_mg: float
    vitamin_d_iu: float
    vitamin_b12_mcg: float
    magnesium_mg: float
    # Assessment
    health_assessment: FoodHealthReport
    portion_options: List[PortionOption]
    uncertainty_note: str
    data_source: str
    # High-protein upgrade features:
    high_protein_alternatives: List[SimilarAlternative]
    recommended_recipes: List[Dict[str, Any]]

