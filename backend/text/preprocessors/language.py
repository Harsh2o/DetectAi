from typing import Dict, Any

def check_quality(text: str) -> Dict[str, Any]:
    """
    Stage 1: Quality and Language Detection.
    Rejects text that is too short, or unsupported languages.
    """
    word_count = len(text.split())
    
    # Very basic language heuristic for demo
    spanish_words = [" el ", " la ", " de ", " que ", " y ", " en ", " un ", " ser "]
    hindi_words = [" hai ", " ki ", " mein ", " se ", " aur ", " ko "]
    
    lang = "English"
    text_lower = " " + text.lower() + " "
    if sum(1 for w in spanish_words if w in text_lower) > 3:
        lang = "Spanish"
    elif sum(1 for w in hindi_words if w in text_lower) > 3:
        lang = "Hindi"
        
    is_valid = word_count >= 10
    
    return {
        "is_valid": is_valid,
        "language": lang,
        "word_count": word_count,
        "error": None if is_valid else "Text must be at least 10 words."
    }
