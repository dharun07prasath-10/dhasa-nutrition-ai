import json
from ..seed_data import SEED_FOODS
from ..schemas import RecommendationRequest, RecommendationResponse, RecommendedMealItem

TAMIL_CUISINE_HIGHLIGHTS = [
    "Kollu (Horse Gram) Sundal & Rasam: Ancient Tamil metabolic superfood with 14g fiber and 143mg calcium per 50g.",
    "Muttai Dosa (Egg Dosa): Traditional high-protein street food delivering complete animal protein with zero processed powders.",
    "Soya Chunks Poriyal: Chettinad-spiced plant protein powerhouse giving 25.5g protein for just ₹11.",
    "Kadalai Curry with Steamed Rice or Puttu: Deep roasted coconut and black chickpea stew with sustained complex carbs.",
    "Neer Mor (Spiced Buttermilk): Refreshing digestive cooler with hing, curry leaves, and ginger for gut microbiome."
]

BUDGET_FRIENDLY_TIPS = [
    "Prioritize Soya Chunks (TVP): At ₹2.31 per 10g protein, it is 6x cheaper than whey protein powder.",
    "Use Whole Eggs instead of Egg Whites: You get double the calories, healthy fats, choline, and all micronutrients at the same unit cost.",
    "Kala Chana (Brown Chickpeas) is 30% cheaper than white Kabuli chickpeas while packing higher dietary fiber and iron.",
    "Grind Roasted Gram (Pottukadalai) at home into Sattu rather than buying processed commercial meal replacements.",
    "Buy regional staples like Horse Gram (Kollu) and Ragi in bulk loose kg sacks rather than branded cartons."
]

