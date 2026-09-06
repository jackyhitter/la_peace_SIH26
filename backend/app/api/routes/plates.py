from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.plate import (
    PlateLogsResponse,
    PlateSearchResponse,
    PlateIngestRequest,
    PlateIngestResponse
)
from app.services.plate_service import get_plate_logs, search_plate, ingest_plate_event

router = APIRouter(prefix="/plates", tags=["plates"])

@router.get("/logs", response_model=PlateLogsResponse)
async def list_plate_logs(
    camera_id: Optional[str] = Query(None, description="Camera ID to filter by"),
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    confidence_min: Optional[float] = Query(None, description="Minimum confidence threshold"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=200, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    return await get_plate_logs(
        session=db,
        camera_id=camera_id,
        date_filter=date,
        confidence_min=confidence_min,
        page=page,
        limit=limit
    )

@router.get("/search", response_model=PlateSearchResponse)
async def search_plate_records(
    plate: str = Query(..., min_length=2, description="Plate number (case-insensitive)"),
    db: AsyncSession = Depends(get_db)
):
    return await search_plate(session=db, plate_number=plate)

@router.post("/ingest", response_model=PlateIngestResponse, status_code=status.HTTP_201_CREATED)
async def ingest_plate(
    payload: PlateIngestRequest,
    db: AsyncSession = Depends(get_db)
):
    event_id = await ingest_plate_event(session=db, data=payload)
    return PlateIngestResponse(id=event_id)
