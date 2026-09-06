from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.rto import RTORecordOut
from app.services.rto_service import get_rto_by_plate

router = APIRouter(prefix="/rto", tags=["rto"])

@router.get("/lookup", response_model=Optional[RTORecordOut])
async def lookup_rto(
    plate: str = Query(..., min_length=2, description="Vehicle plate number to look up"),
    db: AsyncSession = Depends(get_db)
):
    record = await get_rto_by_plate(session=db, plate_number=plate)
    if not record:
        return None
    return record
