import asyncio
import uuid
from typing import Dict
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks

router = APIRouter()

# In-memory store for audio task status
audio_tasks: Dict[str, dict] = {}

from audio.tasks import analyze_audio_features

async def process_audio(task_id: str, filepath: str):
    try:
        audio_tasks[task_id]["status"] = "processing"
        
        # Run the heavy audio extraction in a separate thread so it doesn't block FastAPI
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(None, analyze_audio_features, filepath)
        
        audio_tasks[task_id]["status"] = "completed"
        audio_tasks[task_id]["results"] = results
    except Exception as e:
        audio_tasks[task_id]["status"] = "failed"
        audio_tasks[task_id]["error"] = str(e)

@router.post("/audio")
async def analyze_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    task_id = str(uuid.uuid4())
    audio_tasks[task_id] = {"status": "processing"}
    
    # Save the file temporarily
    import os
    temp_filepath = f"temp_{task_id}_{file.filename}"
    with open(temp_filepath, "wb") as buffer:
        buffer.write(await file.read())
        
    # Run the processing in the background
    background_tasks.add_task(process_audio, task_id, temp_filepath)
    
    return {"task_id": task_id, "status": "processing"}

@router.get("/audio/status/{task_id}")
async def get_audio_status(task_id: str):
    if task_id not in audio_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = audio_tasks[task_id]
    
    if task_info["status"] == "completed":
        return {
            "status": "completed",
            "results": task_info["results"]
        }
    elif task_info["status"] == "failed":
        return {
            "status": "failed",
            "error": task_info.get("error", "Unknown error")
        }
    else:
        return {"status": task_info["status"]}
