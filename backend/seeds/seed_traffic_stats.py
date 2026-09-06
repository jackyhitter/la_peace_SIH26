import asyncio
import random
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.traffic_stat import TrafficStat
from app.models.camera import Camera

CAMERA_MULTIPLIERS = {
    # Sector 17, Madhya Marg, PGI, Aroma, Sector 22 - highest density
    "CAM-07": 1.45, "CAM-08": 1.40, "CAM-16": 1.50, "CAM-17": 1.42,
    "CAM-12": 1.35, "CAM-14": 1.30, "CAM-21": 1.25, "CAM-22": 1.38,
    "CAM-35": 1.20, "CAM-20": 1.15, "CAM-09": 1.18, "CAM-43": 1.22,
    # Fault cameras
    "CAM-31": 0.05, "CAM-44": 0.08,
}

def get_hourly_base_traffic(hour: int, minute: int) -> float:
    time_val = hour + (minute / 60.0)
    if time_val < 5.0:
        return 2.0 + (time_val * 0.8)
    elif time_val < 8.0:
        # 5:00 to 8:00 ramp up
        progress = (time_val - 5.0) / 3.0
        return 5.0 + (progress * 35.0)
    elif time_val < 10.5:
        # Morning peak (8:00 to 10:30)
        progress = 1.0 - abs(time_val - 9.25) / 1.25
        return 50.0 + (progress * 45.0)
    elif time_val < 17.0:
        # Midday plateau (10:30 to 17:00)
        return 35.0 + random.uniform(-4, 6)
    elif time_val < 20.0:
        # Evening peak (17:00 to 20:00)
        progress = 1.0 - abs(time_val - 18.5) / 1.5
        return 55.0 + (progress * 50.0)
    elif time_val < 22.5:
        # Late evening descent
        progress = (time_val - 20.0) / 2.5
        return 35.0 - (progress * 25.0)
    else:
        # Night
        return 4.0

async def seed_traffic_stats(session: AsyncSession):
    # Check if already seeded
    cnt = await session.execute(select(func.count(TrafficStat.bucket)))
    if (cnt.scalar_one() or 0) > 1000:
        print("Traffic stats already seeded.")
        return

    cams_res = await session.execute(select(Camera.id))
    cam_ids = cams_res.scalars().all()
    if not cam_ids:
        cam_ids = [f"CAM-{i:02d}" for i in range(1, 47)]

    base_date = datetime(2025, 6, 14, 0, 0, 0, tzinfo=timezone.utc)
    batch = []
    
    # 288 5-minute intervals in 24 hours
    for step in range(288):
        bucket_time = base_date + timedelta(minutes=step * 5)
        h = bucket_time.hour
        m = bucket_time.minute
        base_vol = get_hourly_base_traffic(h, m)

        for cam_id in cam_ids:
            mult = CAMERA_MULTIPLIERS.get(cam_id, 1.0)
            noise = random.uniform(0.88, 1.12)
            vehicles = max(0, int(base_vol * mult * noise))
            
            # Plate reads is ~85% of vehicles with some variation
            reads_ratio = random.uniform(0.80, 0.92)
            plate_reads = min(vehicles, max(0, int(vehicles * reads_ratio)))

            batch.append(TrafficStat(
                bucket=bucket_time,
                camera_id=cam_id,
                vehicle_count=vehicles,
                plate_reads=plate_reads
            ))

        if len(batch) >= 2000:
            session.add_all(batch)
            await session.flush()
            batch = []

    if batch:
        session.add_all(batch)
        await session.flush()

    await session.commit()
    print("Seeded full day of 5-minute interval traffic stats across all cameras.")

if __name__ == "__main__":
    from app.db.session import async_session_factory
    async def main():
        async with async_session_factory() as session:
            await seed_traffic_stats(session)
    asyncio.run(main())
