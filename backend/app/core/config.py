import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "SIH26 CCTV ANPR Platform"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://sih_user:sih_password@localhost:5432/sih_db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")

settings = Settings()
