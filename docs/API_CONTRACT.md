# CityAPR — API Contract Specification

All endpoints are prefixed with `/api`. All error responses conform to `{ "detail": "human-readable error message" }`.

---

## 1. Authentication

### `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "operator": {
      "id": 1,
      "username": "admin",
      "display_name": "Chief Controller"
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  { "detail": "Incorrect username or password" }
  ```

### `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
  ```json
  { "detail": "Logged out" }
  ```

---

## 2. Cameras

### `GET /api/cameras`
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "CAM-01",
      "label": "Sector 1 / Jan Marg",
      "sector": "Sector 1",
      "latitude": 30.7412,
      "longitude": 76.7682,
      "status": "active",
      "installed_at": "2024-01-15"
    }
  ]
  ```

### `GET /api/cameras/summary`
- **Success Response (200 OK)**:
  ```json
  {
    "total": 46,
    "active": 44,
    "fault": 2,
    "offline": 0
  }
  ```

---

## 3. Plate Reads & Ingestion

### `GET /api/plates/logs`
- **Query Parameters**:
  - `camera_id` (optional, string)
  - `date` (optional, `YYYY-MM-DD`)
  - `confidence_min` (optional, float)
  - `page` (default 1, int)
  - `limit` (default 50, int)
- **Success Response (200 OK)**:
  ```json
  {
    "items": [
      {
        "id": 1042,
        "plate_number": "PB10AB1234",
        "camera_id": "CAM-07",
        "camera_label": "Sector 17 / City Centre",
        "sector": "Sector 17",
        "confidence": 97.4,
        "event_time": "2025-06-14T14:31:09Z",
        "is_blacklisted": true
      }
    ],
    "total": 847,
    "page": 1,
    "pages": 17
  }
  ```

### `GET /api/plates/search`
- **Query Parameters**: `plate` (string, case-insensitive)
- **Success Response (200 OK)**:
  ```json
  {
    "plate_number": "PB10AB1234",
    "events": [ ... ],
    "rto": {
      "plate_number": "PB10AB1234",
      "owner_name": "Rajesh Kumar Sharma",
      "vehicle_make": "Maruti Suzuki",
      "vehicle_model": "Swift Dzire",
      "vehicle_color": "White",
      "registration_state": "Punjab",
      "registration_year": 2019,
      "chassis_number": "MA3FJEB1S00123456",
      "insurance_valid_until": "2025-12-31",
      "status": "active"
    },
    "blacklist_entry": {
      "id": 1,
      "plate_number": "PB10AB1234",
      "reason": "Stolen vehicle — FIR No. 0342/2024, PS Sector 17",
      "added_by_name": "Admin",
      "added_at": "2025-06-13T10:00:00Z"
    }
  }
  ```

### `POST /api/plates/ingest`
- **Request Body**:
  ```json
  {
    "plate_number": "HR26DK8833",
    "camera_id": "CAM-12",
    "confidence": 94.2,
    "ocr_raw": "HR26DK8833",
    "event_time": "2025-06-14T15:20:00Z"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  { "id": 1050 }
  ```

---

## 4. Alerts

### `GET /api/alerts`
- **Query Parameters**:
  - `status` ('active' | 'resolved' | 'all', default 'active')
  - `severity` ('critical' | 'warning', optional)
  - `page` (default 1)
  - `limit` (default 50)
- **Success Response (200 OK)**:
  ```json
  {
    "items": [
      {
        "id": 1,
        "type": "blacklisted_vehicle",
        "severity": "critical",
        "camera_id": "CAM-07",
        "camera_label": "Sector 17 / City Centre",
        "plate_number": "PB10AB1234",
        "description": "Blacklisted vehicle spotted — FIR No. 0342/2024",
        "status": "active",
        "created_at": "2025-06-14T14:31:09Z",
        "resolved_at": null
      }
    ],
    "total": 5
  }
  ```

### `PATCH /api/alerts/{id}/resolve`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
  ```json
  {
    "id": 1,
    "status": "resolved",
    "resolved_by": 1,
    "resolved_at": "2025-06-14T15:00:00Z"
  }
  ```

---

## 5. Analytics

### `GET /api/analytics/traffic`
- **Query Parameters**: `window` ('hour' | '15min' | 'day'), `date` (YYYY-MM-DD)
- **Success Response (200 OK)**:
  ```json
  {
    "buckets": [
      {
        "time": "08:00",
        "vehicle_count": 3420,
        "plate_reads": 2980
      }
    ]
  }
  ```

### `GET /api/analytics/summary`
- **Query Parameters**: `date` (YYYY-MM-DD)
- **Success Response (200 OK)**:
  ```json
  {
    "vehicles_today": 28470,
    "plate_reads_today": 24200,
    "ocr_accuracy": 94.3,
    "active_cameras": 44,
    "fault_cameras": 2,
    "alerts_today": 7
  }
  ```

### `GET /api/analytics/camera-ranking`
- **Query Parameters**: `date` (YYYY-MM-DD), `limit` (int, default 10)
- **Success Response (200 OK)**:
  ```json
  {
    "cameras": [
      {
        "camera_id": "CAM-07",
        "camera_label": "Sector 17 / City Centre",
        "sector": "Sector 17",
        "read_count": 1840,
        "status": "active"
      }
    ]
  }
  ```

### `GET /api/analytics/heatmap`
- **Success Response (200 OK)**:
  ```json
  {
    "points": [
      {
        "camera_id": "CAM-07",
        "latitude": 30.7412,
        "longitude": 76.7846,
        "weight": 0.95
      }
    ]
  }
  ```

---

## 6. Blacklist

### `GET /api/blacklist`
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "plate_number": "PB10AB1234",
      "reason": "Stolen vehicle — FIR No. 0342/2024, PS Sector 17",
      "added_by_name": "Admin",
      "added_at": "2025-06-13T10:00:00Z"
    }
  ]
  ```

### `POST /api/blacklist`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "plate_number": "CH01AB9999",
    "reason": "Flagged vehicle — traffic violation probe"
  }
  ```
- **Success Response (201 Created)**: Returns created `BlacklistEntry`.

### `DELETE /api/blacklist/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
  ```json
  { "detail": "Removed from restricted list" }
  ```

---

## 7. RTO Lookup

### `GET /api/rto/lookup`
- **Query Parameters**: `plate` (string)
- **Success Response (200 OK)**: Returns `RTORecord` object or `null`.
