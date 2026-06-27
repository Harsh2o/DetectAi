import re
from typing import Dict, Any, List
import nltk

# Ensure NLTK POS tagger is available
try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger', quiet=True)

def analyze(text: str, chunks: Dict[str, List[str]]) -> Dict[str, Any]:
    """
    Layer 2: True Stylometric Features for Meta-Classifier
    Outputs raw mathematical features, not guesses.
    """
    words = [w.lower() for w in re.findall(r'\b\w+\b', text)]
    total_words = max(len(words), 1)
    
    # Feature 1: Type-Token Ratio (Vocabulary Richness)
    unique_words = set(words)
    ttr = len(unique_words) / total_words
    
    # Feature 2: Sentence Length Variance (Burstiness proxy)
    sentences = chunks.get("sentences", [])
    sentence_lengths = [len(re.findall(r'\b\w+\b', s)) for s in sentences]
    
    mean_len = sum(sentence_lengths) / len(sentence_lengths) if sentence_lengths else 0.0
    variance = 0.0
    if len(sentence_lengths) > 1:
        variance = sum((l - mean_len) ** 2 for l in sentence_lengths) / len(sentence_lengths)
        
    # Feature 3: Punctuation Entropy
    punct_count = len(re.findall(r'[.,!?;:]', text))
    punct_ratio = punct_count / total_words
    
    # Feature 4: Transition Word Density
    transitions = ["however", "furthermore", "moreover", "additionally", "conversely", "therefore"]
    transition_count = sum(1 for t in transitions if t in text.lower())
    transition_density = transition_count / total_words
    
    # Feature 5: POS Distribution (Adjective vs Verb ratio)
    # AI often overuses adjectives (Purple prose)
    pos_tags = nltk.pos_tag(words)
    adj_count = sum(1 for word, tag in pos_tags if tag.startswith('JJ'))
    verb_count = sum(1 for word, tag in pos_tags if tag.startswith('VB'))
    adj_verb_ratio = adj_count / max(verb_count, 1)
    
    return {
        "feature_ttr": ttr,
        "feature_sentence_variance": variance,
        "feature_punct_ratio": punct_ratio,
        "feature_transition_density": transition_density,
        "feature_adj_verb_ratio": adj_verb_ratio,
        "feature_mean_sentence_length": mean_len
    }
