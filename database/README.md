# CityAPR Database

This folder contains the canonical database definitions for CityAPR.

## Contents
- `schema.sql`: Full DDL script including TimescaleDB hypertable setups.
- `indexes.sql`: Performance indexes for sub-millisecond query responses.

## Setup
In Docker, `schema.sql` and `indexes.sql` are loaded automatically on first container run.
For manual setups:
```bash
psql -U cityapr -d cityapr -f schema.sql
psql -U cityapr -d cityapr -f indexes.sql
```
