import sqlite3
from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from datetime import datetime
import os

router = APIRouter()

DB_PATH = "scans.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS scan_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            modality TEXT,
            content_snippet TEXT,
            prediction TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Pydantic models
class ScanCreate(BaseModel):
    user_id: str
    modality: str
    content_snippet: str
    prediction: str
    confidence: float

class ScanResponse(BaseModel):
    id: int
    user_id: str
    modality: str
    content_snippet: str
    prediction: str
    confidence: float
    timestamp: str

@router.post("/", response_model=ScanResponse)
def save_scan(scan: ScanCreate):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO scan_history (user_id, modality, content_snippet, prediction, confidence) VALUES (?, ?, ?, ?, ?)",
        (scan.user_id, scan.modality, scan.content_snippet, scan.prediction, scan.confidence)
    )
    scan_id = c.lastrowid
    conn.commit()
    
    c.execute("SELECT id, user_id, modality, content_snippet, prediction, confidence, timestamp FROM scan_history WHERE id = ?", (scan_id,))
    row = c.fetchone()
    conn.close()
    
    return {
        "id": row[0],
        "user_id": row[1],
        "modality": row[2],
        "content_snippet": row[3],
        "prediction": row[4],
        "confidence": row[5],
        "timestamp": row[6]
    }

@router.get("/{user_id}", response_model=List[ScanResponse])
def get_user_history(user_id: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, user_id, modality, content_snippet, prediction, confidence, timestamp FROM scan_history WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    rows = c.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "user_id": row[1],
            "modality": row[2],
            "content_snippet": row[3],
            "prediction": row[4],
            "confidence": row[5],
            "timestamp": row[6]
        })
    return results
