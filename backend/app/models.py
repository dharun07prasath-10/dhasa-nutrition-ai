import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), default="Fitness Enthusiast")
    
    # Nutrition & Budget Targets
    daily_calorie_target = Column(Float, default=2200.0)
    daily_protein_target = Column(Float, default=110.0)
    daily_carb_target = Column(Float, default=250.0)
    daily_fat_target = Column(Float, default=60.0)
    daily_fiber_target = Column(Float, default=32.0)
    daily_budget_inr = Column(Float, default=180.0)
    
    # Preferences
    dietary_preference = Column(String(50), default="all")  # vegetarian, vegan, egg-based, non-vegetarian, all
    preferred_cuisine = Column(String(100), default="South Indian & Tamil")
    allergies = Column(String(255), default="")
    cooking_equipment = Column(String(255), default="Stove, Pan, Pressure Cooker")
    available_cooking_time = Column(Integer, default=30)  # minutes
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    saved_recipes = relationship("SavedRecipe", back_populates="user", cascade="all, delete-orphan")
    meal_plans = relationship("MealPlan", back_populates="user", cascade="all, delete-orphan")
    shopping_items = relationship("ShoppingListItem", back_populates="user", cascade="all, delete-orphan")
    daily_logs = relationship("DailyLogItem", back_populates="user", cascade="all, delete-orphan")
    scan_history = relationship("ScanHistory", back_populates="user", cascade="all, delete-orphan")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True, nullable=False)
    # Category 1 to 5:
    # 1: Pulses and legumes
    # 2: Soya and dairy
    # 3: Eggs, poultry, and seafood
    # 4: Grains, seeds, and nuts
    # 5: Healthy, budget-friendly meal ideas
    category = Column(String(100), index=True, nullable=False)
    is_recipe = Column(Boolean, default=False)
    
    # Weight and serving
    serving_size = Column(String(100), nullable=False)  # e.g., "100g (cooked)", "40g (dry)"
    serving_weight_g = Column(Float, default=100.0)
    weight_status = Column(String(50), default="cooked")  # dry, raw, cooked
    dietary_type = Column(String(50), default="vegetarian")  # vegetarian, vegan, egg-based, non-vegetarian

    # Energy & Macronutrients (per serving)
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)  # grams
    carbs = Column(Float, default=0.0)    # grams
    fats = Column(Float, default=0.0)     # grams
    fiber = Column(Float, default=0.0)    # grams
    sugar = Column(Float, default=0.0)    # grams
    added_sugar = Column(Float, default=0.0)

    # Fats breakdown (grams)
    mufa = Column(Float, default=0.0)     # monounsaturated (good fat)
    pufa = Column(Float, default=0.0)     # polyunsaturated (good fat)
    omega3 = Column(Float, default=0.0)   # omega-3
    omega6 = Column(Float, default=0.0)   # omega-6
    saturated_fat = Column(Float, default=0.0)
    trans_fat = Column(Float, default=0.0)

    # Micronutrients per serving
    cholesterol_mg = Column(Float, default=0.0)
    sodium_mg = Column(Float, default=0.0)
    potassium_mg = Column(Float, default=0.0)
    calcium_mg = Column(Float, default=0.0)
    iron_mg = Column(Float, default=0.0)
    vitamin_a_mcg = Column(Float, default=0.0)
    vitamin_c_mg = Column(Float, default=0.0)
    vitamin_d_iu = Column(Float, default=0.0)
    vitamin_b12_mcg = Column(Float, default=0.0)
    magnesium_mg = Column(Float, default=0.0)

    # Cost metrics in INR (₹)
    cost_per_serving_inr = Column(Float, default=0.0)
    cost_per_100g_inr = Column(Float, default=0.0)
    cost_per_10g_protein_inr = Column(Float, default=0.0)  # Key budget comparison metric!

    # Recipe specific fields
    prep_time_minutes = Column(Integer, default=10)
    cooking_time_minutes = Column(Integer, default=15)
    difficulty = Column(String(50), default="Easy")  # Easy, Medium, Hard
    cuisine = Column(String(100), default="South Indian")
    
    # JSON encoded strings
    main_ingredients = Column(Text, default="[]")       # List of ingredients with qty
    recipe_instructions = Column(Text, default="[]")    # Step by step directions
    budget_substitutions = Column(Text, default="[]")   # Cheap alternatives
    cooking_tips = Column(Text, default="")
    
    # Provenance and verified data sources
    nutrition_source = Column(String(150), default="ICMR-NIN Indian Food Composition Tables (IFCT 2017)")
    confidence_score = Column(Float, default=0.95)
    image_url = Column(String(255), default="")

    saved_by = relationship("SavedRecipe", back_populates="food_item", cascade="all, delete-orphan")


class SavedRecipe(Base):
    __tablename__ = "saved_recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_item_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    notes = Column(Text, default="")
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_recipes")
    food_item = relationship("FoodItem", back_populates="saved_by")


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(150), default="Personalized Budget 7-Day Plan")
    target_calories = Column(Float, default=2000.0)
    target_protein = Column(Float, default=100.0)
    daily_budget_inr = Column(Float, default=180.0)
    plan_json = Column(Text, nullable=False)  # Full 7-day schedule with grocery items
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="meal_plans")


class ShoppingListItem(Base):
    __tablename__ = "shopping_list_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_name = Column(String(150), nullable=False)
    quantity = Column(String(100), default="100g")
    estimated_cost_inr = Column(Float, default=0.0)
    category = Column(String(100), default="General")
    is_checked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="shopping_items")


class DailyLogItem(Base):
    __tablename__ = "daily_log_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    log_date = Column(String(20), index=True, nullable=False)  # YYYY-MM-DD
    meal_type = Column(String(50), nullable=False)  # Breakfast, Lunch, Evening Snacks, Dinner
    food_name = Column(String(150), nullable=False)
    serving_amount = Column(Float, default=1.0)
    serving_unit = Column(String(50), default="serving")
    
    # Consumed values
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fats = Column(Float, default=0.0)
    fiber = Column(Float, default=0.0)
    sugar = Column(Float, default=0.0)
    sodium_mg = Column(Float, default=0.0)
    saturated_fat = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="daily_logs")


class DailyWaterLog(Base):
    __tablename__ = "daily_water_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    log_date = Column(String(20), index=True, nullable=False)  # YYYY-MM-DD
    glasses = Column(Integer, default=0)
    ml = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    identified_food = Column(String(150), nullable=False)
    confidence = Column(Float, default=0.90)
    portion_weight_g = Column(Float, default=100.0)
    
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fats = Column(Float, default=0.0)
    fiber = Column(Float, default=0.0)
    
    uncertainty_note = Column(Text, default="Estimated from standard portion reference.")
    scanned_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="scan_history")

