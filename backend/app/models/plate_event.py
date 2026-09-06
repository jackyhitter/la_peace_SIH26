from datetime import datetime, timezone
from sqlalchemy import Column, Integer, BigInteger, String, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.base import Base

class PlateEvent(Base):
    __tablename__ = "plate_events"

    # with_variant ensures BigInteger on Postgres and Integer autoincrement on SQLite
    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    plate_number = Column(String(16), nullable=False, index=True)
    camera_id = Column(String(16), ForeignKey("cameras.id"), nullable=False, index=True)
    confidence = Column(Numeric(5, 2), nullable=True)  # 0.00 to 100.00
    ocr_raw = Column(String(32), nullable=True)
    event_time = Column(DateTime(timezone=True), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    camera = relationship("Camera", back_populates="plate_events")

    __table_args__ = (
        Index("idx_plate_events_plate_time", "plate_number", "event_time"),
    )
