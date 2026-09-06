from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.rto_record import RTORecord

async def get_rto_by_plate(session: AsyncSession, plate_number: str) -> Optional[RTORecord]:
    clean_plate = plate_number.strip().upper()
    result = await session.execute(
        select(RTORecord).where(func.upper(RTORecord.plate_number) == clean_plate)
    )
    return result.scalars().first()
