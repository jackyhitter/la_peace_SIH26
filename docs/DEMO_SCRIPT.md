# CityAPR — Demonstration Script & Walkthrough (SIH)

## 1. Login
- Present the dual-pane terminal login screen (`/login`).
- Point out the technical live status indicators (46 camera nodes, 99.4% system uptime).
- Authenticate with `admin` / `admin123`.

## 2. Dashboard & Interactive Map
- Show the 46-camera Chandigarh surveillance network.
- Note the two fault nodes (`CAM-31` and `CAM-44`) colored in warning amber.
- Show the Deck.gl Heatmap layer dynamically colored over Sector 17 and Madhya Marg corridor.
- Click a camera marker to show `CameraPopup` with last plate read and today's total count. Click the plate chip to navigate directly to Plate Search.
- Demonstrate the Bottom-Left Minimap showing the network overview and bounding box.

## 3. Alerts Panel & Live Resolution
- Review the 5 active alerts (e.g., blacklisted stolen vehicle detection at `CAM-07`).
- Click **Resolve** — observe optimistic card collapse and database update via `PATCH /api/alerts/{id}/resolve`.
- Show recent reads polling live every 15s.

## 4. Analytics
- Show 4 real-time stat cards (Vehicles today, OCR accuracy 94.3%, Active cameras 44/46, Alerts today).
- Explore the Hourly Traffic Volume chart and 15-minute peak density curve.
- Examine the Camera Activity Ranking table.

## 5. Plate Logs & Search
- Open `/logs` to view paginated OCR reads with confidence indicators.
- Open `/search` and look up `PB10AB1234` to inspect the RTO vehicle registration panel (owner, chassis, insurance status) paired with the sighting history.

## 6. Restricted Vehicles (Blacklist)
- Manage stolen and flagged vehicles at `/restricted`.
- Add a new vehicle or remove an entry with modal confirmation.
