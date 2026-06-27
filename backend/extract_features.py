import os
from image.branches.ela import analyze_ela
from image.branches.fft_cnn import analyze_fft_cnn
from image.branches.prnu_residual import analyze_prnu_residual
from image.branches.deep_classifier import analyze_deep_classifier

IMAGE_DIR = r"c:\Users\hemla\Downloads\inter\image Resources"

def extract():
    print("Extracting raw features...")
    images = [f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    with open("features.csv", "w") as f:
        f.write("filename,ela_anomaly,fft_energy,prnu_variance,deep_score\n")
        
        for filename in images:
            filepath = os.path.join(IMAGE_DIR, filename)
            
            try:
                ela = analyze_ela(filepath).get("raw_anomaly", 0.0)
            except: ela = 0.0
            
            try:
                fft = analyze_fft_cnn(filepath).get("raw_energy", 0.0)
            except: fft = 0.0
            
            try:
                prnu = analyze_prnu_residual(filepath).get("raw_variance", 0.0)
            except: prnu = 0.0
            
            try:
                deep = analyze_deep_classifier(filepath).get("ood_variance", 0.0)
            except: deep = 0.0
            
            f.write(f"{filename},{ela},{fft},{prnu},{deep}\n")
            print(f"Extracted: {filename}")

if __name__ == "__main__":
    extract()
