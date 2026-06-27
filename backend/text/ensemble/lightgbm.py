from typing import Dict, Any

def predict(transformer_score: float, stylometry_score: float, humanization_score: float, perplexity_score: float, chunk_variance: float) -> Dict[str, Any]:
    """
    Stage 7: LightGBM Meta-Ensemble.
    Combines the inputs of all upstream models.
    """
    
    # Simple weighted aggregation for local proxy
    weight_trans = 0.4
    weight_stylo = 0.2
    weight_human = 0.3
    weight_perp = 0.1
    
    # If humanization is detected, it overrides transformer
    if humanization_score > 0.5:
        weight_trans = 0.2
        weight_human = 0.5
        
    raw_ai_score = (
        (transformer_score * weight_trans) +
        (stylometry_score * weight_stylo) +
        (humanization_score * weight_human) +
        (perplexity_score * weight_perp)
    )
    
    # Adjust for mixed documents using chunk variance
    # High variance between chunks means it's likely mixed
    mixed_content = chunk_variance > 0.15
    if mixed_content and raw_ai_score > 0.7:
        raw_ai_score = 0.65 # Drag down to "Mixed" territory
        
    return {
        "raw_ai_score": max(0.01, min(0.99, raw_ai_score)),
        "mixed_content": mixed_content
    }
