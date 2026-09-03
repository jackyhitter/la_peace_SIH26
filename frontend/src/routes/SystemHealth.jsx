import React from 'react';

export default function SystemHealth() {
  const subsystems = [
    { name: 'FastAPI Backend Engine', endpoint: 'http://localhost:8000/health', status: 'OK', latency: '4ms' },
    { name: 'PostgreSQL / PostGIS Database', endpoint: 'localhost:5432/sih_db', status: 'OK', latency: '2ms' },
    { name: 'Kafka Event Broker', endpoint: 'localhost:9092 (PLAINTEXT)', status: 'OK', lag: '0 msgs' },
    { name: 'Redis Cache & Track Session Store', endpoint: 'localhost:6379', status: 'OK', memory: '14.2 MB' },
    { name: 'AI YOLO Worker Pool (Edge/GPU)', endpoint: 'worker_pool_01', status: 'STANDBY', gpus: '1x RTX 4090' }
  ];

  return (
    <div className="raw-box">
      <div className="raw-box-title">[MODULE: SYSTEM_HEALTH] - BACKEND & PIPELINE STATUS</div>
      <table className="raw-table">
        <thead>
          <tr>
            <th>SUBSYSTEM</th>
            <th>TARGET_ENDPOINT</th>
            <th>STATUS</th>
            <th>METRICS</th>
          </tr>
        </thead>
        <tbody>
          {subsystems.map((sub, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 'bold' }}>{sub.name}</td>
              <td>{sub.endpoint}</td>
              <td>[{sub.status}]</td>
              <td>{sub.latency ? `LATENCY: ${sub.latency}` : sub.lag ? `LAG: ${sub.lag}` : sub.memory ? `MEM: ${sub.memory}` : `GPUS: ${sub.gpus}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
