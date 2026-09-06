import asyncio
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.blacklist import Blacklist
from app.models.operator import Operator

BLACKLIST_DATA = [
    {
        "plate_number": "PB10AB1234",
        "reason": "Stolen vehicle — FIR No. 0342/2024, PS Sector 17, Chandigarh",
        "added_at": "2025-06-10T09:30:00Z"
    },
    {
        "plate_number": "HR26AB5678",
        "reason": "Warrant issued — outstanding non-bailable challan x4, Chandigarh Traffic Police",
        "added_at": "2025-06-11T14:15:00Z"
    },
    {
        "plate_number": "PB65X7788",
        "reason": "Hit and run investigation — FIR No. 0891/2024, PS Sector 36",
        "added_at": "2025-06-12T11:45:00Z"
    },
    {
        "plate_number": "HR03E4455",
        "reason": "Suspended RC — Fake registration documentation probe (Panchkula RTO)",
        "added_at": "2025-06-12T16:20:00Z"
    },
    {
        "plate_number": "CH04K5566",
        "reason": "Vehicle flagged by Punjab Police Special Cell — surveillance alert",
        "added_at": "2025-06-13T08:00:00Z"
    },
    {
        "plate_number": "PB02DG6611",
        "reason": "Wanted in interstate theft syndicate — Crime Branch Mohali alert",
        "added_at": "2025-06-13T18:30:00Z"
    }
]

async def seed_blacklist(session: AsyncSession):
    # Retrieve first operator if available
    op_res = await session.execute(select(Operator).limit(1))
    operator = op_res.scalars().first()
    op_id = operator.id if operator else None

    for b_data in BLACKLIST_DATA:
        exists = await session.execute(
            select(Blacklist).where(Blacklist.plate_number == b_data["plate_number"])
        )
        if not exists.scalars().first():
            added_at = datetime.fromisoformat(b_data["added_at"].replace("Z", "+00:00"))
            item = Blacklist(
                plate_number=b_data["plate_number"],
                reason=b_data["reason"],
                added_by=op_id,
                added_at=added_at,
                is_active=True
            )
            session.add(item)
    await session.commit()
    print(f"Seeded {len(BLACKLIST_DATA)} blacklisted vehicles.")

if __name__ == "__main__":
    from app.db.session import async_session_factory
    async def main():
        async with async_session_factory() as session:
            await seed_blacklist(session)
    asyncio.run(main())
