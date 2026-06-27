import cv2
import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModel
import numpy as np

print("[Semantic Drift] Loading DINOv2 Foundation Model...")
device = "cuda" if torch.cuda.is_available() else "cpu"
try:
    processor = AutoImageProcessor.from_pretrained("facebook/dinov2-small")
    model = AutoModel.from_pretrained("facebook/dinov2-small").to(device).eval()
except Exception as e:
    print(f"Error loading DINOv2: {e}")
    model = None

def analyze_semantic_drift(video_path: str, max_frames=15) -> float:
    print(f"[Semantic Drift] Tracking embeddings for {video_path}")
    if model is None: return 0.0
    
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count < 2: return 0.0
        
    step = max(1, frame_count // max_frames)
    embeddings = []
    
    try:
        for i in range(0, frame_count, step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret: break
                
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)
            
            inputs = processor(images=pil_img, return_tensors="pt").to(device)
            with torch.no_grad():
                outputs = model(**inputs)
                # Use the CLS token embedding (shape: 1, 384)
                cls_embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy().flatten()
                embeddings.append(cls_embedding)
                
            if len(embeddings) >= max_frames:
                break
    except Exception as e:
        print(f"[Semantic Drift] Error during frame analysis: {e}")
        
    cap.release()
    
    if len(embeddings) < 2: return 0.0
    
    # Calculate Cosine Similarity between consecutive embeddings
    similarities = []
    for i in range(len(embeddings) - 1):
        v1 = embeddings[i]
        v2 = embeddings[i+1]
        cos_sim = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
        similarities.append(cos_sim)
        
    # Analyze Semantic Stability.
    # Real videos have extremely high semantic similarity (>0.95) across consecutive frames.
    # AI videos (even SORA) suffer from "semantic drift" where the underlying meaning
    # of the pixels subtly shifts (e.g. a shadow becomes an object).
    
    avg_similarity = float(np.mean(similarities))
    
    # If average similarity drops below a very tight threshold (e.g. 0.95), it's highly likely to be AI.
    # We invert it: 1.0 (perfectly stable) -> 0.0 anomaly score.
    # Anything below 0.92 is heavily penalized as a hallucination.
    
    drift_penalty = 1.0 - avg_similarity
    
    # Scale to 0-1
    anomaly_score = min(1.0, max(0.0, (drift_penalty - 0.02) * 10.0))
    
    print(f"[Semantic Drift] Score: {anomaly_score:.3f} (Avg Cosine Similarity: {avg_similarity:.4f})")
    return anomaly_score
