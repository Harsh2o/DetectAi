from typing import List

def generate(stylometry_data: dict, transformer_data: dict, humanization_data: dict, chunk_variance: float) -> List[str]:
    """
    Stage 9: Explanations Generator.
    Returns human-readable strings explaining the prediction.
    """
    explanations = []
    
    if stylometry_data.get("variance", 100) < 20:
        explanations.append("Low sentence variance (highly uniform structure)")
        
    if transformer_data.get("trope_count", 0) > 1:
        explanations.append("High semantic uniformity and AI tropes detected")
        
    if humanization_data.get("is_humanized", False):
        explanations.append("Evidence of paraphrasing or manual word-swapping")
        
    if chunk_variance > 0.15:
        explanations.append("High variation between text chunks (suggests mixed authorship)")
        
    if stylometry_data.get("ttr", 0) < 0.5:
        explanations.append("Low vocabulary richness (repetitive word usage)")
        
    if not explanations:
        explanations.append("Standard conversational patterns detected")
        
    return explanations
