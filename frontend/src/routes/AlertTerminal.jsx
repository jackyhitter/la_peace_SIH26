import React, { useState } from 'react';

export default function AlertTerminal() {
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT_901',
      type: 'BLACKLIST_MATCH',
      severity: 'CRITICAL',
      time: '17:48:02',
      camera: 'CAM_02',
      plate: 'CH01AB1234',
      details: 'Wanted: Stolen Vehicle FIR #4921/2026'
    },
    {
      id: 'ALT_902',
      type: 'OVERSPEEDING',
      severity: 'HIGH',
      time: '17:48:19',
      camera: 'CAM_03',
      plate: 'HR26DK9981',
      details: 'Speed: 98.4 km/h (Limit: 60 km/h)'
    },
    {
      id: 'ALT_903',
      type: 'NO_HELMET',
      severity: 'MEDIUM',
      time: '17:48:44',
      camera: 'CAM_01',
      plate: 'PB65Z1100',
      details: 'Rider & Pillion no safety helmet detected'
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(alerts[0]);

  return (
    <div className="raw-split">
      <div className="raw-box">
        <div className="raw-box-title">[MODULE: ALERTS] - REAL-TIME VIOLATION STREAM</div>
        
        <table className="raw-table">
          <thead>
            <tr>
              <th>ALERT_ID</th>
              <th>TIME</th>
              <th>SEVERITY</th>
              <th>VIOLATION_TYPE</th>
              <th>CAMERA</th>
              <th>PLATE</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr 
                key={a.id} 
                onClick={() => setSelectedAlert(a)}
                style={{ 
                  cursor: 'pointer',
                  background: selectedAlert?.id === a.id ? '#e0e0e0' : 'transparent'
                }}
              >
                <td>{a.id}</td>
                <td>{a.time}</td>
                <td style={{ fontWeight: a.severity === 'CRITICAL' ? 'bold' : 'normal' }}>[{a.severity}]</td>
                <td>{a.type}</td>
                <td>{a.camera}</td>
                <td style={{ fontWeight: 'bold' }}>{a.plate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="raw-box">
        <div className="raw-box-title">[RAW EVENT PAYLOAD INSPECTION]</div>
        {selectedAlert ? (
          <pre className="raw-pre">
{JSON.stringify(selectedAlert, null, 2)}
          </pre>
        ) : (
          <div>No alert selected</div>
        )}
      </div>
    </div>
  );
}
