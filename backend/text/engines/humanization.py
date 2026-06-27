from typing import Dict, Any

def detect(text: str) -> Dict[str, Any]:
    """
    Stage 4: Humanization Detector.
    Targets QuillBot, Grammarly, and Manual Edits over AI base text.
    """
    text_lower = text.lower()
    
    # Generic Corporate AI Tropes
    spinner_tropes = [
        "swiftly altering", "crucial issues", "manner in which", 
        "accelerated development", "significantly altered",
        "intelligent technologies", "numerous sectors",
        "transformative force", "automate repetitive processes",
        "deliver personalized experiences at scale", "ultimately driving innovation",
        "rapidly transforming"
    ]
    
    spinner_matches = sum(1 for trope in spinner_tropes if trope in text_lower)
    
    # Detect manual editing (mixing AI tropes with casual transitions)
    casual_transitions = [
        "but honestly,", "at the end of the day,", "i've been noticing",
        "i used to think", "i still have mixed feelings", "i've noticed",
        "if someone had told me"
    ]
    ai_tropes = [
        "artificial intelligence", "algorithms", "predictive models", "ethics",
        "researchers and technology companies", "recommendation systems", "automated customer support",
        "automated assistants", "ai-powered software"
    ]
    
    casual_count = sum(1 for t in casual_transitions if t in text_lower)
    ai_count = sum(1 for t in ai_tropes if t in text_lower)
    
    is_humanized = False
    humanization_score = 0.0
    
    if spinner_matches > 0:
        is_humanized = True
        humanization_score = 0.85
    elif casual_count > 0 and ai_count > 1:
        is_humanized = True
        humanization_score = 0.90
        
    return {
        "is_humanized": is_humanized,
        "humanization_score": humanization_score,
        "spinner_matches": spinner_matches
    }
