from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime
from app.db.base import Base

class OCREvalRun(Base):
    __tablename__ = "ocr_eval_runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    run_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    dataset_name = Column(String(128), nullable=True)
    total_images = Column(Integer, nullable=True)
    correct_reads = Column(Integer, nullable=True)
    accuracy = Column(Numeric(5, 2), nullable=True)
    notes = Column(Text, nullable=True)
