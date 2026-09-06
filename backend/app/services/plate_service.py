import math
from typing import Optional, List
from datetime import datetime, date, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import joinedload
from app.models.plate_event import PlateEvent
from app.models.camera import Camera
from app.models.blacklist import Blacklist
from app.models.alert import Alert
from app.schemas.plate import PlateLog, PlateLogsResponse, PlateSearchResponse, PlateIngestRequest
from app.services.rto_service import get_rto_by_plate
from app.services.blacklist_service import get_blacklist_by_plate

async def get_plate_logs(
    session: AsyncSession,
    camera_id: Optional[str] = None,
    date_filter: Optional[str] = None,
    confidence_min: Optional[float] = None,
    page: int = 1,
    limit: int = 50
) -> PlateLogsResponse:
    # Build query
    filters = []
    if camera_id and camera_id != "all":
        filters.append(PlateEvent.camera_id == camera_id)
    if date_filter:
        try:
            target_date = datetime.strptime(date_filter, "%Y-%m-%d").date()
            # Compatible with both postgres and sqlite datetime storage
            start_dt = datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0, tzinfo=timezone.utc)
            end_dt = datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59, 999999, tzinfo=timezone.utc)
            filters.append(PlateEvent.event_time >= start_dt)
            filters.append(PlateEvent.event_time <= end_dt)
        except ValueError:
            pass
    if confidence_min is not None:
        filters.append(PlateEvent.confidence >= confidence_min)

    # Count total
    count_stmt = select(func.count(PlateEvent.id))
    if filters:
        count_stmt = count_stmt.where(and_(*filters))
    total_res = await session.execute(count_stmt)
    total = total_res.scalar_one() or 0

    offset = (max(page, 1) - 1) * limit
    pages = math.ceil(total / limit) if total > 0 else 1

    # Fetch active blacklisted plates set
    bl_res = await session.execute(select(func.upper(Blacklist.plate_number)).where(Blacklist.is_active == True))
    blacklisted_plates = set(bl_res.scalars().all())

    # Fetch items with camera join
    query = (
        select(PlateEvent)
        .options(joinedload(PlateEvent.camera))
        .order_by(PlateEvent.event_time.desc())
    )
    if filters:
        query = query.where(and_(*filters))
    query = query.offset(offset).limit(limit)

    res = await session.execute(query)
    events = res.scalars().all()

    items: List[PlateLog] = []
    for ev in events:
        plate_up = ev.plate_number.upper() if ev.plate_number else ""
        items.append(PlateLog(
            id=ev.id,
            plate_number=ev.plate_number,
            camera_id=ev.camera_id,
            camera_label=ev.camera.label if ev.camera else ev.camera_id,
            sector=ev.camera.sector if ev.camera else "",
            confidence=float(ev.confidence) if ev.confidence is not None else None,
            event_time=ev.event_time,
            is_blacklisted=plate_up in blacklisted_plates
        ))

    return PlateLogsResponse(
        items=items,
        total=total,
        page=page,
        pages=pages
    )

async def search_plate(session: AsyncSession, plate_number: str) -> PlateSearchResponse:
    clean_plate = plate_number.strip().upper()
    
    # Check blacklist
    bl_entry = await get_blacklist_by_plate(session, clean_plate)
    
    # Check RTO record
    rto_record = await get_rto_by_plate(session, clean_plate)

    # Fetch plate events
    res = await session.execute(
        select(PlateEvent)
        .options(joinedload(PlateEvent.camera))
        .where(func.upper(PlateEvent.plate_number) == clean_plate)
        .order_by(PlateEvent.event_time.desc())
    )
    events = res.scalars().all()

    logs: List[PlateLog] = []
    for ev in events:
        logs.append(PlateLog(
            id=ev.id,
            plate_number=ev.plate_number,
            camera_id=ev.camera_id,
            camera_label=ev.camera.label if ev.camera else ev.camera_id,
            sector=ev.camera.sector if ev.camera else "",
            confidence=float(ev.confidence) if ev.confidence is not None else None,
            event_time=ev.event_time,
            is_blacklisted=bl_entry is not None
        ))

    return PlateSearchResponse(
        plate_number=clean_plate,
        events=logs,
        rto=rto_record,
        blacklist_entry=bl_entry
    )

async def ingest_plate_event(session: AsyncSession, data: PlateIngestRequest) -> int:
    clean_plate = data.plate_number.strip().upper()
    event = PlateEvent(
        plate_number=clean_plate,
        camera_id=data.camera_id,
        confidence=data.confidence,
        ocr_raw=data.ocr_raw or data.plate_number,
        event_time=data.event_time,
        created_at=datetime.now(timezone.utc)
    )
    session.add(event)
    await session.flush()
    await session.refresh(event)

    # Auto-trigger alert if blacklisted
    bl_entry = await get_blacklist_by_plate(session, clean_plate)
    if bl_entry:
        alert = Alert(
            type="blacklisted_vehicle",
            severity="critical",
            camera_id=data.camera_id,
            plate_number=clean_plate,
            description=f"Blacklisted vehicle detected: {bl_entry.reason}",
            status="active",
            created_at=data.event_time
        )
        session.add(alert)
        await session.flush()

    return event.id
