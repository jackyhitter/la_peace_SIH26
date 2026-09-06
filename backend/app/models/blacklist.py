from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Blacklist(Base):
    __tablename__ = "blacklist"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    plate_number = Column(String(16), unique=True, nullable=False, index=True)
    reason = Column(Text, nullable=False)
    added_by = Column(Integer, ForeignKey("operators.id"), nullable=True)
    added_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    is_active = Column(Boolean, default=True)

    operator = relationship("Operator")
