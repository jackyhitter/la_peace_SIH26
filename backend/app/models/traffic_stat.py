from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, PrimaryKeyConstraint, Index
from sqlalchemy.orm import relationship
from app.db.base import Base

class TrafficStat(Base):
    __tablename__ = "traffic_stats"

    bucket = Column(DateTime(timezone=True), nullable=False, primary_key=True)
    camera_id = Column(String(16), ForeignKey("cameras.id"), nullable=False, primary_key=True)
    vehicle_count = Column(Integer, nullable=False, default=0)
    plate_reads = Column(Integer, nullable=False, default=0)

    camera = relationship("Camera", back_populates="traffic_stats")

    __table_args__ = (
        PrimaryKeyConstraint("bucket", "camera_id"),
        Index("idx_traffic_stats_camera_bucket", "camera_id", "bucket"),
        Index("idx_traffic_stats_bucket_lookup", "bucket"),
    )
