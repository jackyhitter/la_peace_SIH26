from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.camera import CameraOut, CameraSummaryOut
from app.services.camera_service import get_all_cameras, get_camera_summary, get_camera_by_id

router = APIRouter(prefix="/cameras", tags=["cameras"])

@router.get("", response_model=List[CameraOut])
async def list_cameras(db: AsyncSession = Depends(get_db)):
    return await get_all_cameras(db)

@router.get("/summary", response_model=CameraSummaryOut)
async def camera_summary(db: AsyncSession = Depends(get_db)):
    return await get_camera_summary(db)

@router.get("/{camera_id}", response_model=CameraOut)
async def get_camera(camera_id: str, db: AsyncSession = Depends(get_db)):
    camera = await get_camera_by_id(db, camera_id)
    if not camera:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Camera not found")
    return camera
