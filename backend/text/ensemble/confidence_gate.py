from typing import Dict, Any

def evaluate(transformer_score: float, stylometry_score: float) -> Dict[str, Any]:
    """
    Stage 5: Confidence Gate.
    Determines if the text needs expensive Perplexity checking.
    """
    # Average the base scores
    combined = (transformer_score * 0.7) + (stylometry_score * 0.3)
    
    # If combined score is extreme, we are confident.
    if combined > 0.90:
        needs_perplexity = False
        confidence_level = "High"
    elif combined < 0.15:
        needs_perplexity = False
        confidence_level = "High"
    else:
        # Grey zone (15% to 90%)
        needs_perplexity = True
        confidence_level = "Low"
        
    return {
        "needs_perplexity": needs_perplexity,
        "base_combined_score": combined,
        "gate_confidence": confidence_level
    }
