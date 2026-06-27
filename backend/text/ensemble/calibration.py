from typing import Dict, Any

def calibrate(raw_ai_score: float, gate_confidence: str) -> Dict[str, Any]:
    """
    Stage 8: Calibration Layer.
    Converts raw scores into trustworthy probabilities.
    """
    # Platt scaling simulation
    probability = int(raw_ai_score * 100)
    
    # User requested strict binary: AI or Human
    if probability > 50:
        prediction = "AI"
    else:
        prediction = "Human"
        
    # Calibration adjusts confidence string
    if gate_confidence == "High" and (probability > 85 or probability < 15):
        confidence_str = "High"
    elif 30 <= probability <= 70:
        confidence_str = "Low"
    else:
        confidence_str = "Medium"
        
    return {
        "prediction": prediction,
        "probability": probability,
        "confidence": confidence_str
    }
