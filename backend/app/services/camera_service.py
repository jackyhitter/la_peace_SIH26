from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.camera import Camera
from app.schemas.camera import CameraSummaryOut

async def get_all_cameras(session: AsyncSession) -> List[Camera]:
    result = await session.execute(select(Camera).order_by(Camera.id))
    return list(result.scalars().all())

async def get_camera_by_id(session: AsyncSession, camera_id: str) -> Optional[Camera]:
    result = await session.execute(select(Camera).where(Camera.id == camera_id))
    return result.scalars().first()

async def get_camera_summary(session: AsyncSession) -> CameraSummaryOut:
    result = await session.execute(
        select(Camera.status, func.count(Camera.id)).group_by(Camera.status)
    )
    counts = dict(result.all())
    active = counts.get("active", 0)
    fault = counts.get("fault", 0)
    offline = counts.get("offline", 0)
    total = active + fault + offline
    return CameraSummaryOut(
        total=total,
        active=active,
        fault=fault,
        offline=offline
    )
