-- =============================================================================
-- CityAPR — Master Database Schema (v3)
-- Chandigarh Traffic Intelligence & ANPR Platform
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 1. Operators (System users / Control Room Admins)
CREATE TABLE IF NOT EXISTS operators (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(64) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    display_name    VARCHAR(128),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 2. Cameras (The 46 surveillance nodes across Chandigarh)
CREATE TABLE IF NOT EXISTS cameras (
    id              VARCHAR(16) PRIMARY KEY,  -- e.g. 'CAM-01'
    label           VARCHAR(128) NOT NULL,    -- e.g. 'Sector 1 / Jan Marg'
    sector          VARCHAR(64) NOT NULL,
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    status          VARCHAR(16) NOT NULL DEFAULT 'active',  -- 'active' | 'fault' | 'offline'
    installed_at    DATE,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. Plate Events (Populated by OCR pipeline / demo batch run)
CREATE TABLE IF NOT EXISTS plate_events (
    id              BIGSERIAL,
    plate_number    VARCHAR(16) NOT NULL,
    camera_id       VARCHAR(16) REFERENCES cameras(id),
    confidence      NUMERIC(5,2),          -- 0.00 to 100.00
    ocr_raw         VARCHAR(32),           -- raw OCR output before post-processing
    event_time      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (id, event_time)
);
-- Make it a TimescaleDB hypertable partitioned by event_time if timescaledb exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'timescaledb') THEN
        PERFORM create_hypertable('plate_events', 'event_time', if_not_exists => TRUE);
    END IF;
END $$;

-- 4. Blacklist / Restricted Vehicles
CREATE TABLE IF NOT EXISTS blacklist (
    id              SERIAL PRIMARY KEY,
    plate_number    VARCHAR(16) UNIQUE NOT NULL,
    reason          TEXT NOT NULL,
    added_by        INTEGER REFERENCES operators(id),
    added_at        TIMESTAMPTZ DEFAULT now(),
    is_active       BOOLEAN DEFAULT true
);

-- 5. Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id              SERIAL PRIMARY KEY,
    type            VARCHAR(32) NOT NULL,      -- 'blacklisted_vehicle' | 'camera_fault' | 'wrong_way' | 'speeding'
    severity        VARCHAR(16) NOT NULL,      -- 'critical' | 'warning'
    camera_id       VARCHAR(16) REFERENCES cameras(id),
    plate_number    VARCHAR(16),              -- NULL for non-plate alerts
    description     TEXT,
    status          VARCHAR(16) DEFAULT 'active',  -- 'active' | 'resolved'
    resolved_by     INTEGER REFERENCES operators(id),
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 6. Traffic Stats (5-minute base windows)
CREATE TABLE IF NOT EXISTS traffic_stats (
    bucket          TIMESTAMPTZ NOT NULL,
    camera_id       VARCHAR(16) NOT NULL REFERENCES cameras(id),
    vehicle_count   INTEGER NOT NULL DEFAULT 0,
    plate_reads     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket, camera_id)
);
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'timescaledb') THEN
        PERFORM create_hypertable('traffic_stats', 'bucket', if_not_exists => TRUE);
    END IF;
END $$;

-- 7. RTO Records (Mock Vehicle Ownership Records)
CREATE TABLE IF NOT EXISTS rto_records (
    id                  SERIAL PRIMARY KEY,
    plate_number        VARCHAR(16) UNIQUE NOT NULL,
    owner_name          VARCHAR(128) NOT NULL,
    vehicle_make        VARCHAR(64),
    vehicle_model       VARCHAR(64),
    vehicle_color       VARCHAR(32),
    registration_state  VARCHAR(32),
    registration_year   INTEGER,
    chassis_number      VARCHAR(32),
    insurance_valid_until DATE,
    status              VARCHAR(16) DEFAULT 'active'  -- 'active' | 'expired' | 'suspended'
);

-- 8. OCR Evaluation Runs (Accuracy benchmarks)
CREATE TABLE IF NOT EXISTS ocr_eval_runs (
    id              SERIAL PRIMARY KEY,
    run_at          TIMESTAMPTZ DEFAULT now(),
    dataset_name    VARCHAR(128),
    total_images    INTEGER,
    correct_reads   INTEGER,
    accuracy        NUMERIC(5,2),
    notes           TEXT
);
