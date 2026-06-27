import requests
import json
import os

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

def analyze_advanced_heuristics(image_path: str):
    """
    Sends the image to the Sightengine external API for an authoritative consensus check.
    Returns the score if successful, None if it failed (so we don't accidentally override with 0.0)
    """
    if not SIGHTENGINE_API_USER or not SIGHTENGINE_API_SECRET:
        return None
        
    try:
        url = 'https://api.sightengine.com/1.0/check.json'
        
        with open(image_path, 'rb') as img_file:
            files = {'media': img_file}
            data = {
                'models': 'deepfake',
                'api_user': SIGHTENGINE_API_USER,
                'api_secret': SIGHTENGINE_API_SECRET
            }
            response = requests.post(url, files=files, data=data)
            
        output = json.loads(response.text)
        
        if output.get("status") == "success":
            deepfake_data = output.get("type", {}).get("deepfake", 0.0)
            return float(deepfake_data)
        else:
            print(f"[Advanced Heuristics] API Error: {output}")
            return None
            
    except Exception as e:
        print(f"[Advanced Heuristics] Exception: {e}")
        return None
