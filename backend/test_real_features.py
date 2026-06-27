from image.branches.fft_cnn import analyze_fft_cnn
from image.branches.ela import analyze_ela
import json

ai_path = r"c:\Users\hemla\Downloads\inter\check\ai.webp"
real_path = r"c:\Users\hemla\Downloads\inter\check\real.webp"

print("AI Image:")
print(json.dumps(analyze_fft_cnn(ai_path), indent=2))
print(json.dumps(analyze_ela(ai_path), indent=2))

print("Real Image:")
print(json.dumps(analyze_fft_cnn(real_path), indent=2))
print(json.dumps(analyze_ela(real_path), indent=2))
