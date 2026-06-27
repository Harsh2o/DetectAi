import os
import concurrent.futures

from image.branches.metadata import check_provenance
from image.branches.ela import analyze_ela
from image.branches.fft_cnn import analyze_fft_cnn
from image.branches.prnu_residual import analyze_prnu_residual
from image.branches.deep_classifier import analyze_deep_classifier
from image.fusion import fuse_image_signals

def process_image_pipeline(temp_path: str, phash: str, original_filename: str = ""):
    """
    Simulated Worker Task.
    Dispatches the image to the 5 concurrent branches and fuses the results.
    """
    try:
        # We run the 5 heuristics concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_meta = executor.submit(check_provenance, temp_path, original_filename)
            future_ela = executor.submit(analyze_ela, temp_path, original_filename)
            future_fft = executor.submit(analyze_fft_cnn, temp_path, original_filename)
            future_prnu = executor.submit(analyze_prnu_residual, temp_path, original_filename)
            future_deep = executor.submit(analyze_deep_classifier, temp_path, original_filename)
            
            meta_res = future_meta.result()
            ela_res = future_ela.result()
            fft_res = future_fft.result()
            prnu_res = future_prnu.result()
            deep_res = future_deep.result()
            
        # Pass the results into the Fusion Meta-Classifier
        final_results = fuse_image_signals(
            metadata=meta_res,
            ela=ela_res,
            fft=fft_res,
            prnu=prnu_res,
            deep=deep_res
        )
        
        # Attach the Base64 heatmap from ELA directly to the root for the frontend
        final_results["consensus_heatmap"] = ela_res.get("heatmap", None)

        return {"phash": phash, "data": final_results}
        
    except Exception as e:
        print(f"Error in image pipeline: {e}")
        return {"phash": phash, "data": {
            "synthetic_probability": 0.0,
            "authenticity_score": 0.0,
            "novel_generator_probability": 0.0,
            "explanations": [f"Pipeline failed: {e}"]
        }}
        
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass
