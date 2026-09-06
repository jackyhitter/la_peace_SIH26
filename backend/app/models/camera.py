from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Date, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String(16), primary_key=True, index=True)  # e.g. 'CAM-01'
    label = Column(String(128), nullable=False)            # e.g. 'Sector 1 / Jan Marg'
    sector = Column(String(64), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(16), nullable=False, default="active")  # 'active' | 'fault' | 'offline'
    installed_at = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    plate_events = relationship("PlateEvent", back_populates="camera")
    alerts = relationship("Alert", back_populates="camera")
    traffic_stats = relationship("TrafficStat", back_populates="camera")
