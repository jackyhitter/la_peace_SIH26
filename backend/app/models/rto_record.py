from sqlalchemy import Column, Integer, String, Date
from app.db.base import Base

class RTORecord(Base):
    __tablename__ = "rto_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    plate_number = Column(String(16), unique=True, nullable=False, index=True)
    owner_name = Column(String(128), nullable=False)
    vehicle_make = Column(String(64), nullable=True)
    vehicle_model = Column(String(64), nullable=True)
    vehicle_color = Column(String(32), nullable=True)
    registration_state = Column(String(32), nullable=True)
    registration_year = Column(Integer, nullable=True)
    chassis_number = Column(String(32), nullable=True)
    insurance_valid_until = Column(Date, nullable=True)
    status = Column(String(16), default="active")  # 'active' | 'expired' | 'suspended'
