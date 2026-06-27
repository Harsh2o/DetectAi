from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    modality = Column(String, index=True) # text, image, audio, video
    content_snippet = Column(String)
    prediction = Column(String) # AI or Human
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