def generate_ai_recommendations(req: RecommendationRequest) -> RecommendationResponse:
    """Generate intelligent personalized recipe recommendations matching user budget and dietary goals."""
    recipes = [f for f in SEED_FOODS if f.get("is_recipe")]
    matched_meals = []

    pref = req.dietary_preference.lower()
    user_allergies = [a.lower().strip() for a in req.allergies if a]
    available_ingrs = [ing.lower().strip() for ing in req.available_ingredients if ing]
    cuisine_pref = req.preferred_cuisine.lower()
    max_time = req.available_cooking_time or 60

    # Parse target protein range
    min_prot = 10.0
    if "20g" in req.preferred_protein_range or "25g" in req.preferred_protein_range or "30g" in req.preferred_protein_range:
        min_prot = 15.0

    for r in recipes:
        # Check dietary preference filter
        diet = r.get("dietary_type", "").lower()
        if pref == "vegan" and diet != "vegan":
            continue
        elif pref == "vegetarian" and diet in ["non-vegetarian", "egg-based"]:
            continue
        elif pref == "egg-based" and diet == "non-vegetarian":
            continue

        # Check allergies
        r_name = r["name"].lower()
        has_allergy = False
        for alg in user_allergies:
            if "soy" in alg and ("soya" in r_name or "tofu" in r_name):
                has_allergy = True
            elif "dairy" in alg and ("paneer" in r_name or "curd" in r_name or "milk" in r_name):
                has_allergy = True
            elif "egg" in alg and "egg" in r_name:
                has_allergy = True
            elif "peanut" in alg and "peanut" in r_name:
                has_allergy = True
            elif "fish" in alg and ("fish" in r_name or "nethili" in r_name or "sardine" in r_name or "mackerel" in r_name):
                has_allergy = True
        if has_allergy:
            continue

        # Check cooking time
        total_time = r.get("prep_time_minutes", 10) + r.get("cooking_time_minutes", 15)
        if total_time > max_time + 10:
            continue

        # Calculate relevance score
        score = 0.0
        reason_parts = []

        if cuisine_pref in r.get("cuisine", "").lower() or "tamil" in r.get("cuisine", "").lower():
            score += 3.0
            reason_parts.append(f"Authentic {r.get('cuisine')} preparation")

        if r.get("protein", 0) >= min_prot:
            score += 2.5
            reason_parts.append(f"Provides high protein ({r.get('protein')}g per serving)")

        if r.get("cost_per_serving_inr", 0) <= 25.0:
            score += 2.0
            reason_parts.append(f"Highly budget friendly (₹{r.get('cost_per_serving_inr'):.0f} per meal)")

        # Check available ingredients overlap
        for ing in available_ingrs:
            if ing in r_name or ing in r.get("main_ingredients", "").lower():
                score += 3.0
                reason_parts.append(f"Uses your available ingredient '{ing}'")

        try:
            substitutions = json.loads(r.get("budget_substitutions", "[]"))
        except Exception:
            substitutions = ["Can be adjusted with local seasonal vegetables."]

        try:
            ingredients_list = json.loads(r.get("main_ingredients", "[]"))
        except Exception:
            ingredients_list = []

        match_reason = "; ".join(reason_parts) if reason_parts else "Fits your selected dietary preference and protein target."

        matched_meals.append({
            "meal": RecommendedMealItem(
                id=r.get("id"),
                name=r.get("name"),
                category=r.get("category"),
                dietary_type=r.get("dietary_type"),
                calories=r.get("calories"),
                protein=r.get("protein"),
                carbs=r.get("carbs"),
                fats=r.get("fats"),
                fiber=r.get("fiber"),
                cost_inr=r.get("cost_per_serving_inr"),
                prep_time=total_time,
                match_reason=match_reason,
                budget_substitutions=substitutions if isinstance(substitutions, list) else [str(substitutions)],
                ingredients=ingredients_list if isinstance(ingredients_list, list) else [str(ingredients_list)]
            ),
            "score": score
        })

    # Sort by score descending
    matched_meals.sort(key=lambda x: x["score"], reverse=True)
    selected_meals = [m["meal"] for m in matched_meals[:6]]

    # If fewer than 4 matched, pad with highest protein recipes that match dietary type
    if len(selected_meals) < 4:
        for r in sorted(recipes, key=lambda x: x.get("protein", 0), reverse=True):
            diet = r.get("dietary_type", "").lower()
            if pref == "vegan" and diet != "vegan":
                continue
            if pref == "vegetarian" and diet in ["non-vegetarian", "egg-based"]:
                continue
            if not any(sm.name == r["name"] for sm in selected_meals):
                total_time = r.get("prep_time_minutes", 10) + r.get("cooking_time_minutes", 15)
                try:
                    subs = json.loads(r.get("budget_substitutions", "[]"))
                except Exception:
                    subs = []
                try:
                    ings = json.loads(r.get("main_ingredients", "[]"))
                except Exception:
                    ings = []
                selected_meals.append(RecommendedMealItem(
                    id=r.get("id"),
                    name=r.get("name"),
                    category=r.get("category"),
                    dietary_type=r.get("dietary_type"),
                    calories=r.get("calories"),
                    protein=r.get("protein"),
                    carbs=r.get("carbs"),
                    fats=r.get("fats"),
                    fiber=r.get("fiber"),
                    cost_inr=r.get("cost_per_serving_inr"),
                    prep_time=total_time,
                    match_reason=f"Top protein-dense budget meal ({r.get('protein')}g protein).",
                    budget_substitutions=subs if isinstance(subs, list) else [str(subs)],
                    ingredients=ings if isinstance(ings, list) else [str(ings)]
                ))
            if len(selected_meals) >= 5:
                break

    total_cost = sum(m.cost_inr for m in selected_meals[:3])  # 3-meal estimate
    total_protein = sum(m.protein for m in selected_meals[:3])
    utilization_pct = min(100.0, (total_cost / max(req.daily_budget_inr, 1.0)) * 100.0)

    return RecommendationResponse(
        recommended_meals=selected_meals,
        daily_budget_utilization=round(utilization_pct, 1),
        protein_total_est=round(total_protein, 1),
        budget_friendly_tips=BUDGET_FRIENDLY_TIPS,
        tamil_cuisine_highlights=TAMIL_CUISINE_HIGHLIGHTS
    )

