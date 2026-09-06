import asyncio
import argparse
import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select
from app.db.session import engine, async_session_factory
from app.db.base import Base
import app.models  # load all models
from app.models.operator import Operator
from app.services.auth_service import get_password_hash

from seeds.seed_cameras import seed_cameras
from seeds.seed_rto import seed_rto
from seeds.seed_blacklist import seed_blacklist
from seeds.seed_alerts import seed_alerts
from seeds.seed_traffic_stats import seed_traffic_stats
from seeds.seed_plate_events import seed_plate_events

async def seed_operator(session):
    res = await session.execute(select(Operator).where(Operator.username == "admin"))
    operator = res.scalars().first()
    if not operator:
        admin = Operator(
            username="admin",
            password_hash=get_password_hash("admin123"),
            display_name="Chief Controller"
        )
        session.add(admin)
        await session.commit()
        print("Seeded default operator account: admin / admin123")
    else:
        print("Operator 'admin' already exists.")

async def run_all(reset: bool = False):
    print("=" * 60)
    print("CityAPR Database Initialization & Seed Runner")
    print("=" * 60)

    if reset:
        print("[!] Reset flag provided: Dropping all existing tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        print("[+] All tables dropped.")

    print("[*] Creating tables if not existing...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[+] Database schema ready.")

    async with async_session_factory() as session:
        print("\n--- 1. Seeding Default Operator ---")
        await seed_operator(session)

        print("\n--- 2. Seeding 46 Chandigarh Cameras ---")
        await seed_cameras(session)

        print("\n--- 3. Seeding RTO Registration Records ---")
        await seed_rto(session)

        print("\n--- 4. Seeding Restricted Vehicles (Blacklist) ---")
        await seed_blacklist(session)

        print("\n--- 5. Seeding Real-time Demo Alerts ---")
        await seed_alerts(session)

        print("\n--- 6. Seeding 5-Min Full-Day Traffic Stats ---")
        await seed_traffic_stats(session)

        print("\n--- 7. Seeding Historical Plate OCR Events ---")
        await seed_plate_events(session)

    print("\n" + "=" * 60)
    print("[SUCCESS] All CityAPR seed data loaded successfully!")
    print("=" * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed CityAPR database.")
    parser.add_argument("--reset", action="store_true", help="Drop and recreate all tables before seeding")
    args = parser.parse_args()

    asyncio.run(run_all(reset=args.reset))
