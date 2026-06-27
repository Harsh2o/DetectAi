import os
import time
from image.tasks import process_image_pipeline

IMAGE_DIR = r"c:\Users\hemla\Downloads\inter\image Resources\new_dataset"

def test_images_directly():
    print("Starting Direct Code Test (Bypassing API)...")
    
    results_md = "# Image Detection Direct Code Test Results\n\n"
    results_md += "| Image | AI Probability | Real Score | OOD (Novelty) | Verdict |\n"
    results_md += "|-------|----------------|------------|---------------|---------|\n"
    
    images = [f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    for filename in images:
        filepath = os.path.join(IMAGE_DIR, filename)
        print(f"Testing: {filename}")
        
        try:
            import shutil
            temp_path = f"temp_{filename}"
            shutil.copy(filepath, temp_path)
            
            # We call the pipeline directly, just as the Celery worker would.
            # We don't need a real phash since we aren't using the API.
            result = process_image_pipeline(temp_path, "mock_hash")
            
            res = result.get("data", {})
            ai_prob = f"{res.get('synthetic_probability', 0)*100:.1f}%"
            real_score = f"{res.get('authenticity_score', 0)*100:.1f}%"
            ood_score = f"{res.get('novel_generator_probability', 0)*100:.1f}%"
            verdict = "🤖 AI" if res.get('synthetic_probability', 0) > 0.5 else "👤 REAL"
            
            results_md += f"| {filename} | {ai_prob} | {real_score} | {ood_score} | {verdict} |\n"
            
        except Exception as e:
            print(f"  Exception: {e}")
            results_md += f"| {filename} | ❌ Exception | - | - | - |\n"
            
    with open("image_batch_results.md", "w", encoding="utf-8") as f:
        f.write(results_md)
        
    print("\nDirect Code Test Complete. Results saved.")

if __name__ == "__main__":
    test_images_directly()
