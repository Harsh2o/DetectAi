import re
from typing import List, Dict, Any

def chunk_text(text: str) -> Dict[str, List[str]]:
    """
    Stage 2: Chunking Engine.
    Splits text into paragraphs and sentences to analyze mixed documents.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    if not paragraphs:
        paragraphs = [text]
        
    # Split into sentences safely
    sentences = [s.strip() + "." for s in re.split(r'(?<=[.!?]) +', text) if s.strip()]
    if not sentences:
        sentences = [text]
        
    return {
        "paragraphs": paragraphs,
        "sentences": sentences
    }
