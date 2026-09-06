-- Performance indexes for CityAPR
CREATE INDEX IF NOT EXISTS idx_plate_events_plate ON plate_events(plate_number);
CREATE INDEX IF NOT EXISTS idx_plate_events_camera ON plate_events(camera_id);
CREATE INDEX IF NOT EXISTS idx_plate_events_time ON plate_events(event_time DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_stats_camera ON traffic_stats(camera_id, bucket DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_stats_bucket ON traffic_stats(bucket);
CREATE INDEX IF NOT EXISTS idx_rto_plate ON rto_records(plate_number);
CREATE INDEX IF NOT EXISTS idx_blacklist_plate ON blacklist(plate_number);
