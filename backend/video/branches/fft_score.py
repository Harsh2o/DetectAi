import cv2
import numpy as np

def analyze_fft(video_path: str, max_frames=5) -> float:
    print(f"[FFT Score] Analyzing {video_path}")
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if frame_count < 2: return 0.0
        
    step = max(1, frame_count // max_frames)
    fft_ratios = []
    
    for i in range(0, frame_count, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret: break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Fast Fourier Transform
        f = np.fft.fft2(gray)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)
        
        # Calculate high/low frequency ratio
        h, w = magnitude_spectrum.shape
        cy, cx = h // 2, w // 2
        r = min(cy, cx) // 4
        
        y, x = np.ogrid[-cy:h-cy, -cx:w-cx]
        mask = x*x + y*y <= r*r
        
        low_freq = magnitude_spectrum[mask]
        high_freq = magnitude_spectrum[~mask]
        
        if len(low_freq) > 0 and len(high_freq) > 0:
            ratio = np.mean(high_freq) / np.mean(low_freq)
            fft_ratios.append(ratio)
            
        if len(fft_ratios) >= max_frames:
            break
            
    cap.release()
    
    if not fft_ratios: return 0.0
    
    avg_ratio = float(np.mean(fft_ratios))
    
    # Scale ratio to confidence
    # Real videos typically have a ratio around 0.60 to 0.75
    # AI diffusion models (and aggressive H264 compression) spike it higher
    base_threshold = 0.70 
    anomaly_score = min(1.0, max(0.0, (avg_ratio - base_threshold) * 5.0))
    
    print(f"[FFT Score] Output: {anomaly_score:.3f} (Raw Ratio: {avg_ratio:.3f})")
    return anomaly_score
