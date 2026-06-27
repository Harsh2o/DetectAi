from image.tasks import process_image_pipeline
import json

ai_path = r"c:\Users\hemla\Downloads\inter\check\ai.webp"
real_path = r"c:\Users\hemla\Downloads\inter\check\real.webp"

print("Testing AI WebP...")
res_ai = process_image_pipeline(ai_path, "dummy_phash1")
print(json.dumps(res_ai, indent=2))

print("Testing Real WebP...")
res_real = process_image_pipeline(real_path, "dummy_phash2")
print(json.dumps(res_real, indent=2))
