# CityAPR — Database Schema Rationale (V3)

## Architectural Rationale

1. **TimescaleDB Hypertables**:
   - `plate_events` and `traffic_stats` are time-series data streams. Hypertables partition them into time chunks, enabling instant indexing and high write throughput.
2. **PostGIS**:
   - Camera nodes contain spatial coordinate points (`latitude`, `longitude`) ready for spatial proximity queries and bounding-box queries.
3. **Optimized Indexing**:
   - Direct compound index on `traffic_stats(camera_id, bucket DESC)` speeds up analytics aggregations without needing pre-computed rollups.
   - Plate search indexes enable exact lookup across millions of raw events in sub-millisecond time.
