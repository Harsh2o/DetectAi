import cv2
import torch
import numpy as np
from torchvision.models.optical_flow import raft_small, Raft_Small_Weights
import torchvision.transforms.functional as F

print("[Motion Physics] Loading RAFT Optical Flow Model...")
device = "cuda" if torch.cuda.is_available() else "cpu"
try:
    weights = Raft_Small_Weights.DEFAULT
    transforms = weights.transforms()
    model = raft_small(weights=weights, progress=False).to(device).eval()
except Exception as e:
    print(f"Error loading RAFT: {e}")
    model = None

def analyze_motion_physics(video_path: str, num_pairs=3) -> float:
    if model is None: return 0.0
    print(f"[Motion Physics] Computing Flow for {video_path}")
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    
    if frame_count < 5: return 0.0
        
    step = max(1, int(fps * 0.1))
    start_frames = np.linspace(0, frame_count - step - 1, num_pairs, dtype=int)
    variance_scores = []
    
    for start_idx in start_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_idx)
        ret1, frame1 = cap.read()
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_idx + step)
        ret2, frame2 = cap.read()
        
        if not ret1 or not ret2: continue
            
        img1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2RGB)
        img2 = cv2.cvtColor(frame2, cv2.COLOR_BGR2RGB)
        
        img1 = cv2.resize(img1, (384, 384))
        img2 = cv2.resize(img2, (384, 384))
        
        t1 = torch.from_numpy(img1).permute(2, 0, 1).float().unsqueeze(0).to(device)
        t2 = torch.from_numpy(img2).permute(2, 0, 1).float().unsqueeze(0).to(device)
        t1, t2 = transforms(t1, t2)
        
        with torch.no_grad():
            list_of_flows = model(t1, t2)
            predicted_flow = list_of_flows[-1][0]
            
        flow_np = predicted_flow.cpu().numpy()
        u, v = flow_np[0], flow_np[1]
        magnitude = np.sqrt(u**2 + v**2)
        
        h, w = magnitude.shape
        grid_size = 16
        local_variances = []
        
        for y in range(0, h, grid_size):
            for x in range(0, w, grid_size):
                cell = magnitude[y:y+grid_size, x:x+grid_size]
                if cell.size > 0:
                    local_variances.append(np.var(cell))
                    
        if local_variances:
            morphing_index = np.percentile(local_variances, 95)
            variance_scores.append(morphing_index)
            
    cap.release()
    
    if not variance_scores: return 0.0
    avg_variance = float(np.mean(variance_scores))
    
    anomaly_score = min(1.0, max(0.0, avg_variance / 25000.0))
    print(f"[Motion Physics] Score: {anomaly_score:.3f} (Raw Variance: {avg_variance:.3f})")
    
    return anomaly_score
