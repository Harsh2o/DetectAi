import os
import glob
import numpy as np
from video.branches.vit_ensemble import analyze_vit_ensemble
from video.branches.prnu_score import analyze_prnu
from video.branches.fft_score import analyze_fft
from video.branches.temporal_consistency import analyze_temporal_consistency
from video.branches.motion_physics import analyze_motion_physics
from video.branches.depth_physics import analyze_depth_physics
from video.branches.semantic_drift import analyze_semantic_drift
from video.branches.cloud_api import analyze_cloud_api

def analyze_video_pipeline(video_path):
    vit_score = analyze_vit_ensemble(video_path, max_frames=15)
    prnu_score = analyze_prnu(video_path, max_frames=10)
    fft_score = analyze_fft(video_path, max_frames=5)
    temporal_score = analyze_temporal_consistency(video_path, max_frames=10)
    motion_score = analyze_motion_physics(video_path, num_pairs=3)
    depth_score = analyze_depth_physics(video_path, max_frames=10)
    semantic_score = analyze_semantic_drift(video_path, max_frames=15)
    
    w_vit = 0.35
    w_prnu = 0.05
    w_fft = 0.05
    w_temporal = 0.10
    w_motion = 0.10
    w_depth = 0.15
    w_semantic = 0.20
    
    final_confidence = (
        vit_score * w_vit +
        prnu_score * w_prnu +
        fft_score * w_fft +
        temporal_score * w_temporal +
        motion_score * w_motion +
        depth_score * w_depth +
        semantic_score * w_semantic
    )
    
    if vit_score > 0.85:
        final_confidence = max(final_confidence, vit_score)
        
    cloud_score = analyze_cloud_api(video_path)
    if cloud_score > 0.5:
        print("[CRITICAL] Cloud Override Activated! Overriding local scores.")
        final_confidence = cloud_score
        
    return min(1.0, final_confidence)

print("--- EVALUATING VIDEO RESOURCES (CLOUD OVERRIDE PIPELINE) ---")
video_res_dir = r"c:\Users\hemla\Downloads\inter\Video Resources"
vids = glob.glob(os.path.join(video_res_dir, "*.mp4"))

if not vids:
    print("No videos found in Video Resources!")

for v in vids:
    score = analyze_video_pipeline(v)
    prediction = "AI" if score > 0.5 else "Real"
    print(f"{os.path.basename(v)} -> Predicted: {prediction} (Confidence: {score*100:.1f}%)")
