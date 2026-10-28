# AI Fitness — Food Nutrition Scanner & High-Protein Recommendation System

An intelligent, full-stack AI-powered fitness and nutrition analysis application featuring multimodal food recognition, comprehensive macronutrient/micronutrient tracking, detailed fat composition analysis (MUFA/PUFA/Omega-3, Saturated, Trans fat), a scientific Green/Yellow/Red food health report, and a complete **AI-Powered Budget-Friendly High-Protein Food & Recipe Recommendation System** tailored for Indian and Tamil regional cuisine.

---

## 🌟 Key Features

### 1. 📸 Multimodal AI Food Scanner
- **Camera & Gallery Scanner**: Capture food photos via webcam/mobile camera or upload images from your device.
- **Packaged Food Label Scanner**: Analyzes packaged food labels and extracts nutritional facts.
- **Hugging Face Vision AI**: Powered by Hugging Face vision inference (`google/vit-base-patch16-224` / multimodal model).
- **Portion Size Slider & Presets**: Select from 50g, 100g, 150g, 200g, or fine-grained custom multipliers with immediate macro recalculation.
- **Nutritional Uncertainty Disclosure**: Distinguishes visual camera estimates from verified laboratory composition data.
- **High-Protein Alternatives**: Automatically suggests 3 similar, more affordable high-protein swaps with explicit ₹ savings tips.
- **Recipe Recommendations**: Immediately recommends practical recipes you can cook using the detected food ingredient.
- **Log directly to Tracker**: Add scanned foods to Breakfast, Lunch, Evening Snacks, or Dinner with 1 click.

### 2. 🍗 Protein & Recipe Explorer (Exactly 100 Distinct Foods & Meals)
A searchable database of **exactly 100 distinct budget-friendly foods and dishes** verified against the **ICMR-NIN Indian Food Composition Tables (IFCT 2017)** and USDA FoodData Central, evenly grouped into 5 categories (20 entries each):
1. **Pulses and Legumes (Items 1–20)**: Toor dal, moong dal, masoor dal, chana dal, urad dal, kala chana, kabuli chana, rajma, lobia, green gram, horse gram (kollu), whole soybeans, and homestyle cooked dals and rasams.
2. **Soya and Dairy (Items 21–40)**: Soya chunks (TVP), boiled squeezed soya, soya granules, cooked soya keema, firm tofu, seared tofu, unsweetened soy milk, cow milk, skimmed milk, low-fat paneer, whole milk paneer, curd/dahi, Greek yogurt (hung curd), neer mor (spiced buttermilk), paneer tikka, soya sukka, etc.
3. **Eggs, Poultry, and Seafood (Items 41–60)**: Whole chicken eggs, egg whites, raw and grilled chicken breast, chicken thighs, boiled shredded chicken, nutrient-dense chicken liver, pan-cooked pepper liver, chicken keema bhurji, fresh sardines (mathi), pan-fried sardines, mackerel (ayala), tawa seared mackerel with curry leaves, fresh anchovies (nethili), crispy tawa nethili, rohu freshwater carp, steamed fish in banana leaf, egg curry, and masala omelettes.
4. **Grains, Seeds, and Nuts (Items 61–80)**: Raw and roasted peanuts, roasted bengal gram (bhuna chana / pottukadalai), sattu flour, sattu savory protein cooler, rolled oats, broken wheat (dalia), ragi (finger millet flour), bajra (pearl millet / kambu), jowar (sorghum), chakki whole wheat atta, raw & roasted pumpkin seeds, flaxseeds, ground flaxseed powder, white & black sesame seeds (ellu), natural peanut butter, and watermelon seeds (magaz).
5. **Healthy, Budget-Friendly Meal Ideas (Items 81–100)**: Moong dal chilla with mint chutney, kollu sundal (tempered horse gram), soya chunks poriyal (Chettinad style dry fry), kadalai curry (black chickpea coconut gravy), muttai dosa (high-protein egg dosa), paneer bhurji with 2 phulkas, 2:1 moong dal khichdi, soya granules veggie pulao, egg bhurji toast, chana masala, savory masala oats with tofu/egg, green gram protein soup, bihari sattu paratha with curd, chicken keema wrap, ragi malt with peanut-flax powder, Andhra pesarattu, air-fried medu vada, masoor dal rice combo, fish moilee, and sprouts & paneer chaat.

- **Local Price Customization**: Every entry includes an "Adjust Price" feature allowing users to input their neighborhood kirana/bazaar prices in ₹.
- **Dry vs Cooked Weight Clarification**: Every entry strictly specifies whether the weight and nutrition refer to dry raw beans, rehydrated chunks, or finished plate weight.

