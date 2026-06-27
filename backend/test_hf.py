from transformers import pipeline
import sys

models = [
    "Nahrawy/AI-Generated-Image-Detection",
    "prithivMLmods/Deepfake-Detection",
    "Organika/sdxl-detector"
]

images = [
    r"c:\Users\hemla\Downloads\inter\check\ai.webp",
    r"c:\Users\hemla\Downloads\inter\check\real.webp"
]

for model_name in models:
    print(f"\n--- Testing {model_name} ---")
    try:
        classifier = pipeline("image-classification", model=model_name, device="cpu")
        for img in images:
            try:
                res = classifier(img)
                print(f"{img}: {res}")
            except Exception as e:
                print(f"{img}: Error - {e}")
    except Exception as e:
        print(f"Failed to load {model_name}: {e}")
