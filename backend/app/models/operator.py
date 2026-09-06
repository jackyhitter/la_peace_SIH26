from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db.base import Base

class Operator(Base):
    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    display_name = Column(String(128), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
