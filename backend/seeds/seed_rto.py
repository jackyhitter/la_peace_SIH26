import asyncio
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.rto_record import RTORecord

RTO_RECORDS_DATA = [
    {
        "plate_number": "PB10AB1234",
        "owner_name": "Rajesh Kumar Sharma",
        "vehicle_make": "Maruti Suzuki",
        "vehicle_model": "Swift Dzire VXi",
        "vehicle_color": "Pearl Arctic White",
        "registration_state": "Punjab",
        "registration_year": 2019,
        "chassis_number": "MA3FJEB1S00123456",
        "insurance_valid_until": "2025-12-31",
        "status": "active"
    },
    {
        "plate_number": "HR26AB5678",
        "owner_name": "Vikram Singh Sandhu",
        "vehicle_make": "Hyundai",
        "vehicle_model": "Creta SX(O)",
        "vehicle_color": "Phantom Black",
        "registration_state": "Haryana",
        "registration_year": 2021,
        "chassis_number": "MALC281CLNM109823",
        "insurance_valid_until": "2025-10-15",
        "status": "active"
    },
    {
        "plate_number": "CH01CD9012",
        "owner_name": "Gurpreet Kaur Dhillon",
        "vehicle_make": "Tata Motors",
        "vehicle_model": "Nexon EV Empowered",
        "vehicle_color": "Daytona Grey",
        "registration_state": "Chandigarh",
        "registration_year": 2023,
        "chassis_number": "MAT623498N3L44102",
        "insurance_valid_until": "2026-04-20",
        "status": "active"
    },
    {
        "plate_number": "PB65X7788",
        "owner_name": "Maninder Pal Ahluwalia",
        "vehicle_make": "Mahindra & Mahindra",
        "vehicle_model": "Scorpio-N Z8L",
        "vehicle_color": "Dazzling Silver",
        "registration_state": "Punjab",
        "registration_year": 2022,
        "chassis_number": "MA1TA2WKKN2E78129",
        "insurance_valid_until": "2025-08-11",
        "status": "active"
    },
    {
        "plate_number": "HR03E4455",
        "owner_name": "Anil Devinder Verma",
        "vehicle_make": "Honda Cars",
        "vehicle_model": "City ZX i-VTEC",
        "vehicle_color": "Lunar Silver Metallic",
        "registration_state": "Haryana",
        "registration_year": 2020,
        "chassis_number": "MAKGM6650L4001924",
        "insurance_valid_until": "2024-11-30",
        "status": "expired"
    },
    {
        "plate_number": "CH01AB1122",
        "owner_name": "Sunita Rani Goyal",
        "vehicle_make": "Toyota Kirloskar",
        "vehicle_model": "Innova Crysta 2.4 VX",
        "vehicle_color": "Super White",
        "registration_state": "Chandigarh",
        "registration_year": 2018,
        "chassis_number": "MBJFA62AL9J882310",
        "insurance_valid_until": "2025-09-05",
        "status": "active"
    },
    {
        "plate_number": "PB11BC3344",
        "owner_name": "Harpreet Singh Brar",
        "vehicle_make": "Kia Motors",
        "vehicle_model": "Seltos GTX Plus",
        "vehicle_color": "Gravity Grey",
        "registration_state": "Punjab",
        "registration_year": 2021,
        "chassis_number": "MZBE241CLMN551209",
        "insurance_valid_until": "2026-01-14",
        "status": "active"
    },
    {
        "plate_number": "HR70D8899",
        "owner_name": "Rakesh Chander Mittal",
        "vehicle_make": "Maruti Suzuki",
        "vehicle_model": "Baleno Zeta",
        "vehicle_color": "Nexa Blue",
        "registration_state": "Haryana",
        "registration_year": 2020,
        "chassis_number": "MBHWB62AL3K229410",
        "insurance_valid_until": "2025-11-20",
        "status": "active"
    },
    {
        "plate_number": "CH04K5566",
        "owner_name": "Jaswinder Singh Toor",
        "vehicle_make": "Hyundai",
        "vehicle_model": "i20 Asta (O)",
        "vehicle_color": "Polar White",
        "registration_state": "Chandigarh",
        "registration_year": 2022,
        "chassis_number": "MALB151BLRM774012",
        "insurance_valid_until": "2025-07-28",
        "status": "active"
    },
    {
        "plate_number": "PB08CR9900",
        "owner_name": "Karanveer Singh Bedi",
        "vehicle_make": "Tata Motors",
        "vehicle_model": "Harrier XZ Plus",
        "vehicle_color": "Calypso Red",
        "registration_state": "Punjab",
        "registration_year": 2021,
        "chassis_number": "MAT612349M1N90341",
        "insurance_valid_until": "2025-06-30",
        "status": "active"
    },
    {
        "plate_number": "HR51AU2233",
        "owner_name": "Pooja Narang",
        "vehicle_make": "Volkswagen",
        "vehicle_model": "Virtus Topline",
        "vehicle_color": "Wild Cherry Red",
        "registration_state": "Haryana",
        "registration_year": 2023,
        "chassis_number": "WVWZZZ6RZNY110945",
        "insurance_valid_until": "2026-03-15",
        "status": "active"
    },
    {
        "plate_number": "CH01BK7744",
        "owner_name": "Amitabh Sanyal",
        "vehicle_make": "Skoda Auto",
        "vehicle_model": "Slavia Style 1.5",
        "vehicle_color": "Carbon Steel",
        "registration_state": "Chandigarh",
        "registration_year": 2022,
        "chassis_number": "TMBNA6NS5N1098234",
        "insurance_valid_until": "2025-12-10",
        "status": "active"
    },
    {
        "plate_number": "PB02DG6611",
        "owner_name": "Amrik Singh Cheema",
        "vehicle_make": "Mahindra & Mahindra",
        "vehicle_model": "Thar LX 4x4",
        "vehicle_color": "Napoli Black",
        "registration_state": "Punjab",
        "registration_year": 2022,
        "chassis_number": "MA1TB2AKKN3F49102",
        "insurance_valid_until": "2025-05-19",
        "status": "active"
    },
    {
        "plate_number": "HR10W4411",
        "owner_name": "Suresh Babu Yadav",
        "vehicle_make": "Maruti Suzuki",
        "vehicle_model": "Ertiga VXi CNG",
        "vehicle_color": "Magma Grey",
        "registration_state": "Haryana",
        "registration_year": 2020,
        "chassis_number": "MA3EWE61S00912450",
        "insurance_valid_until": "2025-08-30",
        "status": "active"
    },
    {
        "plate_number": "CH01AN3322",
        "owner_name": "Neeraj Batra",
        "vehicle_make": "Honda Cars",
        "vehicle_model": "Elevate ZX",
        "vehicle_color": "Phoenix Orange",
        "registration_state": "Chandigarh",
        "registration_year": 2024,
        "chassis_number": "MAKDG5860P1002391",
        "insurance_valid_until": "2027-01-20",
        "status": "active"
    },
    {
        "plate_number": "PB12M1199",
        "owner_name": "Davinder Singh Gill",
        "vehicle_make": "Toyota Kirloskar",
        "vehicle_model": "Fortuner 4x4 AT",
        "vehicle_color": "Attitude Black",
        "registration_state": "Punjab",
        "registration_year": 2021,
        "chassis_number": "MBJHA62BL8K441920",
        "insurance_valid_until": "2025-09-12",
        "status": "active"
    },
    {
        "plate_number": "HR05P8844",
        "owner_name": "Satish Kumar Gupta",
        "vehicle_make": "Tata Motors",
        "vehicle_model": "Punch Creative",
        "vehicle_color": "Atomic Orange",
        "registration_state": "Haryana",
        "registration_year": 2022,
        "chassis_number": "MAT602349N2L77123",
        "insurance_valid_until": "2025-10-02",
        "status": "active"
    },
    {
        "plate_number": "CH03F6677",
        "owner_name": "Divya Mehra",
        "vehicle_make": "Hyundai",
        "vehicle_model": "Venue SX Plus",
        "vehicle_color": "Titan Grey",
        "registration_state": "Chandigarh",
        "registration_year": 2021,
        "chassis_number": "MALC141BLKM882319",
        "insurance_valid_until": "2025-11-15",
        "status": "active"
    },
    {
        "plate_number": "PB07AK5500",
        "owner_name": "Balwinder Singh Grewal",
        "vehicle_make": "Maruti Suzuki",
        "vehicle_model": "Grand Vitara Alpha",
        "vehicle_color": "Opulent Red",
        "registration_state": "Punjab",
        "registration_year": 2023,
        "chassis_number": "MBHYB62AL4M901234",
        "insurance_valid_until": "2026-02-18",
        "status": "active"
    },
    {
        "plate_number": "HR29Z1234",
        "owner_name": "Mohinder Pratap Singh",
        "vehicle_make": "MG Motor",
        "vehicle_model": "Hector Plus Sharp",
        "vehicle_color": "Havana Grey",
        "registration_state": "Haryana",
        "registration_year": 2021,
        "chassis_number": "MZAB841CLKN662910",
        "insurance_valid_until": "2025-04-10",
        "status": "active"
    },
    {
        "plate_number": "CH01AZ9876",
        "owner_name": "Simranjeet Kaur Pannu",
        "vehicle_make": "Kia Motors",
        "vehicle_model": "Sonet HTX",
        "vehicle_color": "Aurora Black Pearl",
        "registration_state": "Chandigarh",
        "registration_year": 2022,
        "chassis_number": "MZBE141CLPN339102",
        "insurance_valid_until": "2025-08-25",
        "status": "active"
    },
    {
        "plate_number": "PB10CD4455",
        "owner_name": "Kuldeep Singh Sidhu",
        "vehicle_make": "Tata Motors",
        "vehicle_model": "Safari Accomplished",
        "vehicle_color": "Cosmic Gold",
        "registration_state": "Punjab",
        "registration_year": 2023,
        "chassis_number": "MAT619874P2M11450",
        "insurance_valid_until": "2026-06-10",
        "status": "active"
    },
    {
        "plate_number": "HR01T9911",
        "owner_name": "Dharmender Malik",
        "vehicle_make": "Mahindra & Mahindra",
        "vehicle_model": "XUV700 AX7 Luxury",
        "vehicle_color": "Midnight Black",
        "registration_state": "Haryana",
        "registration_year": 2022,
        "chassis_number": "MA1TA4WKKP3G88102",
        "insurance_valid_until": "2025-12-05",
        "status": "active"
    },
    {
        "plate_number": "CH01BX5500",
        "owner_name": "Naveen Anand",
        "vehicle_make": "BMW",
        "vehicle_model": "3 Series 330Li",
        "vehicle_color": "Mineral White",
        "registration_state": "Chandigarh",
        "registration_year": 2023,
        "chassis_number": "WBA5R1103PFP99124",
        "insurance_valid_until": "2026-05-14",
        "status": "active"
    },
    {
        "plate_number": "PB65AB9999",
        "owner_name": "Jaspreet Singh Johal",
        "vehicle_make": "Mercedes-Benz",
        "vehicle_model": "E-Class E220d",
        "vehicle_color": "Selenite Grey",
        "registration_state": "Punjab",
        "registration_year": 2022,
        "chassis_number": "WDD2130042A890123",
        "insurance_valid_until": "2025-09-30",
        "status": "active"
    }
]

async def seed_rto(session: AsyncSession):
    for r_data in RTO_RECORDS_DATA:
        exists = await session.execute(
            select(RTORecord).where(RTORecord.plate_number == r_data["plate_number"])
        )
        if not exists.scalars().first():
            ins_date = date.fromisoformat(r_data["insurance_valid_until"]) if r_data.get("insurance_valid_until") else None
            record = RTORecord(
                plate_number=r_data["plate_number"],
                owner_name=r_data["owner_name"],
                vehicle_make=r_data["vehicle_make"],
                vehicle_model=r_data["vehicle_model"],
                vehicle_color=r_data["vehicle_color"],
                registration_state=r_data["registration_state"],
                registration_year=r_data["registration_year"],
                chassis_number=r_data["chassis_number"],
                insurance_valid_until=ins_date,
                status=r_data.get("status", "active")
            )
            session.add(record)
    await session.commit()
    print(f"Seeded {len(RTO_RECORDS_DATA)} RTO registration records.")

if __name__ == "__main__":
    from app.db.session import async_session_factory
    async def main():
        async with async_session_factory() as session:
            await seed_rto(session)
    asyncio.run(main())
