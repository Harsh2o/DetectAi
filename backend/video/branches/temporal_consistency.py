import cv2
import numpy as np

def analyze_temporal_consistency(video_path: str, max_frames=15) -> float:
    """
    Measures pixel-level temporal consistency (flicker).
    AI generated videos often suffer from micro-flickering, where static 
    backgrounds or textures shift slightly between consecutive frames.
    """
    print(f"[Temporal Consistency] Analyzing {video_path}")
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if frame_count < 2: return 0.0
        
    step = max(1, frame_count // max_frames)
    
    prev_gray = None
    mse_scores = []
    
    for i in range(0, frame_count, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret: break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.resize(gray, (256, 256))
        
        if prev_gray is not None:
            # Mean Squared Error between consecutive frames
            err = np.sum((gray.astype("float") - prev_gray.astype("float")) ** 2)
            err /= float(gray.shape[0] * gray.shape[1])
            mse_scores.append(err)
            
        prev_gray = gray
        if len(mse_scores) >= max_frames:
            break
            
    cap.release()
    
    if not mse_scores: return 0.0
    
    # Analyze the variance of the MSE. 
    # Real camera motion has smooth MSE curves. AI flicker causes chaotic MSE variance.
    flicker_variance = float(np.var(mse_scores))
    
    # Scale to 0-1
    base_thresh = 50.0
    anomaly_score = min(1.0, max(0.0, flicker_variance / 2000.0))
    
    print(f"[Temporal Consistency] Score: {anomaly_score:.3f} (Flicker Variance: {flicker_variance:.2f})")
    return anomaly_score
