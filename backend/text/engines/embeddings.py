from sentence_transformers import SentenceTransformer
import numpy as np
from typing import Dict, Any, List

# Load model lazily to avoid blocking app boot
model = None

def get_model():
    global model
    if model is None:
        print("Loading sentence-transformers 'all-mpnet-base-v2' (This will take a moment on first run)...")
        model = SentenceTransformer('all-mpnet-base-v2')
    return model

def analyze(text: str, chunks_dict: Dict[str, List[str]]) -> Dict[str, Any]:
    """
    Phase 2, Layer 1: Embeddings Engine
    Measures semantic consistency across sentences. AI text typically exhibits 
    abnormally high semantic consistency (it stays perfectly on topic), 
    whereas human text tends to drift tangentially.
    """
    sentences = chunks_dict.get("sentences", [])
    
    # If there's only 1 sentence, consistency is perfect
    if len(sentences) < 2:
        return {"feature_semantic_consistency": 1.0}
        
    m = get_model()
    embeddings = m.encode(sentences)
    
    # Normalize vectors
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    norms[norms == 0] = 1 # prevent div by zero
    normalized = embeddings / norms
    
    # Calculate pairwise cosine similarity matrix
    similarities = np.dot(normalized, normalized.T)
    
    # Extract upper triangle to get pairwise scores
    upper_tri = np.triu_indices_from(similarities, k=1)
    pairwise_sims = similarities[upper_tri]
    
    mean_consistency = float(np.mean(pairwise_sims))
    
    return {
        "feature_semantic_consistency": mean_consistency
    }
