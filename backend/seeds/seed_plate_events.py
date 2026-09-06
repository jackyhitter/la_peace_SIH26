import asyncio
import random
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.plate_event import PlateEvent
from app.models.camera import Camera
from app.models.rto_record import RTORecord
from app.models.ocr_eval import OCREvalRun

EXTRA_PLATES = [
    "PB65B1001", "HR03D9922", "CH01AT8877", "PB10Z3311", "HR26CL5544",
    "CH04A2200", "PB11K8822", "HR70P1144", "CH01BM9090", "PB08E7766",
    "HR51T3322", "CH03R4411", "PB02B9988", "HR10M5566", "CH01CP1212",
    "PB12V4433", "HR05G7711", "CH01DF6655", "PB07L2233", "HR29A8899",
]

async def seed_plate_events(session: AsyncSession):
    cnt = await session.execute(select(func.count(PlateEvent.id)))
    if (cnt.scalar_one() or 0) > 50:
        print("Plate events already seeded.")
        return

    # Fetch camera IDs
    cams_res = await session.execute(select(Camera.id))
    cam_ids = cams_res.scalars().all()
    if not cam_ids:
        cam_ids = [f"CAM-{i:02d}" for i in range(1, 47)]

    # Fetch RTO plates
    rto_res = await session.execute(select(RTORecord.plate_number))
    rto_plates = rto_res.scalars().all()
    all_plates = list(rto_plates) + EXTRA_PLATES

    base_day = datetime(2025, 6, 14, 6, 0, 0, tzinfo=timezone.utc)
    events = []

    # Generate ~850 plate reads spread over the day
    for i in range(850):
        # Weight towards daytime/peak
        hour_offset = random.choices(
            population=range(18),
            weights=[2, 4, 8, 14, 12, 10, 8, 8, 8, 9, 11, 14, 13, 9, 6, 4, 2, 1],
            k=1
        )[0]
        minute_offset = random.randint(0, 59)
        second_offset = random.randint(0, 59)
        ev_time = base_day + timedelta(hours=hour_offset, minutes=minute_offset, seconds=second_offset)

        plate = random.choice(all_plates)
        cam = random.choice(cam_ids)
        
        # High confidence for most, occasional lower confidence
        conf_bracket = random.random()
        if conf_bracket > 0.15:
            confidence = round(random.uniform(91.0, 99.2), 2)
        elif conf_bracket > 0.05:
            confidence = round(random.uniform(75.0, 90.5), 2)
        else:
            confidence = round(random.uniform(55.0, 74.5), 2)

        events.append(PlateEvent(
            plate_number=plate,
            camera_id=cam,
            confidence=confidence,
            ocr_raw=plate,
            event_time=ev_time,
            created_at=ev_time
        ))

    # Add specific highlighted events from the PRD
    # 1. PB10AB1234 at CAM-07 at 14:31:09
    events.append(PlateEvent(
        plate_number="PB10AB1234",
        camera_id="CAM-07",
        confidence=97.4,
        ocr_raw="PB10AB1234",
        event_time=datetime(2025, 6, 14, 14, 31, 9, tzinfo=timezone.utc),
        created_at=datetime(2025, 6, 14, 14, 31, 9, tzinfo=timezone.utc)
    ))
    # 2. PB10AB1234 earlier at CAM-12 at 11:20:33
    events.append(PlateEvent(
        plate_number="PB10AB1234",
        camera_id="CAM-12",
        confidence=91.2,
        ocr_raw="PB10AB1234",
        event_time=datetime(2025, 6, 14, 11, 20, 33, tzinfo=timezone.utc),
        created_at=datetime(2025, 6, 14, 11, 20, 33, tzinfo=timezone.utc)
    ))
    # 3. HR26AB5678 at CAM-12 at 14:29:44
    events.append(PlateEvent(
        plate_number="HR26AB5678",
        camera_id="CAM-12",
        confidence=83.5,
        ocr_raw="HR26AB5678",
        event_time=datetime(2025, 6, 14, 14, 29, 44, tzinfo=timezone.utc),
        created_at=datetime(2025, 6, 14, 14, 29, 44, tzinfo=timezone.utc)
    ))

    session.add_all(events)
    await session.commit()
    print(f"Seeded {len(events)} plate read events.")

    # Seed OCR Eval Run benchmark
    ocr_exists = await session.execute(select(OCREvalRun).limit(1))
    if not ocr_exists.scalars().first():
        eval_run = OCREvalRun(
            run_at=datetime(2025, 6, 14, 15, 0, 0, tzinfo=timezone.utc),
            dataset_name="Indian High-Density ANPR Benchmark v1.0",
            total_images=2500,
            correct_reads=2358,
            accuracy=94.32,
            notes="Evaluated on multi-state high-contrast and angled plate captures."
        )
        session.add(eval_run)
        await session.commit()
        print("Seeded OCR benchmark evaluation record (94.3% accuracy).")

if __name__ == "__main__":
    from app.db.session import async_session_factory
    async def main():
        async with async_session_factory() as session:
            await seed_plate_events(session)
    asyncio.run(main())
