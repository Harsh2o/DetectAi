import cv2
import numpy as np

def analyze_prnu(video_path: str, max_frames=10) -> float:
    """
    Approximates Photo-Response Non-Uniformity (PRNU) sensor noise.
    Real cameras leave a consistent noise fingerprint across frames.
    AI videos generate mathematically random noise with ~0 correlation.
    """
    print(f"[PRNU] Extracting noise signatures from {video_path}")
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if frame_count < 2: return 0.0
        
    step = max(1, frame_count // max_frames)
    noise_residuals = []
    
    for i in range(0, frame_count, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret: break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.resize(gray, (256, 256)) # Downscale for speed
        
        # Extract noise by subtracting a blurred version from the original
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        noise = cv2.subtract(gray, blurred).astype(np.float32)
        
        # Flatten and normalize
        noise_flat = noise.flatten()
        if np.std(noise_flat) > 0:
            noise_flat = (noise_flat - np.mean(noise_flat)) / np.std(noise_flat)
            noise_residuals.append(noise_flat)
            
        if len(noise_residuals) >= max_frames:
            break
            
    cap.release()
    
    if len(noise_residuals) < 2: return 0.0
    
    # Calculate average correlation between adjacent frames
    correlations = []
    for i in range(len(noise_residuals) - 1):
        corr = np.corrcoef(noise_residuals[i], noise_residuals[i+1])[0, 1]
        correlations.append(corr)
        
    avg_corr = float(np.mean(correlations))
    
    # Real camera PRNU has positive correlation. AI has ~0.
    # We map correlation to an anomaly score (0 = Real, 1 = AI).
    # If correlation is high (>0.1), it's a real camera. If <0.02, it's AI.
    if avg_corr > 0.08:
        anomaly_score = 0.0
    elif avg_corr < 0.02:
        anomaly_score = 1.0
    else:
        # Linear interpolation
        anomaly_score = 1.0 - ((avg_corr - 0.02) / 0.06)
        
    anomaly_score = min(1.0, max(0.0, anomaly_score))
    print(f"[PRNU] Score: {anomaly_score:.3f} (Avg Temporal Noise Correlation: {avg_corr:.4f})")
    return anomaly_score
