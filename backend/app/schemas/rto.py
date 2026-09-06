from pydantic import BaseModel
from typing import Optional
from datetime import date

class RTORecordOut(BaseModel):
    plate_number: str
    owner_name: str
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_color: Optional[str] = None
    registration_state: Optional[str] = None
    registration_year: Optional[int] = None
    chassis_number: Optional[str] = None
    insurance_valid_until: Optional[date] = None
    status: Optional[str] = "active"

    class Config:
        from_attributes = True
