from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, JSON, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    rtsp_url = Column(String(256), nullable=False)
    status = Column(String(32), default="ONLINE") # ONLINE, OFFLINE, DEGRADED
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    zone = Column(String(64), default="Downtown")
    fps = Column(Float, default=25.0)
    bitrate_kbps = Column(Integer, default=4096)
    last_ping = Column(DateTime, default=datetime.utcnow)

    detections = relationship("VehicleDetection", back_populates="camera")
    alerts = relationship("Alert", back_populates="camera")


class VehicleDetection(Base):
    __tablename__ = "vehicle_detections"

    id = Column(String(64), primary_key=True, index=True)
    camera_id = Column(String(64), ForeignKey("cameras.id"), index=True)
    track_id = Column(Integer, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    vehicle_class = Column(String(32), nullable=False) # car, motorcycle, truck, bus
    bbox = Column(JSON, nullable=False) # {x_min, y_min, x_max, y_max}
    confidence = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0)
    direction_deg = Column(Float, default=0.0)
    color = Column(String(32), nullable=True)
    make = Column(String(64), nullable=True)
    plate_number = Column(String(32), index=True, nullable=True)
    plate_confidence = Column(Float, nullable=True)
    plate_crop_url = Column(String(512), nullable=True)

    camera = relationship("Camera", back_populates="detections")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, index=True)
    camera_id = Column(String(64), ForeignKey("cameras.id"), index=True)
    alert_type = Column(String(64), index=True) # STOLEN_VEHICLE, BLACKLIST_MATCH, OVERSPEEDING
    severity = Column(String(32), default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    plate_number = Column(String(32), index=True, nullable=True)
    details = Column(JSON, default=dict)
    acknowledged = Column(Boolean, default=False)

    camera = relationship("Camera", back_populates="alerts")


class VehicleJourneyWaypoint(Base):
    __tablename__ = "vehicle_journey_waypoints"

    id = Column(Integer, primary_key=True, autoincrement=True)
    plate_number = Column(String(32), index=True, nullable=False)
    camera_id = Column(String(64), ForeignKey("cameras.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0)
    snapshot_url = Column(String(512), nullable=True)
