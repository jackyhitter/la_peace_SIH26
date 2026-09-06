import asyncio
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.camera import Camera

CHANDIGARH_CAMERAS = [
    {"id": "CAM-01", "label": "Sector 1 / Jan Marg (Capitol Complex)", "sector": "Sector 1", "latitude": 30.7580, "longitude": 76.8020, "status": "active", "installed_at": "2023-01-15"},
    {"id": "CAM-02", "label": "Sector 2 / Boulevard Road North", "sector": "Sector 2", "latitude": 30.7562, "longitude": 76.7975, "status": "active", "installed_at": "2023-01-20"},
    {"id": "CAM-03", "label": "Sector 3 / Sukhna Lake Entry Gate", "sector": "Sector 3", "latitude": 30.7510, "longitude": 76.8140, "status": "active", "installed_at": "2023-02-10"},
    {"id": "CAM-04", "label": "Sector 4 / Golf Course Roundabout", "sector": "Sector 4", "latitude": 30.7485, "longitude": 76.8090, "status": "active", "installed_at": "2023-02-15"},
    {"id": "CAM-05", "label": "Sector 5 / Lake Club Crossing", "sector": "Sector 5", "latitude": 30.7450, "longitude": 76.8040, "status": "active", "installed_at": "2023-03-01"},
    {"id": "CAM-06", "label": "Sector 6 / Secretariat Access Point", "sector": "Sector 6", "latitude": 30.7490, "longitude": 76.7930, "status": "active", "installed_at": "2023-03-12"},
    {"id": "CAM-07", "label": "Sector 7 / Udyog Path Crossing", "sector": "Sector 7", "latitude": 30.7389, "longitude": 76.7751, "status": "active", "installed_at": "2023-03-20"},
    {"id": "CAM-08", "label": "Sector 8 / Madhya Marg Corridor", "sector": "Sector 8", "latitude": 30.7370, "longitude": 76.7990, "status": "active", "installed_at": "2023-04-05"},
    {"id": "CAM-09", "label": "Sector 9 / Matka Chowk Junction", "sector": "Sector 9", "latitude": 30.7440, "longitude": 76.7890, "status": "active", "installed_at": "2023-04-10"},
    {"id": "CAM-10", "label": "Sector 10 / Government Museum Chowk", "sector": "Sector 10", "latitude": 30.7543, "longitude": 76.7985, "status": "active", "installed_at": "2023-04-18"},
    {"id": "CAM-11", "label": "Sector 11 / Geri Route Entry", "sector": "Sector 11", "latitude": 30.7530, "longitude": 76.7880, "status": "active", "installed_at": "2023-05-02"},
    {"id": "CAM-12", "label": "Sector 12 / PGI Main Hospital Gate", "sector": "Sector 12", "latitude": 30.7650, "longitude": 76.7770, "status": "active", "installed_at": "2023-05-15"},
    {"id": "CAM-13", "label": "Sector 14 / Panjab University Gate 1", "sector": "Sector 14", "latitude": 30.7601, "longitude": 76.7874, "status": "active", "installed_at": "2023-05-20"},
    {"id": "CAM-14", "label": "Sector 15 / Madhya Marg Junction", "sector": "Sector 15", "latitude": 30.7498, "longitude": 76.7814, "status": "active", "installed_at": "2023-06-01"},
    {"id": "CAM-15", "label": "Sector 16 / Rose Garden Entrance", "sector": "Sector 16", "latitude": 30.7460, "longitude": 76.7840, "status": "active", "installed_at": "2023-06-10"},
    {"id": "CAM-16", "label": "Sector 17 / Plaza North Entrance", "sector": "Sector 17", "latitude": 30.7412, "longitude": 76.7846, "status": "active", "installed_at": "2023-06-15"},
    {"id": "CAM-17", "label": "Sector 17 / ISBT Bus Stand Terminal", "sector": "Sector 17", "latitude": 30.7390, "longitude": 76.7832, "status": "active", "installed_at": "2023-06-25"},
    {"id": "CAM-18", "label": "Sector 18 / Press Building Chowk", "sector": "Sector 18", "latitude": 30.7360, "longitude": 76.7900, "status": "active", "installed_at": "2023-07-02"},
    {"id": "CAM-19", "label": "Sector 19 / Sadar Bazar Access", "sector": "Sector 19", "latitude": 30.7300, "longitude": 76.7960, "status": "active", "installed_at": "2023-07-10"},
    {"id": "CAM-20", "label": "Sector 20 / Himalaya Marg Crossing", "sector": "Sector 20", "latitude": 30.7294, "longitude": 76.7852, "status": "active", "installed_at": "2023-07-18"},
    {"id": "CAM-21", "label": "Sector 21 / Aroma Light Point", "sector": "Sector 21", "latitude": 30.7315, "longitude": 76.7790, "status": "active", "installed_at": "2023-08-01"},
    {"id": "CAM-22", "label": "Sector 22 / Shopping Complex (Kiran)", "sector": "Sector 22", "latitude": 30.7340, "longitude": 76.7910, "status": "active", "installed_at": "2023-08-12"},
    {"id": "CAM-23", "label": "Sector 23 / All-Weather Pool Road", "sector": "Sector 23", "latitude": 30.7375, "longitude": 76.7680, "status": "active", "installed_at": "2023-08-20"},
    {"id": "CAM-24", "label": "Sector 24 / Batra Cinema Chowk", "sector": "Sector 24", "latitude": 30.7420, "longitude": 76.7620, "status": "active", "installed_at": "2023-09-01"},
    {"id": "CAM-25", "label": "Sector 25 / Kumhar Colony Outer Road", "sector": "Sector 25", "latitude": 30.7515, "longitude": 76.7560, "status": "active", "installed_at": "2023-09-10"},
    {"id": "CAM-26", "label": "Sector 26 / Grain Market Main Gate", "sector": "Sector 26", "latitude": 30.7280, "longitude": 76.8120, "status": "active", "installed_at": "2023-09-18"},
    {"id": "CAM-27", "label": "Sector 27 / Transport Chowk Approach", "sector": "Sector 27", "latitude": 30.7210, "longitude": 76.8040, "status": "active", "installed_at": "2023-10-05"},
    {"id": "CAM-28", "label": "Sector 28 / Motor Market Crossing", "sector": "Sector 28", "latitude": 30.7180, "longitude": 76.8100, "status": "active", "installed_at": "2023-10-12"},
    {"id": "CAM-29", "label": "Sector 29 / Iron Market Junction", "sector": "Sector 29", "latitude": 30.7100, "longitude": 76.8010, "status": "active", "installed_at": "2023-10-20"},
    {"id": "CAM-30", "label": "Sector 30 / Police Lines Outer Wall", "sector": "Sector 30", "latitude": 30.7140, "longitude": 76.7920, "status": "active", "installed_at": "2023-11-01"},
    {"id": "CAM-31", "label": "Sector 31 / Air Force Station Gate", "sector": "Sector 31", "latitude": 30.7020, "longitude": 76.7950, "status": "fault", "installed_at": "2023-11-10"},
    {"id": "CAM-32", "label": "Sector 32 / GMCH Hospital Chowk", "sector": "Sector 32", "latitude": 30.7080, "longitude": 76.7860, "status": "active", "installed_at": "2023-11-18"},
    {"id": "CAM-33", "label": "Sector 33 / Landmark Terraced Garden", "sector": "Sector 33", "latitude": 30.7150, "longitude": 76.7780, "status": "active", "installed_at": "2023-12-01"},
    {"id": "CAM-34", "label": "Sector 34 / Sub-City Centre Bank Sq", "sector": "Sector 34", "latitude": 30.7220, "longitude": 76.7690, "status": "active", "installed_at": "2023-12-10"},
    {"id": "CAM-35", "label": "Sector 35 / JW Marriott Light Point", "sector": "Sector 35", "latitude": 30.7250, "longitude": 76.7640, "status": "active", "installed_at": "2023-12-15"},
    {"id": "CAM-36", "label": "Sector 36 / Fragrance Garden Road", "sector": "Sector 36", "latitude": 30.7300, "longitude": 76.7570, "status": "active", "installed_at": "2024-01-05"},
    {"id": "CAM-37", "label": "Sector 37 / Beant Singh Memorial Gate", "sector": "Sector 37", "latitude": 30.7350, "longitude": 76.7490, "status": "active", "installed_at": "2024-01-12"},
    {"id": "CAM-38", "label": "Sector 38 / Vivek High School Chowk", "sector": "Sector 38", "latitude": 30.7410, "longitude": 76.7420, "status": "active", "installed_at": "2024-01-20"},
    {"id": "CAM-39", "label": "Sector 39 / Grain Market West Gate", "sector": "Sector 39", "latitude": 30.7460, "longitude": 76.7340, "status": "active", "installed_at": "2024-02-01"},
    {"id": "CAM-40", "label": "Sector 40 / Community Centre Point", "sector": "Sector 40", "latitude": 30.7320, "longitude": 76.7390, "status": "active", "installed_at": "2024-02-10"},
    {"id": "CAM-41", "label": "Sector 41 / Badheri Village Bypass", "sector": "Sector 41", "latitude": 30.7240, "longitude": 76.7460, "status": "active", "installed_at": "2024-02-18"},
    {"id": "CAM-42", "label": "Sector 42 / Hockey Stadium Road", "sector": "Sector 42", "latitude": 30.7180, "longitude": 76.7530, "status": "active", "installed_at": "2024-03-01"},
    {"id": "CAM-43", "label": "Sector 43 / ISBT New Inter-State Bus", "sector": "Sector 43", "latitude": 30.7120, "longitude": 76.7600, "status": "active", "installed_at": "2024-03-10"},
    {"id": "CAM-44", "label": "Sector 44 / Government School Chowk", "sector": "Sector 44", "latitude": 30.7060, "longitude": 76.7680, "status": "fault", "installed_at": "2024-03-18"},
    {"id": "CAM-45", "label": "Sector 45 / Burail Barrier Crossing", "sector": "Sector 45", "latitude": 30.7010, "longitude": 76.7750, "status": "active", "installed_at": "2024-04-01"},
    {"id": "CAM-46", "label": "Sector 47 / IT Park Access Highway", "sector": "Sector 47", "latitude": 30.7102, "longitude": 76.8145, "status": "active", "installed_at": "2024-04-15"},
]

async def seed_cameras(session: AsyncSession):
    for c_data in CHANDIGARH_CAMERAS:
        exists = await session.execute(select(Camera).where(Camera.id == c_data["id"]))
        if not exists.scalars().first():
            installed = date.fromisoformat(c_data["installed_at"]) if c_data.get("installed_at") else None
            cam = Camera(
                id=c_data["id"],
                label=c_data["label"],
                sector=c_data["sector"],
                latitude=c_data["latitude"],
                longitude=c_data["longitude"],
                status=c_data["status"],
                installed_at=installed
            )
            session.add(cam)
    await session.commit()
    print(f"Seeded {len(CHANDIGARH_CAMERAS)} Chandigarh cameras successfully.")

if __name__ == "__main__":
    from app.db.session import async_session_factory
    async def main():
        async with async_session_factory() as session:
            await seed_cameras(session)
    asyncio.run(main())
