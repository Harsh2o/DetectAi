import cv2
from PIL import Image
from transformers import pipeline
import numpy as np
import traceback

print("[ViT Ensemble] Loading Spatial Models...")
try:
    classifier1 = pipeline("image-classification", model="umm-maybe/AI-image-detector", device=-1)
    # Using a second specialized model. We will stick to 2 to prevent CPU OOM crashes, which is still an ensemble.
    classifier2 = pipeline("image-classification", model="dima806/deepfake_vs_real_image_detection", device=-1)
except Exception as e:
    print(f"Error loading models: {e}")
    classifier1 = None
    classifier2 = None

def analyze_vit_ensemble(video_path: str, max_frames=15) -> float:
    print(f"[ViT Ensemble] Extracting {max_frames} frames from {video_path}")
    if classifier1 is None: return 0.0
    
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count == 0: return 0.0
        
    step = max(1, frame_count // max_frames)
    ai_probabilities = []
    
    try:
        for i in range(0, frame_count, step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret: break
                
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)
            
            frame_score = 0.0
            
            # Model 1
            res1 = classifier1(pil_img)
            score1 = 0.0
            for r in res1:
                if r['label'] in ['artificial', 'fake']:
                    score1 = r['score']
                    break
                elif r['label'] in ['human', 'real']:
                    score1 = 1.0 - r['score']
                    break
                    
            # Model 2
            res2 = classifier2(pil_img)
            score2 = 0.0
            for r in res2:
                if r['label'].lower() == 'fake':
                    score2 = r['score']
                    break
                elif r['label'].lower() == 'real':
                    score2 = 1.0 - r['score']
                    break
            
            # Trust the model that detects the anomaly (Defense-in-Depth)
            frame_score = max(score1, score2)
            ai_probabilities.append(frame_score)
            
            if len(ai_probabilities) >= max_frames:
                break
    except Exception as e:
        print(f"[ViT Ensemble] Error during frame analysis: {e}")
        
    cap.release()
    
    if not ai_probabilities: return 0.0
    
    # We take the 90th percentile to ignore outliers but catch momentary AI hallucinations
    ensemble_score = float(np.percentile(ai_probabilities, 90))
    print(f"[ViT Ensemble] Final Score: {ensemble_score:.3f}")
    
    return ensemble_score
