import os
import glob
import librosa
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "audio_dataset")

def analyze_dir(dirname):
    files = glob.glob(os.path.join(DATA_DIR, dirname, "*.wav"))
    for f in files[:2]:
        y, sr = librosa.load(f, sr=16000)
        rms = librosa.feature.rms(y=y)[0]
        cent = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        print(f"{os.path.basename(f)}: RMS Var: {np.var(rms):.6f}, Centroid Mean: {np.mean(cent):.1f}")

print("--- REAL ---")
analyze_dir("real")
analyze_dir("val_real")

print("\n--- FAKE ---")
analyze_dir("fake")
analyze_dir("val_fake")
