from fastapi import APIRouter, Depends
from ..schemas import RecommendationRequest, RecommendationResponse
from ..services.recommendation_engine import generate_ai_recommendations
from ..auth import get_current_user
from ..models import User

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations"])

@router.post("", response_model=RecommendationResponse)
def get_recommendations(
    req: RecommendationRequest,
    current_user: User = Depends(get_current_user)
):
    """Suggests practical, budget-friendly high-protein Indian meals matching user constraints."""
    return generate_ai_recommendations(req)

