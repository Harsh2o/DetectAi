def fuse_image_signals(metadata, ela, fft, prnu, deep):
    """
    Fusion Meta-Classifier
    Intelligently weights the 5 detection branches.
    Accounts for image degradation (recompression, resizing) by adjusting thresholds.
    """
    explanations = []
    
    # 1. Short-Circuit: Metadata Provenance
    # If explicit AI software is found, it's definitively AI.
    if metadata.get("score", 0.0) == 1.0:
        explanations.extend(metadata.get("flags", []))
        return {
            "synthetic_probability": 0.99,
            "authenticity_score": 0.01,
            "novel_generator_probability": 0.99,
            "explanations": explanations
        }
        
    # Weights for the Meta-Classifier
    # Now that the deep model is actually trained, we trust it highly!
    w_ela = 0.10
    w_fft = 0.15
    w_prnu = 0.15
    w_deep = 0.60
    
    ela_score = ela.get("score", 0.0)
    fft_score = fft.get("score", 0.0)
    prnu_score = prnu.get("score", 0.0)
    deep_score = deep.get("score", 0.0)
    meta_score = metadata.get("score", 0.0)
    
    base_synthetic = (ela_score * w_ela) + (fft_score * w_fft) + (prnu_score * w_prnu) + (deep_score * w_deep)
    
    # Robustness Calibration: Adjusting for degraded inputs
    # If ELA score is very high (splice detected) but deep score is low,
    # we trust ELA more (deep model might be confused by compression)
    if ela_score > 0.8 and deep_score < 0.5:
        base_synthetic = max(base_synthetic, 0.75)
        explanations.append("High-confidence Error Level Anomaly (ELA) detected; potential splice or deepfake.")
        
    # If FFT shows unnatural spectrum
    if fft_score > 0.7:
        explanations.append("Unnatural spatial high-frequency spectrum detected (common in diffusion models).")
        
    # PRNU flatlining
    if prnu_score > 0.7:
        explanations.append("Sensor noise residual (PRNU) is physically inconsistent with standard hardware.")
        
    if deep_score > 0.7:
        explanations.append("Deep Ensemble Classifier identified out-of-distribution (OOD) visual manifolds.")
        
    if base_synthetic < 0.4:
        explanations.append("Consistent natural physical heuristics observed.")
        
    return {
        "synthetic_probability": min(1.0, base_synthetic),
        "authenticity_score": max(0.0, 1.0 - base_synthetic),
        "novel_generator_probability": deep_score,  # ViT variance acts as OOD signal
        "explanations": explanations
    }
