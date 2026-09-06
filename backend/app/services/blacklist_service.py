from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from app.models.blacklist import Blacklist
from app.schemas.blacklist import BlacklistOut, BlacklistCreate

async def get_all_blacklist(session: AsyncSession) -> List[BlacklistOut]:
    result = await session.execute(
        select(Blacklist).options(joinedload(Blacklist.operator)).where(Blacklist.is_active == True).order_by(Blacklist.added_at.desc())
    )
    entries = result.scalars().all()
    output = []
    for item in entries:
        output.append(BlacklistOut(
            id=item.id,
            plate_number=item.plate_number,
            reason=item.reason,
            added_by_name=item.operator.display_name or item.operator.username if item.operator else "Admin",
            added_at=item.added_at,
            is_active=item.is_active
        ))
    return output

async def get_blacklist_by_plate(session: AsyncSession, plate_number: str) -> Optional[BlacklistOut]:
    clean_plate = plate_number.strip().upper()
    result = await session.execute(
        select(Blacklist).options(joinedload(Blacklist.operator)).where(
            func.upper(Blacklist.plate_number) == clean_plate,
            Blacklist.is_active == True
        )
    )
    item = result.scalars().first()
    if not item:
        return None
    return BlacklistOut(
        id=item.id,
        plate_number=item.plate_number,
        reason=item.reason,
        added_by_name=item.operator.display_name or item.operator.username if item.operator else "Admin",
        added_at=item.added_at,
        is_active=item.is_active
    )

async def create_blacklist_entry(
    session: AsyncSession,
    entry: BlacklistCreate,
    operator_id: Optional[int] = None
) -> BlacklistOut:
    clean_plate = entry.plate_number.strip().upper()
    existing = await session.execute(
        select(Blacklist).where(func.upper(Blacklist.plate_number) == clean_plate)
    )
    existing_item = existing.scalars().first()
    if existing_item:
        if existing_item.is_active:
            raise ValueError("Plate already on restricted list")
        existing_item.is_active = True
        existing_item.reason = entry.reason
        existing_item.added_by = operator_id
        existing_item.added_at = datetime.now(timezone.utc)
        await session.flush()
        return BlacklistOut(
            id=existing_item.id,
            plate_number=existing_item.plate_number,
            reason=existing_item.reason,
            added_by_name="Admin",
            added_at=existing_item.added_at,
            is_active=True
        )

    db_item = Blacklist(
        plate_number=clean_plate,
        reason=entry.reason,
        added_by=operator_id,
        added_at=datetime.now(timezone.utc),
        is_active=True
    )
    session.add(db_item)
    await session.flush()
    await session.refresh(db_item)
    return BlacklistOut(
        id=db_item.id,
        plate_number=db_item.plate_number,
        reason=db_item.reason,
        added_by_name="Admin",
        added_at=db_item.added_at,
        is_active=True
    )

async def delete_blacklist_entry(session: AsyncSession, item_id: int) -> bool:
    result = await session.execute(select(Blacklist).where(Blacklist.id == item_id))
    item = result.scalars().first()
    if not item:
        return False
    await session.delete(item)
    await session.flush()
    return True
