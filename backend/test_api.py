import requests
import time
import json

url = "http://localhost:8000/image"
file_path = r"c:\Users\hemla\Downloads\inter\check\ai.webp"

try:
    with open(file_path, "rb") as f:
        files = {"file": ("ai.webp", f, "image/webp")}
        response = requests.post(url, files=files)

    print("POST Response:", response.json())
    
    if "task_id" in response.json():
        task_id = response.json()["task_id"]
        status_url = f"http://localhost:8000/image/status/{task_id}"
        
        while True:
            status_res = requests.get(status_url).json()
            if status_res.get("status") in ["completed", "failed"]:
                print("Final Status:")
                print(json.dumps(status_res, indent=2))
                break
            time.sleep(1)
except Exception as e:
    print(f"Failed: {e}")
