from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.base import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(String(32), nullable=False)  # 'blacklisted_vehicle' | 'camera_fault' | 'wrong_way' | 'speeding'
    severity = Column(String(16), nullable=False)  # 'critical' | 'warning'
    camera_id = Column(String(16), ForeignKey("cameras.id"), nullable=True, index=True)
    plate_number = Column(String(16), nullable=True, index=True)
    description = Column(Text, nullable=True)
    status = Column(String(16), default="active", index=True)  # 'active' | 'resolved'
    resolved_by = Column(Integer, ForeignKey("operators.id"), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    camera = relationship("Camera", back_populates="alerts")
    resolver = relationship("Operator", foreign_keys=[resolved_by])

    __table_args__ = (
        Index("idx_alerts_status_created", "status", "created_at"),
    )
