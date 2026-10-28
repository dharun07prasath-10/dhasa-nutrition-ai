import random
import json
from ..seed_data import SEED_FOODS
from ..schemas import MealPlanGenerateRequest, MealPlanResponse, DayPlan, MealSlot

def generate_7day_meal_plan(req: MealPlanGenerateRequest) -> MealPlanResponse:
    """Generate a cohesive 7-day budget meal plan that reuses pantry staples to eliminate food waste."""
    pref = req.dietary_preference.lower()
    
    # Categorize meals suitable for breakfast, lunch, dinner, snack
    recipes = [f for f in SEED_FOODS if f.get("is_recipe")]
    
    # Filter by diet
    valid_recipes = []
    for r in recipes:
        diet = r.get("dietary_type", "").lower()
        if pref == "vegan" and diet != "vegan":
            continue
        elif pref == "vegetarian" and diet in ["non-vegetarian", "egg-based"]:
            continue
        elif pref == "egg-based" and diet == "non-vegetarian":
            continue
        valid_recipes.append(r)
        
    if not valid_recipes:
        valid_recipes = recipes

    # Slots pools
    breakfast_pool = [
        r for r in valid_recipes if any(kw in r["name"].lower() for kw in ["dosa", "chilla", "oats", "paratha", "omelette", "malt", "vada", "bhurji"])
    ] or valid_recipes

    lunch_pool = [
        r for r in valid_recipes if any(kw in r["name"].lower() for kw in ["dal", "khichdi", "pulao", "curry", "rajma", "masoor", "rohu", "sardine", "mackerel"])
    ] or valid_recipes

    dinner_pool = [
        r for r in valid_recipes if any(kw in r["name"].lower() for kw in ["poriyal", "bhurji", "wrap", "sukka", "curry", "chana masala", "moilee", "steamed fish", "keema"])
    ] or valid_recipes

    snack_pool = [
        f for f in SEED_FOODS if not f.get("is_recipe") or any(kw in f["name"].lower() for kw in ["sundal", "chaat", "peanuts", "roasted", "seeds", "buttermilk", "sattu drink", "rasam", "yogurt"])
    ]
    if pref == "vegan":
        snack_pool = [s for s in snack_pool if s.get("dietary_type") == "vegan"]
    elif pref == "vegetarian":
        snack_pool = [s for s in snack_pool if s.get("dietary_type") in ["vegetarian", "vegan"]]

    days_names = [
        "Day 1 (Monday)",
        "Day 2 (Tuesday)",
        "Day 3 (Wednesday)",
        "Day 4 (Thursday)",
        "Day 5 (Friday)",
        "Day 6 (Saturday)",
        "Day 7 (Sunday)"
    ]

    days_plan = []
    weekly_cost = 0.0
    total_protein = 0.0
    total_calories = 0.0

    def to_slot(item: dict) -> MealSlot:
        try:
            ings = json.loads(item.get("main_ingredients", "[]"))
        except Exception:
            ings = [item.get("name", "")]
        return MealSlot(
            name=item.get("name", "Meal"),
            category=item.get("category", "General"),
            protein=float(item.get("protein", 0)),
            calories=float(item.get("calories", 0)),
            carbs=float(item.get("carbs", 0)),
            fats=float(item.get("fats", 0)),
            fiber=float(item.get("fiber", 0)),
            cost_inr=float(item.get("cost_per_serving_inr", 15.0)),
            ingredients=ings if isinstance(ings, list) else [str(ings)]
        )

    for i, day_name in enumerate(days_names):
        b_item = breakfast_pool[i % len(breakfast_pool)]
        l_item = lunch_pool[i % len(lunch_pool)]
        s_item = snack_pool[i % len(snack_pool)]
        d_item = dinner_pool[(i + 1) % len(dinner_pool)]

        b_slot = to_slot(b_item)
        l_slot = to_slot(l_item)
        s_slot = to_slot(s_item)
        d_slot = to_slot(d_item)

        day_cost = b_slot.cost_inr + l_slot.cost_inr + s_slot.cost_inr + d_slot.cost_inr
        day_prot = b_slot.protein + l_slot.protein + s_slot.protein + d_slot.protein
        day_cals = b_slot.calories + l_slot.calories + s_slot.calories + d_slot.calories

        weekly_cost += day_cost
        total_protein += day_prot
        total_calories += day_cals

        days_plan.append(DayPlan(
            day=day_name,
            breakfast=b_slot,
            lunch=l_slot,
            evening_snack=s_slot,
            dinner=d_slot,
            total_cost=round(day_cost, 1),
            total_protein=round(day_prot, 1),
            total_calories=round(day_cals, 1)
        ))

    # Consolidated grocery list reusing core staples
    grocery_items = [
        {"item": "Soya Chunks (Pack)", "quantity": "500g", "estimated_cost": 60.0, "category": "Pantry Staples"},
        {"item": "Toor Dal & Moong Dal", "quantity": "1 kg (combined)", "estimated_cost": 150.0, "category": "Pulses & Legumes"},
        {"item": "Kala Chana & Horse Gram (Kollu)", "quantity": "750g", "estimated_cost": 75.0, "category": "Pulses & Legumes"},
        {"item": "Eggs (Tray)", "quantity": "1 dozen (12 eggs)", "estimated_cost": 78.0, "category": "Poultry & Dairy"},
        {"item": "Low-Fat Paneer / Curd", "quantity": "500g curd + 200g paneer", "estimated_cost": 95.0, "category": "Dairy"},
        {"item": "Whole Wheat Chakki Atta & Rice", "quantity": "2 kg", "estimated_cost": 90.0, "category": "Grains & Flours"},
        {"item": "Roasted Gram (Pottukadalai) & Peanuts", "quantity": "500g", "estimated_cost": 70.0, "category": "Nuts & Seeds"},
        {"item": "Onions, Tomatoes, Green Chillies & Coriander", "quantity": "Assorted fresh", "estimated_cost": 85.0, "category": "Fresh Produce"},
        {"item": "Mustard, Cumin, Turmeric, Black Pepper, Curry Leaves", "quantity": "Basic spice kit", "estimated_cost": 40.0, "category": "Spices"}
    ]

    ingredient_notes = [
        "Shared Pulse Base: Soaked Moong Dal is used for Morning Chillas and Weekend Khichdi, eliminating waste.",
        "Egg Versatility: Used for quick morning omelettes, dinner bhurji, or hard boiled snacks.",
        "Horse Gram (Kollu) Dual-Use: The cooked gram is enjoyed as Sundal while the residual cooking water forms Kollu Rasam.",
        "Zero-Waste Soya Chunks: Prepared once, half used for South Indian Poriyal and half for vegetable pulao."
    ]

    return MealPlanResponse(
        title=f"7-Day Budget High-Protein Plan ({req.dietary_preference.title()})",
        days=days_plan,
        estimated_weekly_cost=round(weekly_cost, 1),
        average_daily_protein=round(total_protein / 7.0, 1),
        average_daily_calories=round(total_calories / 7.0, 1),
        grocery_list=grocery_items,
        ingredient_reuse_notes=ingredient_notes
    )