### 3. 🤖 AI-Powered Personalised Recipe Recommendations
- Customized inputs:
  - Dietary preference (Vegetarian, Vegan, Egg-based, Non-vegetarian, Flexitarian)
  - Daily food budget in ₹ (e.g. ₹100–₹350/day)
  - Available kitchen ingredients
  - Preferred cuisine with deep South Indian & Tamil regional focus
  - Available cooking time & equipment
  - Food allergies & restrictions
  - Preferred protein range per meal (15g–35g+)
- Delivers practical Indian meals highlighting budget staples (Soya chunks poriyal, Kollu sundal, Muttai dosa, Kadalai curry, etc.).
- Explains **why each meal fits** and suggests **affordable substitutions for expensive ingredients**.

### 4. 🍲 Recipe Detail View & Dynamic Serving Quantity Scaler
- Full ingredient list with measured quantities.
- Step-by-step cooking instructions, difficulty rating, and prep/cook times.
- Interactive **Servings Adjuster** (+ / -): Dynamically recalculates all ingredient weights and nutritional estimates in real time!
- "Save to Favourites" and "Add Ingredients to Shopping List" buttons.
- Chef cooking tips and budget substitution advice.

### 5. 📅 Budget Meal Planner (7-Day Plan & Zero-Waste Strategy)
- Generates a balanced 7-day schedule with **Breakfast, Lunch, Evening Snacks, and Dinner**.
- Prioritizes affordable, locally available Indian foods.
- **Pantry Ingredient Reuse**: Reuses soaked pulses, eggs, and soya across meals to prevent grocery spoilage.
- Generates a **Consolidated Grocery Shopping List** with quantities and estimated ₹ costs.
- 1-click button to export the entire grocery plan to your Shopping List.

### 6. ⚖️ Protein and Cost Comparison Matrix
- Sort and compare foods by:
  - **₹ per 10g Protein** (The golden fitness metric!)
  - Protein per serving
  - Protein per 100g (clearly separating dry raw from cooked)
  - Cost per serving in ₹
  - Calories and fiber
- Identifies the top value champions (e.g., Soya chunks at ₹2.31/10g protein, Eggs at ₹10.32/10g protein).

### 7. 🥗 Scientific Fat Analysis & Health Assessment
- **Good Fats**: MUFA, PUFA, Omega-3, and Omega-6 breakdown.
- **Saturated Fat**: Shown separately with dietary moderation explanations (not blindly demonized).
- **Trans Fat**: Industrial trans fats clearly flagged.
- **Food Health Report**: Green, Yellow, and Red status with transparent explanations and allergen detection.

### 8. 📈 Daily Nutrition Tracker & Hydration Log
- Log meals by Breakfast, Lunch, Evening Snacks, Dinner.
- Interactive progress bars tracking consumed Calories and Protein against personalized targets.
- Water intake tracker with quick +1 glass logging.
- Delete and edit logged entries.
- Historical date switcher.

### 9. 💬 AI Fitness Nutrition Assistant
- Chatbot trained on Indian fitness nutrition, muscle building on a budget, South Indian culinary traditions, and fat biochemistry.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React Icons, Context API |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, Uvicorn, SQLAlchemy |
| **Database** | SQLite (with multi-threaded connection handling, easily swappable to PostgreSQL) |
| **AI / Vision** | Hugging Face Inference API (`google/vit-base-patch16-224`), Multimodal heuristics |
| **Data Sources** | ICMR-NIN Indian Food Composition Tables (IFCT 2017), USDA FoodData Central |

---

## 📁 Project Folder Structure

