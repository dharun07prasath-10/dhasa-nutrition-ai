import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Search for .env in current dir, backend dir, and root workspace dir
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent
root_dir = backend_dir.parent

load_dotenv(backend_dir / ".env")
load_dotenv(root_dir / ".env")
load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "AI Fitness - Food Nutrition & Protein Recommendation System"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ai-fitness-secret-key-super-secure-token-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./food_fitness.db")
    HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY", "")
    HF_VISION_MODEL: str = os.getenv("HF_VISION_MODEL", "google/vit-base-patch16-224")

settings = Settings()

