from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import concurrent.futures
from image.tasks import process_image_pipeline
import shutil
import os
import imagehash
from PIL import Image
import uuid

router = APIRouter()

# Local perceptual hash cache (simulating Redis for now)
IMAGE_CACHE = {}

# Local ProcessPool for mimicking Celery workers
process_pool = concurrent.futures.ProcessPoolExecutor(max_workers=2)

# Dictionary to store futures for status polling
TASK_FUTURES = {}

@router.post("/image")
async def analyze_image(file: UploadFile = File(...)):
    """
    FastAPI Gateway: Validates the file, computes a perceptual hash, 
    and checks the Redis (simulated) cache for a cached verdict.
    If it's a cache miss, it pushes the job to the Process Pool queue.
    """
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        raise HTTPException(status_code=400, detail="Invalid image format.")

    try:
        # Save temp file
        temp_path = f"temp_upload_{os.urandom(4).hex()}{os.path.splitext(file.filename)[1]}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Compute Perceptual Hash (pHash)
        img = Image.open(temp_path)
        phash = str(imagehash.phash(img))
        img.close()
        
        # Check Cache
        if phash in IMAGE_CACHE:
            os.remove(temp_path)
            return JSONResponse(content={
                "status": "cached",
                "message": "Immediate cache hit",
                "results": IMAGE_CACHE[phash]
            })
            
        # Cache Miss -> Push to Task Queue (Simulating Celery with ProcessPool)
        task_id = str(uuid.uuid4())
        future = process_pool.submit(process_image_pipeline, temp_path, phash, file.filename)
        TASK_FUTURES[task_id] = future
        
        return JSONResponse(content={
            "status": "processing",
            "task_id": task_id,
            "message": "Image sent to Task Queue."
        })

    except Exception as e:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/image/status/{task_id}")
async def get_image_status(task_id: str):
    """
    Poll endpoint for the frontend to check task status.
    """
    if task_id not in TASK_FUTURES:
        return {"status": "failed", "error": "Task not found."}
        
    future = TASK_FUTURES[task_id]
    
    if not future.done():
        return {"status": "pending"}
    else:
        try:
            result = future.result()
            # Update cache (in reality, the worker would write directly to Redis)
            if "phash" in result:
                IMAGE_CACHE[result["phash"]] = result["data"]
            return {"status": "completed", "results": result["data"]}
        except Exception as e:
            return {"status": "failed", "error": str(e)}