```
Food agent/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py                 # App settings & Hugging Face key
│   │   ├── database.py               # SQLAlchemy database session
│   │   ├── models.py                 # ORM models (FoodItem, User, MealPlan, etc.)
│   │   ├── schemas.py                # Pydantic schemas
│   │   ├── auth.py                   # Authentication & token verification
│   │   ├── seed_data.py              # Main seed catalogue (100 distinct items)
│   │   ├── seed_data_part1.py        # Pulses (1-20) & Soya/Dairy (21-40)
│   │   ├── seed_data_part2.py        # Poultry/Eggs/Fish (41-60) & Grains (61-70)
│   │   ├── seed_data_part3.py        # Grains/Nuts (71-80) & Meals/Recipes (81-100)
│   │   ├── main.py                   # FastAPI app entry point & router mounting
│   │   ├── routers/
│   │   │   ├── auth.py               # /api/auth
│   │   │   ├── foods.py              # /api/foods, price adjustment, serving recalc
│   │   │   ├── recipes.py            # /api/recipes, favourites
│   │   │   ├── scanner.py            # /api/scanner (Hugging Face vision + analysis)
│   │   │   ├── recommendations.py    # /api/recommendations
│   │   │   ├── meal_planner.py       # /api/meal-plans
│   │   │   ├── shopping_list.py      # /api/shopping-lists
│   │   │   ├── tracker.py            # /api/tracker
│   │   │   └── assistant.py          # /api/assistant chat
│   │   └── services/
│   │       ├── hf_vision.py          # Hugging Face Vision API client & health report
│   │       ├── recommendation_engine.py # AI personalized meal matching
│   │       └── meal_planner_service.py  # 7-day zero-waste planner & grocery list
│   ├── requirements.txt
│   └── .env                          # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive navigation & theme switch
│   │   │   ├── Sidebar.jsx           # Main navigation drawer
│   │   │   ├── NutritionCards.jsx    # Energy, macros, good fats, sat/trans fat, minerals
│   │   │   └── HealthReportBadge.jsx # Green / Yellow / Red scientific assessment
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User authentication state
│   │   │   └── ThemeContext.jsx      # Dark & Light mode toggle
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Overview dashboard & progress targets
│   │   │   ├── FoodScanner.jsx       # Camera scanner & nutrition vision
│   │   │   ├── ProteinExplorer.jsx   # 100 verified foods catalogue & price editor
│   │   │   ├── RecipeDetail.jsx      # Recipe view, dynamic serving scaler, shopping export
│   │   │   ├── Recommendations.jsx   # AI personalized Indian meal generator
│   │   │   ├── MealPlanner.jsx       # 7-Day budget meal planner & grocery list
│   │   │   ├── CostComparison.jsx    # Cost per 10g protein comparison matrix
│   │   │   ├── ShoppingList.jsx      # Interactive grocery checklist
│   │   │   ├── SavedRecipes.jsx      # Bookmarked dishes
│   │   │   ├── DailyTracker.jsx      # Daily intake tracker & water log
│   │   │   ├── AIAssistant.jsx       # Nutrition chatbot
│   │   │   └── UserProfile.jsx       # Target setting & preferences
│   │   ├── services/
│   │   │   └── api.js                # Frontend API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── start.bat                         # Windows one-click launcher
├── start.ps1                         # PowerShell one-click launcher
├── .env.example
└── README.md
```

---

## 🚀 Execution & Setup Instructions

### Prerequisites
- **Python 3.11+**
- **Node.js 18+ & npm**

### Option A: One-Click Startup (Windows)
Double-click `start.bat` or run in PowerShell:
```powershell
.\start.ps1
```
This automatically starts:
1. FastAPI Backend on `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)
2. React Vite Frontend on `http://localhost:5173`

---

### Option B: Manual Execution

#### 1. Backend Setup
```bash
cd backend
python -m venv ../.venv
..\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend automatically creates all SQLite tables and seeds the 100 food catalogue entries on first launch.

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables & API Key Integration

The application is pre-configured with the Hugging Face API key provided:
```env
HUGGINGFACE_API_KEY="your_huggingface_api_key_here"
HF_VISION_MODEL="google/vit-base-patch16-224"
DATABASE_URL="sqlite:///./food_fitness.db"
SECRET_KEY="ai-fitness-secret-key-super-secure-token-2026"
```
*Note: If the Hugging Face Inference API is experiencing network latency or rate limits, the built-in resilient heuristic classifier automatically activates so food recognition never crashes or presents empty screens.*

---

## ✅ Verification Checklist

- [x] Initial catalogue contains **exactly 100 distinct food items and recipes** across 5 balanced categories (20 each).
- [x] Raw ingredient nutrition strictly distinguished from cooked recipe nutrition.
- [x] Local price customization feature enables users to edit retail prices per serving in ₹.
- [x] Serving size adjuster dynamically recalculates all ingredient weights and nutrient values.
- [x] AI Recommendation engine supports Tamil/South Indian meals, available ingredients, budget, and allergy constraints.
- [x] 7-Day zero-waste budget meal planner generates consolidated grocery list with ingredient reuse.
- [x] Food cost comparison ranks foods by **₹ per 10g protein**.
- [x] Multimodal food scanner integrates portion detection, health assessment (Green/Yellow/Red), high-protein alternatives, and recipe suggestions.
- [x] Frontend builds with 0 errors (`npm run build`).
- [x] Real database persistence in SQLite (`food_fitness.db`).

