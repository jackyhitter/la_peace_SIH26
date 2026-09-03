import React, { useState } from 'react';

export default function AnprEvents() {
  const [filterText, setFilterText] = useState('');

  const events = [
    { id: 'EVT_901', time: '17:45:12.120', camera: 'CAM_01', plate: 'CH01AB1234', conf: 0.98, class: 'car', state: 'CH', speed: '52 km/h' },
    { id: 'EVT_902', time: '17:45:14.350', camera: 'CAM_02', plate: 'HR26DK9981', conf: 0.94, class: 'car', state: 'HR', speed: '98 km/h' },
    { id: 'EVT_903', time: '17:45:18.010', camera: 'CAM_01', plate: 'PB65Z1100', conf: 0.89, class: 'motorcycle', state: 'PB', speed: '44 km/h' },
    { id: 'EVT_904', time: '17:45:21.440', camera: 'CAM_03', plate: 'DL3CA8821', conf: 0.96, class: 'truck', state: 'DL', speed: '38 km/h' },
    { id: 'EVT_905', time: '17:45:25.800', camera: 'CAM_04', plate: 'CH01BQ5544', conf: 0.91, class: 'bus', state: 'CH', speed: '41 km/h' }
  ];

  const filtered = events.filter(e => e.plate.toLowerCase().includes(filterText.toLowerCase()) || e.camera.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div className="raw-box">
      <div className="raw-box-title">[MODULE: ANPR_OCR] - RAW LICENSE PLATE INGESTION LOG</div>
      
      <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>FILTER:</span>
        <input 
          type="text" 
          placeholder="Filter by plate or camera..." 
          value={filterText} 
          onChange={(e) => setFilterText(e.target.value)} 
          style={{ width: '260px' }}
        />
        <span>COUNT: {filtered.length}</span>
      </div>

      <table className="raw-table">
        <thead>
          <tr>
            <th>EVENT_ID</th>
            <th>TIMESTAMP</th>
            <th>CAMERA</th>
            <th>PLATE_NUMBER</th>
            <th>OCR_CONF</th>
            <th>VEHICLE_CLASS</th>
            <th>STATE</th>
            <th>SPEED</th>
            <th>CROP_STATUS</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(evt => (
            <tr key={evt.id}>
              <td>{evt.id}</td>
              <td>{evt.time}</td>
              <td>{evt.camera}</td>
              <td style={{ fontWeight: 'bold' }}>{evt.plate}</td>
              <td>{evt.conf}</td>
              <td>{evt.class}</td>
              <td>{evt.state}</td>
              <td>{evt.speed}</td>
              <td>[STORED: S3/MINIO]</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
