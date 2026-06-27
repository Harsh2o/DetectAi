import os
import requests
import time

API_URL = "http://127.0.0.1:8000/detect/image"
STATUS_URL = "http://127.0.0.1:8000/detect/image/status/"
IMAGE_DIR = r"c:\Users\hemla\Downloads\inter\image Resources"

def test_images():
    print("Starting Image Batch Test...\n")
    
    results_md = "# Image Detection Batch Test Results\n\n"
    results_md += "| Image | Status | AI Probability | Real Score | OOD (Novelty) | Verdict |\n"
    results_md += "|-------|--------|----------------|------------|---------------|---------|\n"
    
    images = [f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    for filename in images:
        filepath = os.path.join(IMAGE_DIR, filename)
        print(f"Testing: {filename}")
        
        try:
            with open(filepath, 'rb') as f:
                files = {'file': (filename, f, 'image/jpeg')}
                response = requests.post(API_URL, files=files)
            
            if response.status_code != 200:
                print(f"  Error: {response.status_code} - {response.text}")
                results_md += f"| {filename} | ❌ Error {response.status_code} | - | - | - | - |\n"
                continue
                
            data = response.json()
            
            # If immediate cache hit
            if data.get("status") == "cached":
                res = data["results"]
                ai_prob = f"{res.get('synthetic_probability', 0)*100:.1f}%"
                real_score = f"{res.get('authenticity_score', 0)*100:.1f}%"
                ood_score = f"{res.get('novel_generator_probability', 0)*100:.1f}%"
                verdict = "🤖 AI" if res.get('synthetic_probability', 0) > 0.5 else "👤 REAL"
                results_md += f"| {filename} | ✅ Cached | {ai_prob} | {real_score} | {ood_score} | {verdict} |\n"
                continue
                
            # Otherwise poll for completion
            task_id = data.get("task_id")
            if not task_id:
                results_md += f"| {filename} | ❌ No Task ID | - | - | - | - |\n"
                continue
                
            max_retries = 30
            for i in range(max_retries):
                time.sleep(1)
                status_res = requests.get(f"{STATUS_URL}{task_id}")
                s_data = status_res.json()
                
                if s_data.get("status") == "completed":
                    res = s_data["results"]
                    ai_prob = f"{res.get('synthetic_probability', 0)*100:.1f}%"
                    real_score = f"{res.get('authenticity_score', 0)*100:.1f}%"
                    ood_score = f"{res.get('novel_generator_probability', 0)*100:.1f}%"
                    verdict = "🤖 AI" if res.get('synthetic_probability', 0) > 0.5 else "👤 REAL"
                    results_md += f"| {filename} | ✅ Done | {ai_prob} | {real_score} | {ood_score} | {verdict} |\n"
                    break
                elif s_data.get("status") == "failed":
                    results_md += f"| {filename} | ❌ Failed | - | - | - | - |\n"
                    break
            else:
                results_md += f"| {filename} | ⏱ Timeout | - | - | - | - |\n"
                
        except Exception as e:
            print(f"  Exception: {e}")
            results_md += f"| {filename} | ❌ Exception | - | - | - | - |\n"
            
    # Save results locally
    with open("image_batch_results.md", "w", encoding="utf-8") as f:
        f.write(results_md)
        
    print("\nBatch Test Complete. Results saved to image_batch_results.md")

if __name__ == "__main__":
    test_images()
