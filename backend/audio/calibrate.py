import os
import glob
import numpy as np
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from audio.tasks import analyze_audio_features

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "audio_dataset")
REAL_DIR = os.path.join(DATA_DIR, "real")
FAKE_DIR = os.path.join(DATA_DIR, "fake")

def calibrate_model():
    print("Starting Calibration Test...")
    real_files = glob.glob(os.path.join(REAL_DIR, "*.wav"))
    fake_files = glob.glob(os.path.join(FAKE_DIR, "*.wav"))
    
    if not real_files or not fake_files:
        print("Dataset not found. Please run create_dataset.py first.")
        return
        
    print(f"Found {len(real_files)} Real files and {len(fake_files)} AI files.")
    
    real_scores = []
    fake_scores = []
    
    print("\n--- Evaluating Real Audio ---")
    for f in real_files:
        res = analyze_audio_features(f)
        score = res["synthetic_probability"]
        real_scores.append(score)
        print(f"Real File {os.path.basename(f)} -> Score: {score:.3f}")
        
    print("\n--- Evaluating AI Audio ---")
    for f in fake_files:
        res = analyze_audio_features(f)
        score = res["synthetic_probability"]
        fake_scores.append(score)
        print(f"Fake File {os.path.basename(f)} -> Score: {score:.3f}")
        
    # Calibration search
    best_threshold = 0.5
    best_accuracy = 0
    
    for thresh in np.arange(0.1, 0.9, 0.01):
        # A file is classified as AI if score >= thresh
        # We want Real scores < thresh, Fake scores >= thresh
        true_negatives = sum(1 for s in real_scores if s < thresh) # Correctly identified as real
        true_positives = sum(1 for s in fake_scores if s >= thresh) # Correctly identified as fake
        
        accuracy = (true_negatives + true_positives) / (len(real_scores) + len(fake_scores))
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_threshold = thresh
            
    print("\n===============================")
    print("      CALIBRATION RESULTS      ")
    print("===============================")
    print(f"Default (0.50) Accuracy: {calculate_accuracy(real_scores, fake_scores, 0.50):.2f}%")
    print(f"Best Optimal Threshold : {best_threshold:.2f}")
    print(f"Calibrated Accuracy    : {best_accuracy * 100:.2f}%")
    print("\nDetailed Score Distribution:")
    print(f"Real audio average synthetic score: {np.mean(real_scores):.3f}")
    print(f"AI audio average synthetic score: {np.mean(fake_scores):.3f}")

def calculate_accuracy(real, fake, thresh):
    tn = sum(1 for s in real if s < thresh)
    tp = sum(1 for s in fake if s >= thresh)
    return (tn + tp) / (len(real) + len(fake)) * 100

if __name__ == "__main__":
    calibrate_model()
