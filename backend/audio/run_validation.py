import os
import sys

# Ensure backend module is available
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import numpy as np
import soundfile as sf
import scipy.signal as signal
from audio.tasks import analyze_audio_features

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "audio_dataset")
VAL_REAL_DIR = os.path.join(DATA_DIR, "val_real")
VAL_FAKE_DIR = os.path.join(DATA_DIR, "val_fake")

os.makedirs(VAL_REAL_DIR, exist_ok=True)
os.makedirs(VAL_FAKE_DIR, exist_ok=True)

SR = 16000
DURATION = 5  # seconds

def generate_real_audio(filepath, seed_offset):
    import time
    np.random.seed(int(time.time() * 1000) % 2**32 + seed_offset)
    t = np.linspace(0, DURATION, SR * DURATION, endpoint=False)
    # Base frequency slightly randomized
    base_freq = 180 + np.random.uniform(-40, 40)
    audio = 0.5 * np.sin(2 * np.pi * base_freq * t)
    
    # Add broadband noise
    noise = np.random.normal(0, 0.1, len(t))
    
    # Dynamic envelope with varying pauses
    env_freq = 2 + np.random.uniform(-0.5, 0.5)
    envelope = np.abs(np.sin(2 * np.pi * env_freq * t) * np.cos(2 * np.pi * 0.5 * t))
    envelope[envelope < 0.2] = 0.0 
    
    final_audio = (audio + noise) * envelope
    
    b, a = signal.butter(4, [300, 3400], btype='bandpass', fs=SR)
    final_audio = signal.filtfilt(b, a, final_audio)
    
    sf.write(filepath, final_audio, SR)

def generate_fake_audio(filepath, seed_offset):
    import time
    np.random.seed(int(time.time() * 1000) % 2**32 + 500 + seed_offset)
    t = np.linspace(0, DURATION, SR * DURATION, endpoint=False)
    
    base_freq = 200 + np.random.uniform(-10, 10)
    audio = 0.5 * np.sin(2 * np.pi * base_freq * t)
    
    # Synthetic high-frequency hum (randomized artifact frequency)
    artifact_freq = 4000 + np.random.uniform(-500, 500)
    synth_artifact = 0.2 * np.sin(2 * np.pi * artifact_freq * t)
    
    envelope = 0.8 + 0.1 * np.sin(2 * np.pi * 1 * t)
    
    final_audio = (audio + synth_artifact) * envelope
    sf.write(filepath, final_audio, SR)

def run_validation():
    print("Generating Validation Dataset (10 Real, 10 AI)...")
    real_files = []
    for i in range(10):
        fp = os.path.join(VAL_REAL_DIR, f"val_real_{i+1}.wav")
        generate_real_audio(fp, i)
        real_files.append(fp)
        
    fake_files = []
    for i in range(10):
        fp = os.path.join(VAL_FAKE_DIR, f"val_fake_{i+1}.wav")
        generate_fake_audio(fp, i)
        fake_files.append(fp)
        
    print("\n--- Testing Model on Validation Set ---")
    
    real_scores = []
    for f in real_files:
        res = analyze_audio_features(f)
        score = res["synthetic_probability"]
        real_scores.append(score)
    
    fake_scores = []
    for f in fake_files:
        res = analyze_audio_features(f)
        score = res["synthetic_probability"]
        fake_scores.append(score)
        
    print(f"\nReal Audio Results:")
    print(f"Average Synthetic Probability: {np.mean(real_scores):.3f} (Ideal: < 0.50)")
    for i, s in enumerate(real_scores):
        print(f"  File {i+1}: {s*100:.1f}% AI")
        
    print(f"\nAI Audio Results:")
    print(f"Average Synthetic Probability: {np.mean(fake_scores):.3f} (Ideal: > 0.50)")
    for i, s in enumerate(fake_scores):
        print(f"  File {i+1}: {s*100:.1f}% AI")
        
    tn = sum(1 for s in real_scores if s < 0.50)
    tp = sum(1 for s in fake_scores if s >= 0.50)
    accuracy = (tn + tp) / 20.0
    
    print("\n===============================")
    print("      VALIDATION RESULTS       ")
    print("===============================")
    print(f"Accuracy on unseen data: {accuracy * 100:.2f}%")

if __name__ == "__main__":
    run_validation()
