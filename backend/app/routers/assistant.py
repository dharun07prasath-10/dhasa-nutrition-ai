from pydantic import BaseModel
from fastapi import APIRouter, Depends
from ..auth import get_current_user
from ..models import User

router = APIRouter(prefix="/assistant", tags=["AI Fitness Assistant"])

class ChatMessage(BaseModel):
    message: str

@router.post("/chat")
def chat_with_nutritionist(
    msg: ChatMessage,
    current_user: User = Depends(get_current_user)
):
    query = msg.message.lower().strip()
    
    # Intelligent nutrition knowledge base
    if "soya" in query:
        response = (
            "**Soya Chunks Nutrition Insight**:\n\n"
            "• **Protein Density**: Soya chunks pack 52g protein per 100g dry weight—the highest natural protein density in Indian grocery stores.\n"
            "• **Budget**: At just ₹12-14 per 100g, it costs roughly ₹2.31 per 10g of protein, making it 5x more affordable than whey protein and 3x cheaper than chicken breast.\n"
            "• **Preparation Secret**: Boil for 5 minutes in salted water, rinse under cold tap, and **squeeze dry completely**. This removes raw soy taste and creates a spongy texture that drinks up Chettinad or tadka spices!"
        )
    elif "egg" in query:
        response = (
            "**Egg Nutrition & Fitness Truth**:\n\n"
            "• **Whole Eggs vs Whites**: 1 whole egg has 6.3g complete protein with all essential amino acids (100% biological value).\n"
            "• **Yolk Facts**: Don't discard yolks unnecessarily! The yolk holds 100% of vitamins A, D, E, K, brain-building choline, and lutein. Dietary cholesterol in eggs does not adversely raise blood LDL in healthy active individuals.\n"
            "• **Cost**: At ₹6.50 per egg, it is the most dependable daily animal protein in India."
        )
    elif "kollu" in query or "horse gram" in query:
        response = (
            "**Kollu (Horse Gram) - Traditional Tamil Powerhouse**:\n\n"
            "• **Fiber & Calcium**: Packs 14g dietary fiber and 143mg bioavailable calcium per 50g dry portion.\n"
            "• **Metabolic Benefits**: Celebrated in Tamil Siddha medicine for metabolic acceleration and reducing visceral fat.\n"
            "• **Zero-Waste Hack**: Boil soaked horse gram; use the tender beans for **Kollu Sundal** and the mineral-rich boiling water for **Kollu Rasam**!"
        )
    elif "fat" in query:
        response = (
            "**Understanding Dietary Fats**:\n\n"
            "• **Good Fats (MUFA & PUFA)**: Found in peanuts, sesame seeds (til), mustard oil, and fish (sardines/mackerel). They reduce systemic inflammation and support joint lubrication.\n"
            "• **Saturated Fat**: Found in coconut oil, ghee, and dairy. Essential for hormone synthesis in moderation (keep below 10% of total daily calories).\n"
            "• **Trans Fat**: Industrial trans fats from repeated deep-frying oils or bakery vanaspati should be strictly minimized as they elevate heart risk."
        )
    elif "south indian" in query or "tamil" in query or "dosa" in query or "idli" in query:
        response = (
            "**South Indian High-Protein Optimization**:\n\n"
            "1. **Muttai Dosa**: Add an egg to your traditional dosa to boost protein from 3g to 11.5g with zero extra cooking time.\n"
            "2. **Pesarattu**: Andhra/Tamil style green gram dosa made with whole moong provides 14.8g protein and 9g fiber per serving with no rice needed.\n"
            "3. **Invert Khichdi / Pongal Ratio**: Instead of 3:1 rice to dal, use **2:1 dal to rice** for a high-protein, gentle recovery meal."
        )
    elif "budget" in query or "cheap" in query:
        response = (
            "**Top 5 Budget High-Protein Indian Champions**:\n\n"
            "1. **Soya Chunks**: ₹2.31 per 10g protein (52% protein)\n"
            "2. **Horse Gram (Kollu)**: ₹4.09 per 10g protein\n"
            "3. **Roasted Chana (Pottukadalai / Sattu)**: ₹5.39 per 10g protein\n"
            "4. **Kala Chana (Brown Chickpeas)**: ₹5.00 per 10g protein\n"
            "5. **Whole Chicken Eggs**: ₹10.32 per 10g complete animal protein"
        )
    else:
        response = (
            f"Hello {current_user.full_name}! As your AI Fitness & Nutrition companion, I'm here to help you hit your daily targets of **{current_user.daily_protein_target:.0f}g protein** within your **₹{current_user.daily_budget_inr:.0f} daily budget**.\n\n"
            "Ask me anything about:\n"
            "• Budget protein sources & meal ideas\n"
            "• South Indian & Tamil recipes (Sundal, Dosa, Rasam)\n"
            "• Balancing good fats vs saturated fats\n"
            "• Pre & post-workout nutrition\n"
            "• Soya chunks, eggs, paneer, and fish cooking tips"
        )

    return {"reply": response}

