import re
import requests
from typing import Dict, Any, List
from transformers import pipeline

_classifier = None
HF_API_URL = "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta"

def get_classifier():
    global _classifier
    if _classifier is None:
        print("Loading local HuggingFace Fallback...")
        _classifier = pipeline("text-classification", model="Hello-SimpleAI/chatgpt-detector-roberta", top_k=None)
    return _classifier

def serverless_inference(text: str) -> float:
    """ Attempts to use the $0 HuggingFace Cloud Inference API. Returns -1 if it fails. """
    try:
        response = requests.post(HF_API_URL, json={"inputs": text[:2000]}, timeout=3)
        if response.status_code == 200:
            results = response.json()
            if isinstance(results, list) and isinstance(results[0], list):
                for res in results[0]:
                    if res['label'].lower() in ['chatgpt', 'ai', 'fake']:
                        return res['score']
    except Exception:
        pass
    return -1.0

def analyze(text: str, chunks: Dict[str, List[str]]) -> Dict[str, Any]:
    """
    Phase 3: True Neural Classifier
    Uses a real HuggingFace Transformer model to extract neural probabilities.
    """
    # Still extract the model family proxy for UI explainability
    text_lower = text.lower()
    model_family = "Unknown"
    
    if any(w in text_lower for w in ["delve", "testament", "rapidly transforming", "crucial", "important to note"]):
        model_family = "GPT-4 Family"
    elif any(w in text_lower for w in ["fundamentally", "remarkable opportunities", "carefully balance", "multifaceted"]):
        model_family = "Claude Family"
    elif any(w in text_lower for w in ["break it down", "foundational capability", "digital technologies", "meticulously", "unwavering"]):
        model_family = "Gemini Family"
    else:
        model_family = "Generic LLM"

    try:
        # Truncate text to 2000 chars to prevent model crashes on massive inputs
        safe_text = text[:2000]
        
        # Step 1: Attempt $0 Serverless Cloud API first!
        ai_prob = serverless_inference(safe_text)
        
        # Step 2: Fallback to Local Pipeline if Cloud fails
        if ai_prob == -1.0:
            print("Serverless API unavailable. Falling back to local pipeline...")
            classifier = get_classifier()
            results = classifier(safe_text)[0]
            ai_prob = 0.5
            for res in results:
                if res['label'].lower() in ['chatgpt', 'ai', 'fake']:
                    ai_prob = res['score']
                    break
                
        # --- CLAUDE 4.6 SONNET INTERCEPTOR ---
        # Claude completely bypasses ChatGPT-trained RoBERTa models.
        # We manually boost the neural signal if extreme Claude-isms are detected.
        claude_tropes = [
            "by contrast", "pregnant pause", "relentless", "tapestry", "symphony", 
            "whispers to us", "intricate", "nuanced", "multifaceted", "it's worth noting",
            "ultimately", "testament"
        ]
        
        # Claude abuses em-dashes (—) and triadic lists
        em_dash_count = text.count("—") + text.count("--")
        trope_matches = sum(1 for t in claude_tropes if t in text_lower)
        
        if em_dash_count >= 2 or trope_matches >= 2:
            ai_prob = max(ai_prob, 0.94)
            model_family = "Claude Family"
                
    except Exception as e:
        print(f"Neural Classifier Error: {e}")
        ai_prob = 0.5
        
    return {
        "transformer_score": ai_prob,
        "model_family": model_family
    }
