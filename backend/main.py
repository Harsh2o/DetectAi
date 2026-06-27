from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from text import router as text_router
from video import router as video_router
from image import router as image_router
from audio import router as audio_router
import history

# Create the database tables if they don't exist
history.init_db()

app = FastAPI(title="DetectAi Agentic Pipeline")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text_router.router, prefix="/detect", tags=["Text"])
app.include_router(video_router.router, prefix="/detect", tags=["Video"])
app.include_router(image_router.router, prefix="/detect", tags=["Image"])
app.include_router(audio_router.router, prefix="/detect", tags=["Audio"])
app.include_router(history.router, prefix="/api/history", tags=["History"])

@app.get("/")
def root():
    return {"status": "Online - Enterprise Text & Image Engines Active"}
