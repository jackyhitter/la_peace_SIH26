from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import joinedload
from app.models.alert import Alert
from app.models.camera import Camera
from app.schemas.alert import AlertOut, AlertListResponse

async def get_alerts(
    session: AsyncSession,
    status: Optional[str] = "active",
    severity: Optional[str] = None,
    page: int = 1,
    limit: int = 50
) -> AlertListResponse:
    filters = []
    if status and status.lower() != "all":
        filters.append(Alert.status == status.lower())
    if severity and severity.lower() != "all":
        filters.append(Alert.severity == severity.lower())

    count_stmt = select(func.count(Alert.id))
    if filters:
        count_stmt = count_stmt.where(and_(*filters))
    total_res = await session.execute(count_stmt)
    total = total_res.scalar_one() or 0

    offset = (max(page, 1) - 1) * limit
    query = (
        select(Alert)
        .options(joinedload(Alert.camera))
        .order_by(Alert.created_at.desc())
    )
    if filters:
        query = query.where(and_(*filters))
    query = query.offset(offset).limit(limit)

    res = await session.execute(query)
    alerts = res.scalars().all()

    items: List[AlertOut] = []
    for a in alerts:
        items.append(AlertOut(
            id=a.id,
            type=a.type,
            severity=a.severity,
            camera_id=a.camera_id,
            camera_label=a.camera.label if a.camera else (a.camera_id or "System"),
            plate_number=a.plate_number,
            description=a.description,
            status=a.status,
            created_at=a.created_at,
            resolved_at=a.resolved_at,
            resolved_by=a.resolved_by
        ))

    return AlertListResponse(items=items, total=total)

async def resolve_alert(
    session: AsyncSession,
    alert_id: int,
    operator_id: Optional[int] = None
) -> AlertOut:
    result = await session.execute(
        select(Alert).options(joinedload(Alert.camera)).where(Alert.id == alert_id)
    )
    alert = result.scalars().first()
    if not alert:
        raise KeyError("Alert not found")
    if alert.status == "resolved":
        raise ValueError("Alert already resolved")

    alert.status = "resolved"
    alert.resolved_by = operator_id
    alert.resolved_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(alert)

    return AlertOut(
        id=alert.id,
        type=alert.type,
        severity=alert.severity,
        camera_id=alert.camera_id,
        camera_label=alert.camera.label if alert.camera else (alert.camera_id or "System"),
        plate_number=alert.plate_number,
        description=alert.description,
        status=alert.status,
        created_at=alert.created_at,
        resolved_at=alert.resolved_at,
        resolved_by=alert.resolved_by
    )
