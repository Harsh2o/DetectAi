import requests
import json
import os
import cv2

# Manually load .env to avoid external dependencies
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip().strip('"')

# ==========================================
# ADVANCED HEURISTIC CONFIGURATION
# ==========================================
SIGHTENGINE_API_USER = os.getenv("SIGHTENGINE_API_USER")
SIGHTENGINE_API_SECRET = os.getenv("SIGHTENGINE_API_SECRET")

def analyze_advanced_heuristics(video_path: str) -> float:
    # print(f"[Advanced Heuristics] Extracting core heuristics for {video_path}")
    
    if not SIGHTENGINE_API_USER or not SIGHTENGINE_API_SECRET:
        return 0.0
        
    try:
        cap = cv2.VideoCapture(video_path)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_count // 2)
        ret, frame = cap.read()
        cap.release()
        
        if not ret: return 0.0
        
        temp_img_path = "temp_heuristic_frame.jpg"
        cv2.imwrite(temp_img_path, frame)
        
        url = 'https://api.sightengine.com/1.0/check.json'
        
        with open(temp_img_path, 'rb') as img_file:
            files = {'media': img_file}
            data = {
                'models': 'deepfake',
                'api_user': SIGHTENGINE_API_USER,
                'api_secret': SIGHTENGINE_API_SECRET
            }
            response = requests.post(url, files=files, data=data)
            
        os.remove(temp_img_path)
        output = json.loads(response.text)
        
        if output.get("status") == "success":
            deepfake_data = output.get("type", {}).get("deepfake", 0.0)
            return float(deepfake_data)
        else:
            return 0.0
            
    except Exception as e:
        return 0.0
