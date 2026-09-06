import asyncio
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.alert import Alert
from app.models.operator import Operator

ALERTS_DATA = [
    {
        "type": "blacklisted_vehicle",
        "severity": "critical",
        "camera_id": "CAM-07",
        "plate_number": "PB10AB1234",
        "description": "Blacklisted vehicle spotted — Stolen vehicle FIR No. 0342/2024",
        "status": "active",
        "created_at": "2025-06-14T14:31:09Z",
        "resolved_at": None
    },
    {
        "type": "blacklisted_vehicle",
        "severity": "critical",
        "camera_id": "CAM-12",
        "plate_number": "HR26AB5678",
        "description": "Warrant vehicle detected at PGI Gate — Outstanding NBWs",
        "status": "active",
        "created_at": "2025-06-14T14:20:15Z",
        "resolved_at": None
    },
    {
        "type": "camera_fault",
        "severity": "warning",
        "camera_id": "CAM-31",
        "plate_number": None,
        "description": "Camera offline — Sector 31 Air Force Station node unreachable for >2h",
        "status": "active",
        "created_at": "2025-06-14T13:58:00Z",
        "resolved_at": None
    },
    {
        "type": "camera_fault",
        "severity": "warning",
        "camera_id": "CAM-44",
        "plate_number": None,
        "description": "Camera feed intermittent — signal loss and frame drop detected",
        "status": "active",
        "created_at": "2025-06-14T13:45:00Z",
        "resolved_at": None
    },
    {
        "type": "speeding",
        "severity": "warning",
        "camera_id": "CAM-09",
        "plate_number": "CH01CD9012",
        "description": "Speed violation: 84 km/h in 50 km/h corridor on Himalaya Marg",
        "status": "active",
        "created_at": "2025-06-14T13:12:40Z",
        "resolved_at": None
    },
    {
        "type": "wrong_way",
        "severity": "warning",
        "camera_id": "CAM-16",
        "plate_number": "HR70D8899",
        "description": "Wrong way navigation detected on Sector 17 North feeder lane",
        "status": "resolved",
        "created_at": "2025-06-14T11:05:00Z",
        "resolved_at": "2025-06-14T11:45:20Z"
    },
    {
        "type": "blacklisted_vehicle",
        "severity": "critical",
        "camera_id": "CAM-22",
        "plate_number": "PB65X7788",
        "description": "Hit and run flagged vehicle spotted at Sector 22 Market",
        "status": "resolved",
        "created_at": "2025-06-14T09:15:30Z",
        "resolved_at": "2025-06-14T10:10:00Z"
    },
    {
        "type": "camera_fault",
        "severity": "warning",
        "camera_id": "CAM-05",
        "plate_number": None,
        "description": "Temporary optics degradation — autofocus re-calibrated successfully",
        "status": "resolved",
        "created_at": "2025-06-14T07:20:00Z",
        "resolved_at": "2025-06-14T07:55:00Z"
    }
]

async def seed_alerts(session: AsyncSession):
    op_res = await session.execute(select(Operator).limit(1))
    operator = op_res.scalars().first()
    op_id = operator.id if operator else None

    for a_data in ALERTS_DATA:
        exists = await session.execute(
            select(Alert).where(
                Alert.type == a_data["type"],
                Alert.camera_id == a_data["camera_id"],
                Alert.created_at == datetime.fromisoformat(a_data["created_at"].replace("Z", "+00:00"))
            )
        )
        if not exists.scalars().first():
            created_at = datetime.fromisoformat(a_data["created_at"].replace("Z", "+00:00"))
            resolved_at = datetime.fromisoformat(a_data["resolved_at"].replace("Z", "+00:00")) if a_data.get("resolved_at") else None
            alert = Alert(
                type=a_data["type"],
                severity=a_data["severity"],
                camera_id=a_data["camera_id"],
                plate_number=a_data["plate_number"],
                description=a_data["description"],
                status=a_data["status"],
                resolved_by=op_id if a_data["status"] == "resolved" else None,
                resolved_at=resolved_at,
                created_at=created_at
            )
            session.add(alert)
    await session.commit()
    print(f"Seeded {len(ALERTS_DATA)} alert records.")

if __name__ == "__main__":
    from app.db.session import async_session_factory
    async def main():
        async with async_session_factory() as session:
            await seed_alerts(session)
    asyncio.run(main())
