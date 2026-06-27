import math
import collections
from typing import Dict, Any

def calculate(text: str) -> Dict[str, Any]:
    """
    Layer 3: Exact LLM Fingerprints (Burstiness & Entropy)
    Returns raw mathematical features for the meta-classifier.
    """
    words = [w.lower() for w in ''.join(c if c.isalnum() else ' ' for c in text).split()]
    total_words = max(len(words), 1)
    
    freq_map = collections.Counter(words)
        
    # Feature: Token Entropy
    entropy = 0.0
    for count in freq_map.values():
        p = count / total_words
        entropy -= p * math.log2(p)
        
    # Feature: Burstiness (Variance of term frequencies)
    # High burstiness = human (humans reuse specific niche words in bursts)
    # Low burstiness = AI (AI uses a wide, flat distribution of vocabulary)
    frequencies = list(freq_map.values())
    mean_freq = sum(frequencies) / len(frequencies) if frequencies else 0.0
    burstiness = 0.0
    if len(frequencies) > 1:
        burstiness = sum((f - mean_freq) ** 2 for f in frequencies) / len(frequencies)
    
    # Feature: Perplexity (simplified proxy for unigram model)
    document_perplexity = math.pow(2, entropy) if entropy > 0 else 1.0
    
    return {
        "feature_entropy": entropy,
        "feature_burstiness": burstiness,
        "feature_perplexity": document_perplexity
    }
