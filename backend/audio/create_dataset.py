import os
import numpy as np
import soundfile as sf
import scipy.signal as signal

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "audio_dataset")
REAL_DIR = os.path.join(DATA_DIR, "real")
FAKE_DIR = os.path.join(DATA_DIR, "fake")

os.makedirs(REAL_DIR, exist_ok=True)
os.makedirs(FAKE_DIR, exist_ok=True)

SR = 16000
DURATION = 5  # seconds

def generate_real_audio(filepath):
    """
    Simulates real human speech: 
    High variance in spectral flatness (dynamic envelope, pauses, plosives)
    ZCR roughly around 0.10.
    """
    t = np.linspace(0, DURATION, SR * DURATION, endpoint=False)
    # Base frequency mimicking voice fundamental
    audio = 0.5 * np.sin(2 * np.pi * 200 * t)
    
    # Add broadband noise (fricatives)
    noise = np.random.normal(0, 0.1, len(t))
    
    # Apply a highly dynamic, bursting envelope (high variance)
    envelope = np.abs(np.sin(2 * np.pi * 2 * t) * np.cos(2 * np.pi * 0.5 * t))
    envelope[envelope < 0.2] = 0.0 # simulate pauses
    
    final_audio = (audio + noise) * envelope
    
    # Filter to human speech range to get right ZCR
    b, a = signal.butter(4, [300, 3400], btype='bandpass', fs=SR)
    final_audio = signal.filtfilt(b, a, final_audio)
    
    sf.write(filepath, final_audio, SR)

def generate_fake_audio(filepath):
    """
    Simulates AI TTS / Deepfake speech:
    Very smooth envelope (low variance in spectral flatness).
    Unnatural high-frequency artifacts causing ZCR anomalies.
    """
    t = np.linspace(0, DURATION, SR * DURATION, endpoint=False)
    # Monotonic base
    audio = 0.5 * np.sin(2 * np.pi * 200 * t)
    
    # Add a synthetic high-frequency hum (causes ZCR to be too high or unnatural)
    synth_artifact = 0.2 * np.sin(2 * np.pi * 4000 * t)
    
    # Smooth, low-variance envelope (like a bad robotic TTS)
    envelope = 0.8 + 0.1 * np.sin(2 * np.pi * 1 * t)
    
    final_audio = (audio + synth_artifact) * envelope
    sf.write(filepath, final_audio, SR)

def main():
    print("Generating 10 Simulated 'Real' human audio files...")
    for i in range(10):
        fp = os.path.join(REAL_DIR, f"real_{i+1}.wav")
        generate_real_audio(fp)
        print(f"Saved {fp}")
        
    print("\nGenerating 10 Simulated 'AI' synthetic audio files...")
    for i in range(10):
        fp = os.path.join(FAKE_DIR, f"fake_{i+1}.wav")
        generate_fake_audio(fp)
        print(f"Saved {fp}")
        
    print("\nDataset generation complete!")

if __name__ == "__main__":
    main()
