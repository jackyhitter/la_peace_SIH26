import React, { useState } from 'react';

export default function VehicleJourney() {
  const [targetPlate, setTargetPlate] = useState('CH01AB1234');

  const journeyData = {
    plate_number: 'CH01AB1234',
    vehicle_type: 'SUV (White Hyundai Creta)',
    reid_confidence: 0.96,
    total_hops: 3,
    start_time: '2026-09-03T10:00:15Z',
    end_time: '2026-09-03T10:13:42Z',
    waypoints: [
      { camera: 'CAM_01', location: 'Sector 17 North Gate', time: '10:00:15', speed: '48 km/h', delta_min: '0m' },
      { camera: 'CAM_02', location: 'Madhya Marg Junction', time: '10:07:30', speed: '54 km/h', delta_min: '+7m 15s' },
      { camera: 'CAM_03', location: 'Tribune Chowk Flyover', time: '10:13:42', speed: '61 km/h', delta_min: '+6m 12s' }
    ]
  };

  return (
    <div className="raw-split">
      <div className="raw-box">
        <div className="raw-box-title">[MODULE: REID_JOURNEY] - CROSS-CAMERA VEHICLE TRACKING</div>
        
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={targetPlate} 
            onChange={(e) => setTargetPlate(e.target.value)}
            style={{ width: '220px' }}
          />
          <button onClick={() => {}}>RECONSTRUCT JOURNEY</button>
        </div>

        <div style={{ marginBottom: '10px', fontSize: '12px', border: '1px solid #cccccc', background: '#fafafa', padding: '8px' }}>
          <div>TARGET: <b>{journeyData.plate_number}</b></div>
          <div>ATTRIBUTES: {journeyData.vehicle_type}</div>
          <div>REID_SCORE: {journeyData.reid_confidence} | TOTAL HOPS: {journeyData.total_hops}</div>
        </div>

        <table className="raw-table">
          <thead>
            <tr>
              <th>HOP #</th>
              <th>CAMERA_ID</th>
              <th>LOCATION</th>
              <th>TIMESTAMP</th>
              <th>DELTA_TIME</th>
              <th>SPEED</th>
            </tr>
          </thead>
          <tbody>
            {journeyData.waypoints.map((wp, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{wp.camera}</td>
                <td>{wp.location}</td>
                <td>{wp.time}</td>
                <td>{wp.delta_min}</td>
                <td>{wp.speed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="raw-box">
        <div className="raw-box-title">[RAW GRAPH EDGES] - TOPOLOGY TRANSITION</div>
        <pre className="raw-pre">
{JSON.stringify({
  origin: "CAM_01",
  transitions: [
    { from: "CAM_01", to: "CAM_02", distance_m: 1400, expected_transit_sec: 420, actual_transit_sec: 435, anomaly: false },
    { from: "CAM_02", to: "CAM_03", distance_m: 2900, expected_transit_sec: 360, actual_transit_sec: 372, anomaly: false }
  ],
  status: "COMPLETE_TRAJECTORY_RECONSTRUCTED"
}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
