import asyncio
import httpx
from app.main import app

async def run_tests():
    print("Testing CityAPR FastAPI Backend Endpoints...")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[PASS] GET /api/health ->", res.json())

        # 2. Auth login
        res = await client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
        assert res.status_code == 200, f"Login failed: {res.text}"
        token_data = res.json()
        token = token_data["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}
        print("[PASS] POST /api/auth/login -> authenticated as", token_data["operator"]["username"])

        # 3. Cameras
        res = await client.get("/api/cameras")
        assert res.status_code == 200
        cams = res.json()
        assert len(cams) == 46, f"Expected 46 cameras, got {len(cams)}"
        print(f"[PASS] GET /api/cameras -> {len(cams)} cameras loaded")

        res = await client.get("/api/cameras/summary")
        assert res.status_code == 200
        summary = res.json()
        assert summary["total"] == 46 and summary["fault"] == 2
        print("[PASS] GET /api/cameras/summary ->", summary)

        # 4. Plates Logs
        res = await client.get("/api/plates/logs?limit=5")
        assert res.status_code == 200
        logs = res.json()
        assert logs["total"] > 0
        print(f"[PASS] GET /api/plates/logs -> {len(logs['items'])} items returned (total: {logs['total']})")

        # 5. Plates Search
        res = await client.get("/api/plates/search?plate=PB10AB1234")
        assert res.status_code == 200
        search_res = res.json()
        assert search_res["rto"] is not None
        assert search_res["blacklist_entry"] is not None
        print("[PASS] GET /api/plates/search?plate=PB10AB1234 -> RTO owner:", search_res["rto"]["owner_name"], "| Blacklist reason:", search_res["blacklist_entry"]["reason"])

        # 6. RTO Lookup
        res = await client.get("/api/rto/lookup?plate=HR26AB5678")
        assert res.status_code == 200
        rto_item = res.json()
        assert rto_item["vehicle_make"] == "Hyundai"
        print("[PASS] GET /api/rto/lookup ->", rto_item["owner_name"], "-", rto_item["vehicle_make"])

        # 7. Alerts
        res = await client.get("/api/alerts?status=active")
        assert res.status_code == 200
        alerts = res.json()
        assert len(alerts["items"]) >= 5
        print(f"[PASS] GET /api/alerts?status=active -> {len(alerts['items'])} active alerts")

        # Test resolve alert
        first_alert_id = alerts["items"][0]["id"]
        res = await client.patch(f"/api/alerts/{first_alert_id}/resolve", headers=auth_headers)
        assert res.status_code == 200
        print(f"[PASS] PATCH /api/alerts/{first_alert_id}/resolve -> resolved")

        # 8. Analytics
        res = await client.get("/api/analytics/traffic?window=hour&date=2025-06-14")
        assert res.status_code == 200
        traffic = res.json()
        assert len(traffic["buckets"]) == 24
        print(f"[PASS] GET /api/analytics/traffic?window=hour -> {len(traffic['buckets'])} hourly buckets")

        res = await client.get("/api/analytics/summary?date=2025-06-14")
        assert res.status_code == 200
        analytics_sum = res.json()
        print("[PASS] GET /api/analytics/summary ->", analytics_sum)

        res = await client.get("/api/analytics/camera-ranking?limit=5")
        assert res.status_code == 200
        ranks = res.json()
        print(f"[PASS] GET /api/analytics/camera-ranking -> top camera: {ranks['cameras'][0]['camera_label']} with {ranks['cameras'][0]['read_count']} reads")

        res = await client.get("/api/analytics/heatmap")
        assert res.status_code == 200
        heatmap = res.json()
        assert len(heatmap["points"]) == 46
        print(f"[PASS] GET /api/analytics/heatmap -> {len(heatmap['points'])} heatmap points")

        # 9. Blacklist
        res = await client.get("/api/blacklist")
        assert res.status_code == 200
        bl_items = res.json()
        assert len(bl_items) >= 6
        print(f"[PASS] GET /api/blacklist -> {len(bl_items)} restricted vehicles")

        # Ingest route
        res = await client.post("/api/plates/ingest", json={
            "plate_number": "CH01XX9999",
            "camera_id": "CAM-01",
            "confidence": 96.8,
            "ocr_raw": "CH01XX9999",
            "event_time": "2025-06-14T16:00:00Z"
        })
        assert res.status_code == 201
        print(f"[PASS] POST /api/plates/ingest -> ingested event id:", res.json()["id"])

    print("\n[ALL 9 API SUITES PASSED PERFECTLY!]")

if __name__ == "__main__":
    asyncio.run(run_tests())
