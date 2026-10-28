from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, SessionLocal
from .models import User, FoodItem
from .seed_data import SEED_FOODS
from .auth import hash_password
from .routers import auth, foods, recipes, scanner, recommendations, meal_planner, shopping_list, tracker, assistant

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="DHASA Nutrition AI — Smart Food Scanner, Budget High-Protein & Recipe Recommendations"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database with the 100 distinct items on initial startup
@app.on_event("startup")
def startup_db_seed():
    db = SessionLocal()
    try:
        # Check if default user exists
        user = db.query(User).filter(User.username == "fitness_user").first()
        if not user:
            user = User(
                username="fitness_user",
                email="user@aifitness.local",
                hashed_password=hash_password("fitness123"),
                full_name="Fitness Champion",
                daily_calorie_target=2200.0,
                daily_protein_target=110.0,
                daily_budget_inr=180.0,
                dietary_preference="all",
                preferred_cuisine="South Indian & Tamil"
            )
            db.add(user)
            db.commit()

        # Check count of items in food catalogue
        count = db.query(FoodItem).count()
        if count < 100:
            print(f"Current catalogue has {count} items. Seeding complete 100 distinct budget food & recipe items...")
            db.query(FoodItem).delete()
            for item in SEED_FOODS:
                db_item = FoodItem(**item)
                db.add(db_item)
            db.commit()
            print(f"Successfully seeded {len(SEED_FOODS)} distinct verified items!")
    finally:
        db.close()

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(foods.router, prefix=settings.API_V1_STR)
app.include_router(recipes.router, prefix=settings.API_V1_STR)
app.include_router(scanner.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(meal_planner.router, prefix=settings.API_V1_STR)
app.include_router(shopping_list.router, prefix=settings.API_V1_STR)
app.include_router(tracker.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "catalogue_items": 100,
        "endpoints": {
            "docs": "/docs",
            "foods": "/api/foods",
            "recipes": "/api/recipes",
            "scanner": "/api/scanner",
            "recommendations": "/api/recommendations",
            "meal_plans": "/api/meal-plans",
            "shopping_lists": "/api/shopping-lists",
            "tracker": "/api/tracker",
            "assistant": "/api/assistant"
        }
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected", "huggingface_configured": bool(settings.HUGGINGFACE_API_KEY)}

