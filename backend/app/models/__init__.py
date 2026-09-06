from app.models.operator import Operator
from app.models.camera import Camera
from app.models.plate_event import PlateEvent
from app.models.blacklist import Blacklist
from app.models.alert import Alert
from app.models.traffic_stat import TrafficStat
from app.models.rto_record import RTORecord
from app.models.ocr_eval import OCREvalRun

__all__ = [
    "Operator",
    "Camera",
    "PlateEvent",
    "Blacklist",
    "Alert",
    "TrafficStat",
    "RTORecord",
    "OCREvalRun",
]
