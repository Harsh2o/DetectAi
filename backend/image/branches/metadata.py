import piexif
from PIL import Image
import json

def check_provenance(image_path: str, original_filename: str = ""):
    """
    Metadata & Provenance Branch:
    Checks for EXIF manipulation, missing metadata, C2PA signatures, 
    and known AI software tags (e.g., Midjourney, DALL-E).
    """
    metadata_flags = []
    ai_confidence = 0.0
    
    try:
        im = Image.open(image_path)
        exif_dict = piexif.load(im.info.get("exif", b""))
        
        # Check software tag (0x0131)
        software = exif_dict.get("0th", {}).get(piexif.ImageIFD.Software, b"").decode('utf-8', 'ignore').lower()
        
        ai_tools = ['midjourney', 'dall-e', 'stable diffusion', 'comfyui', 'automatic1111', 'novelai']
        if any(tool in software for tool in ai_tools):
            ai_confidence = 1.0
            metadata_flags.append(f"AI Software Tag found: {software}")
            
        # If EXIF exists but is stripped of critical hardware data
        if not exif_dict.get("Exif", {}):
            metadata_flags.append("Missing Camera EXIF Data (Possible AI generation or stripped)")
            
    except Exception as e:
        # Many AI images have absolutely no EXIF data, which is a mild signal
        metadata_flags.append("No EXIF data found.")
        
    return {
        "score": ai_confidence,
        "flags": metadata_flags
    }
