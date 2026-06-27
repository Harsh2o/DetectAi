import cv2
from PIL import Image
from transformers import pipeline
import numpy as np

print("[Depth Physics] Loading MiDaS Depth Estimator...")
try:
    depth_estimator = pipeline("depth-estimation", device=-1)
except Exception as e:
    print(f"Error loading depth estimator: {e}")
    depth_estimator = None

def analyze_depth_physics(video_path: str, max_frames=10) -> float:
    print(f"[Depth Physics] Analyzing 3D volume for {video_path}")
    if depth_estimator is None: return 0.0
    
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count < 2: return 0.0
        
    step = max(1, frame_count // max_frames)
    depth_maps = []
    
    try:
        for i in range(0, frame_count, step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret: break
                
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame).resize((256, 256))
            
            # Predict depth
            prediction = depth_estimator(pil_img)
            # depth_estimator returns a dict with 'depth' (PIL image) or 'predicted_depth' (tensor)
            if "depth" in prediction:
                depth_img = prediction["depth"]
                depth_np = np.array(depth_img).astype("float32")
                # Normalize to 0-1
                depth_np = depth_np / 255.0
                depth_maps.append(depth_np)
            elif "predicted_depth" in prediction:
                depth_np = prediction["predicted_depth"].squeeze().cpu().numpy()
                depth_np = (depth_np - depth_np.min()) / (depth_np.max() - depth_np.min() + 1e-8)
                depth_maps.append(depth_np)
                
            if len(depth_maps) >= max_frames:
                break
    except Exception as e:
        print(f"[Depth Physics] Error during frame analysis: {e}")
        
    cap.release()
    
    if len(depth_maps) < 2: return 0.0
    
    # Calculate MSE between consecutive depth maps
    mse_scores = []
    for i in range(len(depth_maps) - 1):
        err = np.sum((depth_maps[i] - depth_maps[i+1]) ** 2)
        err /= float(depth_maps[i].size)
        mse_scores.append(err)
        
    # Analyze the variance of the Depth MSE. 
    # Real camera motion has smooth 3D depth changes. 
    # AI generated video (like Sora) often randomly collapses or warps 3D volumes.
    depth_variance = float(np.var(mse_scores)) * 100000.0 # scale up for readability
    
    # Scale to 0-1 confidence
    # Based on tests, real video depth variance is usually smooth (low variance).
    # Generative AI exhibits severe 3D volume flickering.
    anomaly_score = min(1.0, max(0.0, depth_variance / 50.0))
    
    print(f"[Depth Physics] Score: {anomaly_score:.3f} (3D Volume Variance: {depth_variance:.3f})")
    
    return anomaly_score
